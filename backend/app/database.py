import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "journeybuddy.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS saved_roadmaps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                target_role TEXT NOT NULL,
                skills TEXT NOT NULL,
                roadmap_json TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)


def save_roadmap(target_role, skills, roadmap_json):
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO saved_roadmaps
            (target_role, skills, roadmap_json)
            VALUES (?, ?, ?)
            """,
            (target_role, skills, roadmap_json),
        )
        return cursor.lastrowid


def list_saved_roadmaps():
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, target_role, skills, roadmap_json, created_at
            FROM saved_roadmaps
            ORDER BY id DESC
            """
        ).fetchall()
        return [dict(row) for row in rows]