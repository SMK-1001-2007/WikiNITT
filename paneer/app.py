import os
import sys

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from utils import RotatingGroqChat
from pydantic import BaseModel, Field
from langchain_core.tools import Tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from langchain_classic.storage import LocalFileStore, create_kv_docstore
from langchain_classic.retrievers.parent_document_retriever import ParentDocumentRetriever
from langchain_text_splitters import RecursiveCharacterTextSplitter

from dotenv import load_dotenv

load_dotenv()

DB_DIRECTORY = "bablu/nitt_vector_db"
PARENT_STORE_DIRECTORY = "bablu/nitt_parent_store"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
GROQ_API_KEYS = os.getenv("GROQ_API_KEYS")

def format_docs(docs):
    """Helper to join retrieved document chunks into a single string."""
    formatted_docs = []
    for doc in docs:
        source = doc.metadata.get("source_url", "Unknown Source")
        content = doc.page_content.replace("\n", " ")
        formatted_docs.append(f"Content: {content}\nSource: {source}")
    return "\n\n".join(formatted_docs)


def get_retriever():
    if not os.path.exists(DB_DIRECTORY):
        print(f"Error: DB directory '{DB_DIRECTORY}' not found.")
        return None

    print("Loading Embedding Model...")
    embedding_function = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

    print(f"Loading Database from {DB_DIRECTORY}...")
    vector_db = Chroma(
        persist_directory=DB_DIRECTORY, 
        embedding_function=embedding_function,
        collection_name="nitt_data"
    )
    
    print(f"Loading Parent Store from {PARENT_STORE_DIRECTORY}...")
    fs_store = LocalFileStore(PARENT_STORE_DIRECTORY)
    store = create_kv_docstore(fs_store)
    
    child_splitter = RecursiveCharacterTextSplitter(chunk_size=256, chunk_overlap=32)
    parent_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)

    retriever = ParentDocumentRetriever(
        vectorstore=vector_db,
        docstore=store,
        child_splitter=child_splitter,
        parent_splitter=parent_splitter,
    )
    return retriever

def get_chat_agent():
    # Helper to parse keys if string
    api_keys = []
    if GROQ_API_KEYS:
        if GROQ_API_KEYS.startswith('['):
            api_keys = json.loads(GROQ_API_KEYS)
        else:
            api_keys = GROQ_API_KEYS.split(',')
            
    if not api_keys:
        print("Error: GROQ_API_KEYS not found. Please set it.")
        return None, []

    retriever = get_retriever()
    if not retriever:
        return None, []

    class SearchInput(BaseModel):
        query: str = Field(description="The query to search for information about NIT Trichy.")

    def search_nitt_func(query: str):
        """Searches for information about NIT Trichy."""
        print(f"   (🔍 Searching: {query})")
        docs = retriever.invoke(query)
        if not docs:
            return "No results found. The database does not contain information matching this query."
        return format_docs(docs)

    tool = Tool(
        name="search_nitt_data",
        func=search_nitt_func,
        description="Searches for information about NIT Trichy, courses, events, campus details, and academic regulations. Use this whenever you need factual information about the institute.",
        args_schema=SearchInput
    )
    tools = [tool]
    
    # Use our new RotatingGroqChat wrapper
    # Using the model from RagProcessor as requested/approved
    llm = RotatingGroqChat(
        api_keys=api_keys,
        model_name="llama-3.1-8b-instant",
        temperature=0.3
    )
    
    llm_with_tools = llm.bind_tools(tools)
    return llm_with_tools, tools
