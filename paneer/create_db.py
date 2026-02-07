import os
import json 
from tqdm import tqdm
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from bs4 import BeautifulSoup

DATA_DIRECTORY = "bablu/nitt_data_scrapy"
DB_DIRECTORY = "nitt_vector_db"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"


def load_documents(directory):
    documents = []
    
    if not os.path.exists(directory):
        print(f"Error: Directory '{directory}' not found.")
        return []

    all_files = os.listdir(directory)
    content_files = [f for f in all_files if f.endswith(('.html', '.pdf'))]
    
    print(f"Found {len(content_files)} total files.")
    print(f"Applying Junk Filter...")
    
            
    print(f"Processing {len(all_files)} valid files (Skipped {len(content_files) - len(all_files)} junk files)")

    for filename in tqdm(all_files, desc="Ingesting", unit="file"):
        file_path = os.path.join(directory, filename)
        
        base_name = os.path.splitext(filename)[0]
        meta_path = os.path.join(directory, f"{base_name}.meta.json")
        
        source_url = "Unknown Source"
        if os.path.exists(meta_path):
            try:
                with open(meta_path, "r", encoding="utf-8") as f:
                    meta_data = json.load(f)
                    source_url = meta_data.get("url", "Unknown Source")
            except Exception:
                pass

        try:
            if filename.endswith(".html"):
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    soup = BeautifulSoup(f.read(), "html.parser")
                
                # Remove script and style elements
                for script in soup(["script", "style", "header", "footer", "nav", "form", "iframe", "noscript", "svg"]):
                    script.extract()
                
                # Remove specific classes or ids known to be junk (common in scraped sites)
                for div in soup.find_all("div", class_=["navbar", "menu", "sidebar", "footer", "header", "breadcrumb"]):
                    div.extract()

                text = soup.get_text(separator="\n")
                
                # Clean up text
                clean_text = "\n".join([line.strip() for line in text.splitlines() if line.strip()])
                
                # Specific filter for common junk lines in this dataset
                junk_phrases = [
                    "Other Links", "Tenders and Notices", "Job Opportunities", "RTI", "Alumni", "Sitemap", "Contact Us",
                    "National Institute of Technology", "Tiruchirappalli", "Tamil Nadu", "India"
                ]
                
                # If a large chunk of the text is just these phrases, skip or clean
                if any(phrase in clean_text[:200] for phrase in junk_phrases) and len(clean_text) < 500:
                    # Likely a navigation fragment
                    continue

                if len(clean_text) < 100: 
                    continue

                doc = Document(
                    page_content=clean_text, 
                    metadata={
                        "source": filename, 
                        "source_url": source_url,
                        "type": "html"
                    }
                )
                documents.append(doc)

            elif filename.endswith(".pdf"):
                try:
                    loader = PyPDFLoader(file_path)
                    pdf_docs = loader.load()
                    
                    for doc in pdf_docs:
                        doc.metadata["source"] = filename
                        doc.metadata["type"] = "pdf"
                        doc.metadata["source_url"] = source_url
                        documents.append(doc)
                except Exception as e:
                    continue

        except Exception as e:
            continue
            
    return documents

def create_vector_db(documents):
    if not documents:
        print("No documents to process!")
        return

    print(f"Splitting {len(documents)} documents into chunks...")
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", " ", ""]
    )
    
    chunks = text_splitter.split_documents(documents)
    print(f"Generated {len(chunks)} chunks.")

    print("Initializing Embedding Model...")
    embedding_function = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

    print(f"Saving to ChromaDB at '{DB_DIRECTORY}'...")
    
    BATCH_SIZE = 5000
    for i in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[i:i + BATCH_SIZE]
        print(f"   Writing batch {i} to {i+len(batch)}...")
        Chroma.from_documents(
            documents=batch,
            embedding=embedding_function,
            persist_directory=DB_DIRECTORY
        )
        
    print("✅ Ingestion Complete! Database is ready.")

if __name__ == "__main__":
    raw_docs = load_documents(DATA_DIRECTORY)
    create_vector_db(raw_docs)