import os
from cryptography.fernet import Fernet
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

load_dotenv()

def get_fernet():
    key = os.getenv("FERNET_KEY")
    if not key:
        raise ImproperlyConfigured("FERNET_KEY is not set in environment variables.")
    return Fernet(key)

def encrypt_text(plain_text: str) -> str:
    if not plain_text:
        return ""
    f = get_fernet()
    return f.encrypt(plain_text.encode()).decode()

def decrypt_text(encrypted_text: str) -> str:
    if not encrypted_text:
        return ""
    f = get_fernet()
    return f.decrypt(encrypted_text.encode()).decode()
