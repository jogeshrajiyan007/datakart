from django.urls import path
from rest_framework.routers import DefaultRouter
from api.views import (
    RegisterViewset,
    LoginView,
    LogoutView,
    LocalConnectorDownloadView,
    LocalConnectorHealthCheckView,
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

router = DefaultRouter()
router.register('register', RegisterViewset, basename='register')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Local connector endpoints
    path('connector/download/', LocalConnectorDownloadView.as_view(), name='local_connector_download'),
    path('connector/health/', LocalConnectorHealthCheckView.as_view(), name='local_connector_health'),
]

urlpatterns += router.urls
