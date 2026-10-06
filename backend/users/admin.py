from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('id', 'login', 'full_name', 'email', 'is_admin', 'is_active')
    list_filter = ('is_admin', 'is_active')
    search_fields = ('login', 'email', 'full_name')
    ordering = ('id',)

    fieldsets = (
        (None, {'fields': ('login', 'password')}),
        ('Личная информация', {'fields': ('full_name', 'email')}),
        ('Права', {'fields': ('is_admin', 'is_active', 'is_superuser', 'is_staff', 'groups', 'user_permissions')}),
        ('Хранилище', {'fields': ('storage_path',)}),
        ('Даты', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('login', 'full_name', 'email', 'password1', 'password2', 'is_admin'),
        }),
    )

