from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.http import FileResponse, Http404, JsonResponse
from django.conf import settings
from firebase_config import storage_bucket
from rest_framework.parsers import MultiPartParser, FormParser
import os
import requests

from .serializers import RegisterSerializer

User = get_user_model()

# ---------------- Register ----------------
class RegisterViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    queryset = User.objects.all()

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(self.serializer_class(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------------- Login ----------------
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=email, password=password)
        if user is None:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        update_last_login(None, user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
            }
        })

# ---------------- Logout ----------------
class LogoutView(APIView):
    permission_classes = []

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"detail": "Refresh token is required"}, status=400)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response({"detail": "Invalid token"}, status=400)
        return Response({"detail": "Logged out successfully"}, status=205)


# ---------------- Local Connector Download ----------------
class LocalConnectorDownloadView(APIView):
    """
    Endpoint to download the local_db_connector.zip file.
    Use environment variable LOCAL_CONNECTOR_PATH in DEV/PROD.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        connector_path = os.environ.get(
            "LOCAL_CONNECTOR_PATH",
            os.path.join(settings.BASE_DIR, "connector/local_db_connector.zip")
        )

        if not os.path.exists(connector_path):
            raise Http404("Connector file not found")

        response = FileResponse(open(connector_path, 'rb'))
        response['Content-Disposition'] = 'attachment; filename="local_db_connector.zip"'
        return response


# ---------------- Local Connector Health Check ----------------

class LocalConnectorHealthCheckView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        connector_url = request.data.get("url")
        api_token = request.data.get("token")
        if not connector_url or not api_token:
            return Response({"detail": "Connector URL and API token required"}, status=400)

        try:
            resp = requests.get(
                f"{connector_url}/health",
                headers={"X-API-TOKEN": api_token},
                timeout=5
            )
            return Response(resp.json(), status=resp.status_code)
        except requests.RequestException as e:
            return Response({"detail": str(e)}, status=500)

# ---------------- Firebase Storage File Upload ----------------

class FirebaseFileUploadView(APIView):
    """
    Upload files to Firebase Storage (Emulator or Live)
    """
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)  # Handles multipart/form-data

    def post(self, request):
        files = request.FILES.getlist("file")  # <-- get all files
        if not files:
            return Response({"detail": "No files uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_names = []

        try:
            for file_obj in files:
                print("🔥 Uploading file to Firebase Storage...")
                print("Bucket name:", storage_bucket.name)
                print("File name:", file_obj.name)
                print("Content type:", file_obj.content_type)

                blob = storage_bucket.blob(file_obj.name)
                blob.upload_from_file(file_obj, content_type=file_obj.content_type)
                uploaded_names.append(file_obj.name)
                print("✅ Upload complete:", file_obj.name)

            return Response({
                "message": "Files uploaded successfully",
                "files": uploaded_names
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
