from django.contrib.auth.hashers import make_password
from django.db import migrations


def create_admin(apps, schema_editor):
    User = apps.get_model('users', 'User')
    if not User.objects.filter(login='admin').exists():
        User.objects.create(
            login='admin',
            full_name='Administrator',
            email='admin@example.com',
            password=make_password('Admin123!'),
            is_admin=True,
            is_superuser=True,
            is_staff=True,
            storage_path='admin',
        )


def delete_admin(apps, schema_editor):
    User = apps.get_model('users', 'User')
    User.objects.filter(login='admin').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_admin, delete_admin),
    ]
