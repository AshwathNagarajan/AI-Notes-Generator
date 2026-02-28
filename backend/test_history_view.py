"""
Test script to view history records from the database.
Run with: python test_history_view.py
This file is for testing purposes and should not be committed to the project.
"""

import asyncio
import json
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def view_history():
    """Connect to MongoDB and display all history records."""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    history_collection = db['history']
    
    try:
        # Get count of records
        count = await history_collection.count_documents({})
        print(f"\n{'='*80}")
        print(f"Total History Records: {count}")
        print(f"{'='*80}\n")
        
        if count == 0:
            print("No history records found in the database.")
            return
        
        # Get all history records
        cursor = history_collection.find({})
        records = await cursor.to_list(length=None)
        
        # Display records
        for idx, record in enumerate(records, 1):
            print(f"\n--- Record {idx} ---")
            print(f"ID: {record.get('_id', 'N/A')}")
            print(f"User ID: {record.get('user_id', 'N/A')}")
            print(f"Feature Type: {record.get('feature_type', 'N/A')}")
            print(f"Status: {record.get('status', 'N/A')}")
            print(f"Processing Time: {record.get('processing_time', 'N/A')} seconds")
            print(f"Created At: {record.get('created_at', 'N/A')}")
            print(f"Updated At: {record.get('updated_at', 'N/A')}")
            
            # Display input data
            input_data = record.get('input_data', {})
            print(f"\nInput Data:")
            print(json.dumps(input_data, indent=2, default=str))
            
            # Display output data (truncated if too long)
            output_data = record.get('output_data', {})
            output_str = json.dumps(output_data, indent=2, default=str)
            if len(output_str) > 500:
                print(f"\nOutput Data (truncated):")
                print(output_str[:500] + "\n... (truncated)")
            else:
                print(f"\nOutput Data:")
                print(output_str)
            
            print(f"\n{'-'*80}")
        
        print(f"\nTotal Records Displayed: {len(records)}")
        
    except Exception as e:
        print(f"Error querying history: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Close connection
        client.close()
        print("\nDatabase connection closed.")

if __name__ == "__main__":
    print("Starting history database viewer...\n")
    asyncio.run(view_history())
