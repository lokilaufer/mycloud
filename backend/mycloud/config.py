import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Django
SECRET_KEY = 'django-insecure-mycloud-change-me-in-production-0123456789abcdef'
DEBUG = True
ALLOWED_HOSTS = ['*']

# PostgreSQL
DB_NAME = 'mycloud_db'
DB_USER = 'mycloud_user'
DB_PASSWORD = 'mycloud_pass'
DB_HOST = 'localhost'
DB_PORT = '5433'

# Storage
STORAGE_ROOT = os.path.join(BASE_DIR, 'storage_root')