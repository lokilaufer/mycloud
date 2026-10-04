from rest_framework import serializers

from .models import File


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = [
            'id', 'original_name', 'size', 'uploaded_at',
            'last_downloaded_at', 'comment', 'special_link',
        ]
        read_only_fields = [
            'size', 'uploaded_at', 'last_downloaded_at', 'special_link',
        ]
