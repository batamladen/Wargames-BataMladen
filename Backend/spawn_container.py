"""
spawn_container.py
------------------
Spawns a Docker container for a specific wargame challenge and level.

Each level container is isolated, given a random SSH port,
and automatically removed after being stopped.

This version is sanitized for public sharing — no real IPs, paths, or secrets included.
"""

import os
import docker
import sqlite3
import random
import socket
import sys
from datetime import datetime
from pathlib import Path

# --- Usage ---
if len(sys.argv) != 3:
    print("Usage: python3 spawn_container.py <challenge> <level>")
    sys.exit(1)

challenge = sys.argv[1].lower().replace(" ", "-")
level = sys.argv[2].lower().replace(" ", "-")

# --- Configuration ---
SSH_HOST = "your.server.ip.or.hostname"           
CONTAINERS_DB_PATH = "./data/containers.db"       
CONTAINER_HOSTNAME = "level-host"                 
PORT_MIN = 2000                                   # min random SSH port
PORT_MAX = 30000                                  # max random SSH port

username = f"{challenge}_level{level}"
image_name = f"{challenge}-level{level}-image"

# --- Docker client initialization ---
client = docker.from_env()

def get_free_port():
    """Find a free TCP port within the allowed range."""
    while True:
        port = random.randint(PORT_MIN, PORT_MAX)
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.2)
            if s.connect_ex(("localhost", port)) != 0:
                return port

port = get_free_port()

# --- Start container ---
try:
    container = client.containers.run(
        image=image_name,
        name=f"{challenge}-level{level}-{port}",
        hostname=CONTAINER_HOSTNAME,
        ports={"22/tcp": port},
        detach=True,
        auto_remove=True,
    )
except docker.errors.ImageNotFound:
    print(f"❌ Docker image '{image_name}' not found. Please build it first.")
    sys.exit(1)
except Exception as e:
    print(f"❌ Failed to start container: {e}")
    sys.exit(1)

# --- Database setup ---
db_path = Path(CONTAINERS_DB_PATH)
db_path.parent.mkdir(parents=True, exist_ok=True)

try:
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS containers (
            id TEXT PRIMARY KEY,
            port INTEGER UNIQUE,
            created_at TIMESTAMP,
            challenge TEXT,
            level TEXT
        )
        """
    )
    cursor.execute(
        """
        INSERT INTO containers (id, port, created_at, challenge, level)
        VALUES (?, ?, ?, ?, ?)
        """,
        (container.id, port, datetime.utcnow().isoformat(), challenge, level),
    )
    conn.commit()
    conn.close()
except Exception as e:
    print(f"⚠️ Failed to insert into database: {e}")

# --- Output ---
print("\n✅ Level container started successfully!")
print("Connect via SSH using the following command:\n")
print(f"ssh {username}@{SSH_HOST} -p {port}\n")
