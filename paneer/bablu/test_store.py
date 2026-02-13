
import os
from langchain_classic.storage import LocalFileStore
from langchain_core.documents import Document

STORE_DIR = "nitt_parent_store_test"

def test_store():
    # Remove existing store for clean test
    if os.path.exists(STORE_DIR):
        import shutil
        shutil.rmtree(STORE_DIR)
        
    print(f"Creating store at {STORE_DIR}")
    store = LocalFileStore(STORE_DIR)
    
    print("Adding documents...")
    doc1 = Document(page_content="Hello World", metadata={"id": "1"})
    
    # Simulate ParentDocumentRetriever usage
    # ParentDocumentRetriever uses .mset() internally on the docstore
    # It maps doc_id -> Document
    
    store.mset([("doc1", doc1)])
    
    # Check if files were created
    files = os.listdir(STORE_DIR)
    print(f"Files in store: {files}")
    
    # Verify retrieval
    retrieved = store.mget(["doc1"])
    print(f"Retrieved: {retrieved}")

if __name__ == "__main__":
    test_store()
