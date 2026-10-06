from django.contrib import admin

from .models import File


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('id', 'original_name', 'owner', 'size', 'uploaded_at',
                    'last_downloaded_at', 'special_link')
    list_filter = ('owner',)
    search_fields = ('original_name', 'comment')
    readonly_fields = ('special_link', 'uploaded_at')
    ordering = ('-uploaded_at',)
