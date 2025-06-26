from .connection import create_database_connection


_db = None


def get_database():
    """Returns the database connection, initializing it if needed."""
    global _db
    if _db is None:
        _db = create_database_connection()
    return _db
