from django.contrib.auth import get_user_model
from django.contrib.auth.models import update_last_login
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer
from django.contrib.auth import authenticate

User = get_user_model()


# ---------------- Register Viewset ----------------
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


# ---------------- Login API ----------------
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate using email
        user = authenticate(username=email, password=password)
        if user is None:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate JWT tokens
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
