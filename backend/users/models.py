import re

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError
from django.db import models


def validate_login(value):
    if not re.match(r'^[A-Za-z][A-Za-z0-9]{3,19}$', value):
        raise ValidationError(
            'Логин: только латиница и цифры, первый символ — буква, длина 4–20.'
        )


def validate_password_strength(value):
    if len(value) < 6:
        raise ValidationError('Пароль: минимум 6 символов.')
    if not re.search(r'[A-Z]', value):
        raise ValidationError('Пароль: минимум одна заглавная буква.')
    if not re.search(r'\d', value):
        raise ValidationError('Пароль: минимум одна цифра.')
    if not re.search(r'[^A-Za-z0-9]', value):
        raise ValidationError('Пароль: минимум один специальный символ.')


class UserManager(BaseUserManager):
    def create_user(self, login, password=None, **extra):
        if not login:
            raise ValueError('Логин обязателен')
        user = self.model(login=login, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, login, password=None, **extra):
        extra.setdefault('is_admin', True)
        extra.setdefault('is_superuser', True)
        extra.setdefault('is_staff', True)
        return self.create_user(login, password, **extra)


class User(AbstractBaseUser, PermissionsMixin):
    login = models.CharField(
        max_length=20, unique=True, validators=[validate_login]
    )
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    storage_path = models.CharField(max_length=255, unique=True)

    USERNAME_FIELD = 'login'
    REQUIRED_FIELDS = ['full_name', 'email']

    objects = UserManager()

    def __str__(self):
        return self.login