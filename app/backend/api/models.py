from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.conf import settings
from .utils.crypto import encrypt_text, decrypt_text
import uuid

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150, blank=True,default='')
    organization = models.CharField(max_length=150, blank=True,default='')
    role = models.CharField(max_length=100, blank=True,default='')
    country = models.CharField(max_length=100, blank=True,default='')
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # no username required

    def __str__(self):
        return self.email



class DataSourceConnection(models.Model):
    """
    Stores saved cloud connections per user.
    Passwords are encrypted using Fernet before saving.
    """
    connector_id = models.CharField(
        primary_key=True,
        max_length=64,
        default=uuid.uuid4,  # fallback if frontend doesn't send
        editable=False,
        unique=True
    )
    name = models.CharField(max_length=128, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="connections")

    host = models.CharField(max_length=255, blank=True, null=True)
    port = models.CharField(max_length=16, blank=True, null=True)
    username = models.CharField(max_length=128, blank=True, null=True)
    _password = models.TextField(db_column='password', blank=True, null=True)
    database = models.CharField(max_length=128, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "connector_id", "host", "port", "username", "database")
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.connector_id} ({self.host}:{self.port}) - {self.user.email}"

    # Encrypt on save
    def save(self, *args, **kwargs):
        if self._password and not self._password.startswith("gAAAA"):
            self._password = encrypt_text(self._password)
        super().save(*args, **kwargs)

    # Decrypt when accessed
    @property
    def password(self):
        try:
            return decrypt_text(self._password)
        except Exception:
            return None

    @password.setter
    def password(self, value):
        self._password = encrypt_text(value) if value else None