from tinydb import TinyDB, Query
import bcrypt
import os

DB_PATH = os.path.join(os.path.dirname(__file__),"users.json")
db = TinyDB(DB_PATH)
user = Query()

def hash_password(password: str):
    return bcrypt.hashpw(password.encode(),bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str):
    return bcrypt.checkpw(password.encode(),hashed.encode())

def register_user(email: str,password:str, first_name: str, last_name:str):
    if db.search(user.email == email):
        return False
    db.insert({
        "email": email, 
        "password":hash_password(password),
        "first_name": first_name,
        "last_name": last_name
        })
    return True

def check_credentials(email: str, password: str):
    _user = db.get(user.email == email)
    if not _user:
        return False
    return verify_password(password,_user["password"])