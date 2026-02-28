"""
Comprehensive test script to view ALL history records from the database organized by feature type.
Run with: python test_history_comprehensive.py
This file is for testing purposes and should not be committed to the project.
"""

import asyncio
import json
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def view_complete_history():
    """Connect to MongoDB and display all history records organized by feature type."""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    history_collection = db['history']
    
    try:
        # Get count of records
        total_count = await history_collection.count_documents({})
        print(f"\n{'='*80}")
        print(f"COMPLETE HISTORY DATABASE REPORT")
        print(f"{'='*80}")
        print(f"Total History Records: {total_count}")
        print(f"{'='*80}\n")
        
        if total_count == 0:
            print("No history records found in the database.")
            return
        
        # Get feature types and their counts
        feature_types_pipeline = [
            {
                "$group": {
                    "_id": "$feature_type",
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {"count": -1}
            }
        ]
        
        feature_stats = await history_collection.aggregate(feature_types_pipeline).to_list(None)
        
        print("\n📊 FEATURE TYPE BREAKDOWN:")
        print("-" * 80)
        for stat in feature_stats:
            feature_type = stat.get('_id', 'Unknown')
            count = stat.get('count', 0)
            print(f"  • {feature_type.upper():<15} : {count:>4} records")
        
        # Get unique users
        users_pipeline = [
            {
                "$group": {
                    "_id": "$user_id"
                }
            }
        ]
        unique_users = await history_collection.aggregate(users_pipeline).to_list(None)
        print(f"\n👥 Unique Users: {len(unique_users)}")
        
        # Get all records grouped by feature type
        for stat in feature_stats:
            feature_type = stat.get('_id', 'Unknown')
            count = stat.get('count', 0)
            
            print(f"\n{'='*80}")
            print(f"📋 {feature_type.upper()} - {count} records")
            print(f"{'='*80}")
            
            # Get records for this feature type
            cursor = history_collection.find({"feature_type": feature_type}).sort("created_at", -1)
            records = await cursor.to_list(length=None)
            
            for idx, record in enumerate(records, 1):
                print(f"\n  Record {idx}:")
                print(f"    ID: {record.get('_id', 'N/A')}")
                print(f"    User ID: {record.get('user_id', 'N/A')}")
                print(f"    Status: {record.get('status', 'N/A')}")
                print(f"    Processing Time: {record.get('processing_time', 'N/A')} seconds")
                print(f"    Created: {record.get('created_at', 'N/A')}")
                
                # Display input data
                input_data = record.get('input_data', {})
                if input_data:
                    print(f"    Input Data:")
                    input_str = json.dumps(input_data, indent=6, default=str)
                    for line in input_str.split('\n'):
                        print(f"      {line}")
                
                # Display output data (truncated if too long)
                output_data = record.get('output_data', {})
                if output_data:
                    output_str = json.dumps(output_data, indent=6, default=str)
                    if len(output_str) > 300:
                        print(f"    Output Data (truncated):")
                        for line in output_str[:300].split('\n'):
                            print(f"      {line}")
                        print(f"      ... (truncated, showing 300 chars of {len(output_str)} total)")
                    else:
                        print(f"    Output Data:")
                        for line in output_str.split('\n'):
                            print(f"      {line}")
                
                print(f"    {'-'*76}")
        
        # Summary statistics
        print(f"\n{'='*80}")
        print(f"📈 SUMMARY STATISTICS")
        print(f"{'='*80}")
        
        # Average processing time
        avg_time_pipeline = [
            {
                "$match": {"processing_time": {"$ne": None}}
            },
            {
                "$group": {
                    "_id": None,
                    "avg_time": {"$avg": "$processing_time"},
                    "max_time": {"$max": "$processing_time"},
                    "min_time": {"$min": "$processing_time"}
                }
            }
        ]
        
        time_stats = await history_collection.aggregate(avg_time_pipeline).to_list(None)
        if time_stats:
            stats = time_stats[0]
            print(f"Average Processing Time: {stats.get('avg_time', 0):.2f} seconds")
            print(f"Maximum Processing Time: {stats.get('max_time', 0):.2f} seconds")
            print(f"Minimum Processing Time: {stats.get('min_time', 0):.2f} seconds")
        
        # Status breakdown
        status_pipeline = [
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }
            }
        ]
        
        status_stats = await history_collection.aggregate(status_pipeline).to_list(None)
        print(f"\nStatus Breakdown:")
        for stat in status_stats:
            status = stat.get('_id', 'Unknown')
            count = stat.get('count', 0)
            print(f"  • {status.upper():<15} : {count:>4} records")
        
        print(f"\n{'='*80}\n")
        
    except Exception as e:
        print(f"Error querying history: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Close connection
        client.close()
        print("Database connection closed.")

if __name__ == "__main__":
    print("Starting comprehensive history database viewer...\n")
    asyncio.run(view_complete_history())
