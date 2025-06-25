from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()


def get_database():
    try:

        client = MongoClient(os.getenv("MONGODB_URI"))

        db_name = os.getenv("MONGODB_DB_NAME")
        db = client[db_name]

        db.list_collection_names()

        print(f"Database '{db_name}' connected successfully!")
        return db
    except Exception as e:
        print(f"Failed to connect to the database. Error: {e}")
        return None
