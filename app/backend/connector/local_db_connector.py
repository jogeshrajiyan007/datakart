import os
import sys
import secrets
import socket
import mysql.connector
import psycopg2
from flask import Flask, request, jsonify
from getpass import getpass
from flask_cors import CORS
from pyngrok import ngrok
import threading
import time
import contextlib

app = Flask(__name__)
CORS(app)

# ==== Utility: Find a free port ====
def get_free_port(start=5000, end=6000):
    for port in range(start, end):
        with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
            if s.connect_ex(("127.0.0.1", port)) != 0:
                return port
    raise RuntimeError("No available ports found between 5000 and 6000")

# ==== Utility: Get local IP ====
def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
    return ip

# ==== Setup Config ====
def setup_config():
    print("\n=== Local Database Connector ===")
    db_type = input("Enter DB type (mysql/postgres): ").strip().lower()

    if db_type not in ["mysql", "postgres"]:
        print("❌ Unsupported DB type.")
        sys.exit(1)

    host = input("Enter host (default: localhost): ") or "localhost"
    port = input("Enter port (default: 3306 for MySQL, 5432 for Postgres): ") or (
        "3306" if db_type == "mysql" else "5432"
    )
    user = input("Enter username: ").strip()
    password = getpass("Enter password: ").strip()
    database = input("Enter database name: ").strip()

    token = secrets.token_hex(16)
    local_port = get_free_port()
    ip = get_local_ip()
    print(f"\n🔑 Your API Token (keep this secret!): {token}")
    print(f"🌐 Connector starting locally at: http://{ip}:{local_port}")
    print("Keep this window open while your web app connects.\n")

    return {
        "db_type": db_type,
        "host": host,
        "port": port,
        "user": user,
        "password": password,
        "database": database,
        "token": token,
        "local_port": local_port,
    }

config = setup_config()

# ==== Security Middleware ====
@app.before_request
def verify_token():
    if request.path != "/health":
        token = request.headers.get("X-API-TOKEN")
        if token != config["token"]:
            return jsonify({"error": "Unauthorized"}), 401

# ==== Health Endpoint ====
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "db": config["database"], "type": config["db_type"]})

# ==== Query Execution ====
@app.route("/query", methods=["POST"])
def execute_query():
    data = request.get_json()
    query = (data.get("query") or "").strip()
    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400

    try:
        if config["db_type"] == "mysql":
            conn = mysql.connector.connect(
                host=config["host"], port=config["port"],
                user=config["user"], password=config["password"],
                database=config["database"]
            )
            cursor = conn.cursor(dictionary=True)
        elif config["db_type"] == "postgres":
            conn = psycopg2.connect(
                host=config["host"], port=config["port"],
                user=config["user"], password=config["password"],
                dbname=config["database"]
            )
            cursor = conn.cursor()
        else:
            return jsonify({"error": "Unsupported DB type"}), 400

        cursor.execute(query)

        if query.lower().startswith("select"):
            rows = cursor.fetchall()
            if config["db_type"] == "postgres":
                columns = [desc[0] for desc in cursor.description]
                rows = [dict(zip(columns, r)) for r in rows]
            result = rows
        else:
            conn.commit()
            result = {"status": "success"}

        cursor.close()
        conn.close()
        return jsonify(result)

    except Exception as e:
        try: cursor.close()
        except: pass
        try: conn.close()
        except: pass
        return jsonify({"error": str(e)}), 500

# ==== Flask Runner ====
def run_flask():
    app.run(host="0.0.0.0", port=config["local_port"], debug=False, use_reloader=False)

# ==== Ngrok Tunnel ====
def start_ngrok():
    print("🚀 Starting Flask connector with Ngrok...")
    public_url = ngrok.connect(config["local_port"], "http").public_url
    print(f"\n✅ Public URL: {public_url}")
    print(f"🔑 API Token: {config['token']}")
    print("Keep this window open while your web app connects...\n")
    return public_url

if __name__ == "__main__":
    # Start Flask in a background thread
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()

    # Start ngrok tunnel
    public_url = start_ngrok()

    # Wait for user input to quit
    try:
        while True:
            cmd = input("Press 'Q' to quit: ").strip().lower()
            if cmd == "q":
                print("🛑 Shutting down connector and Ngrok tunnel...")
                ngrok.disconnect(public_url)
                ngrok.kill()
                sys.exit(0)
    except KeyboardInterrupt:
        print("\n🛑 Interrupted. Shutting down connector and Ngrok tunnel...")
        ngrok.disconnect(public_url)
        ngrok.kill()
        sys.exit(0)
