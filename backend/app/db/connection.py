from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()


def get_database():
    try:
        mongo_uri = os.getenv("MONGODB_URI", "mongodb://mongodb:27017")
        db_name = os.getenv("MONGODB_DB_NAME", "Testing")

        print(f"Attempting to connect to MongoDB at: {mongo_uri}")

        client = MongoClient(mongo_uri)
        db = client[db_name]

        db.list_collection_names()

        print(f"Database '{db_name}' connected successfully!")
        return db
    except Exception as e:
        print(f"Failed to connect to the database. Error: {e}")
        print(f"MongoDB URI: {os.getenv('MONGODB_URI', 'Not set')}")
        print(f"Database Name: {os.getenv('MONGODB_DB_NAME', 'Not set')}")
        return None
