import chromadb

client = chromadb.HttpClient(host="localhost", port=8001)

collections = client.list_collections()
print(f"Found {len(collections)} collections.")

for col_info in collections:
    col_name = col_info if isinstance(col_info, str) else col_info.name
    
    print(f"\n--- Collection: {col_name} ---")
    
    collection = client.get_collection(name=col_name)
    
    count = collection.count()
    print(f"Total items: {count}")
    
    print("\n[First 5 Items]:")
    print(collection.peek(limit=5))
    
    all_data = collection.get(limit=count) 
    