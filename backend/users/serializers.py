import re

from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'login', 'full_name', 'email', 'password']

    def validate_login(self, value):
        if not re.match(r'^[A-Za-z][A-Za-z0-9]{3,19}$', value):
            raise serializers.ValidationError(
                'Логин: только латиница и цифры, первый символ — буква, длина 4–20.'
            )
        return value

    def validate_email(self, value):
        if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', value):
            raise serializers.ValidationError('Некорректный email.')
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError('Минимум 6 символов.')
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError('Нужна заглавная буква.')
        if not re.search(r'\d', value):
            raise serializers.ValidationError('Нужна цифра.')
        if not re.search(r'[^A-Za-z0-9]', value):
            raise serializers.ValidationError('Нужен спецсимвол.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        login = validated_data['login']
        user = User(**validated_data)
        user.set_password(password)
        user.storage_path = login
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    files_count = serializers.SerializerMethodField()
    files_size = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'login', 'full_name', 'email', 'is_admin',
            'files_count', 'files_size',
        ]

    def get_files_count(self, obj):
        return obj.files.count()

    def get_files_size(self, obj):
        return sum(f.size for f in obj.files.all())
