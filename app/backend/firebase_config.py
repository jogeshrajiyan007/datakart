import os
from firebase_admin import credentials, initialize_app, storage
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# Point Firebase SDK to the emulator (if running locally)
storage_emulator_host = os.getenv("STORAGE_EMULATOR_HOST", "http://localhost:9199")
os.environ["STORAGE_EMULATOR_HOST"] = storage_emulator_host

# Load your Firebase service account key
cred = credentials.Certificate(
    os.path.join(os.path.dirname(__file__), "firebase-admin-serviceAccountKey.json")
)

# Initialize Firebase app
firebase_app = initialize_app(cred, {
    "storageBucket": "datakart-backend.firebasestorage.app"  # from emulator UI
})

# Get a handle to the bucket (local or real, depending on env)
storage_bucket = storage.bucket(app=firebase_app)
