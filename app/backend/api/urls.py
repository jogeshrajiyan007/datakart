from django.urls import path
from rest_framework.routers import DefaultRouter
from api.views import RegisterViewset, LoginView, LogoutView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenVerifyView

router = DefaultRouter()
router.register('register', RegisterViewset, basename='register')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

urlpatterns += router.urls
