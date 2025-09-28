from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RegisterViewset, LoginView
from rest_framework_simplejwt.views import TokenRefreshView

# Router for register
router = DefaultRouter()
router.register('register', RegisterViewset, basename='register')

urlpatterns = [
    # Login endpoint
    path('login/', LoginView.as_view(), name='login'),

    # JWT token refresh
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Include the register router URLs
urlpatterns += router.urls
