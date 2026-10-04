import logging
import os
import uuid
from datetime import datetime

from django.conf import settings
from django.http import FileResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import File
from .serializers import FileSerializer

logger = logging.getLogger(__name__)


def user_storage_dir(user):
    path = os.path.join(settings.STORAGE_ROOT, user.storage_path)
    os.makedirs(path, exist_ok=True)
    return path


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def files_list(request):
    user_id = request.query_params.get('user_id')
    if user_id and request.user.is_admin:
        files = File.objects.filter(owner_id=user_id).order_by('-uploaded_at')
    else:
        files = File.objects.filter(owner=request.user).order_by('-uploaded_at')
    return Response(FileSerializer(files, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    file = request.FILES.get('file')
    comment = request.data.get('comment', '')
    if not file:
        return Response({'detail': 'Файл не передан'}, status=400)

    unique_name = f'{uuid.uuid4().hex}_{file.name}'
    dir_path = user_storage_dir(request.user)
    full_path = os.path.join(dir_path, unique_name)

    with open(full_path, 'wb+') as f:
        for chunk in file.chunks():
            f.write(chunk)

    rel_path = os.path.relpath(full_path, settings.STORAGE_ROOT)
    obj = File.objects.create(
        owner=request.user,
        original_name=file.name,
        size=file.size,
        comment=comment,
        storage_path=rel_path,
    )
    logger.info('User %s uploaded file %s', request.user.login, file.name)
    return Response(FileSerializer(obj).data, status=201)


@api_view(['DELETE', 'PATCH'])
@permission_classes([IsAuthenticated])
def file_detail(request, pk):
    try:
        obj = File.objects.get(pk=pk)
    except File.DoesNotExist:
        return Response({'detail': 'Not found'}, status=404)

    if obj.owner != request.user and not request.user.is_admin:
        return Response({'detail': 'Forbidden'}, status=403)

    if request.method == 'DELETE':
        full_path = os.path.join(settings.STORAGE_ROOT, obj.storage_path)
        if os.path.exists(full_path):
            os.remove(full_path)
        obj.delete()
        logger.info('File deleted: %s', obj.original_name)
        return Response(status=204)

    if 'original_name' in request.data:
        obj.original_name = request.data['original_name']
    if 'comment' in request.data:
        obj.comment = request.data['comment']
    obj.save()
    return Response(FileSerializer(obj).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_file(request, pk):
    try:
        obj = File.objects.get(pk=pk)
    except File.DoesNotExist:
        return Response({'detail': 'Not found'}, status=404)

    if obj.owner != request.user and not request.user.is_admin:
        return Response({'detail': 'Forbidden'}, status=403)

    full_path = os.path.join(settings.STORAGE_ROOT, obj.storage_path)
    if not os.path.exists(full_path):
        return Response({'detail': 'File on disk not found'}, status=404)

    obj.last_downloaded_at = datetime.now()
    obj.save(update_fields=['last_downloaded_at'])
    logger.info('File downloaded: %s', obj.original_name)

    return FileResponse(open(full_path, 'rb'), as_attachment=True,
                        filename=obj.original_name)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def share_file(request, pk):
    try:
        obj = File.objects.get(pk=pk)
    except File.DoesNotExist:
        return Response({'detail': 'Not found'}, status=404)

    if obj.owner != request.user and not request.user.is_admin:
        return Response({'detail': 'Forbidden'}, status=403)

    logger.info('Share link requested for %s', obj.original_name)
    return Response({'special_link': str(obj.special_link)})


@api_view(['GET'])
@permission_classes([AllowAny])
def download_by_link(request, token):
    try:
        obj = File.objects.get(special_link=token)
    except File.DoesNotExist:
        return Response({'detail': 'Not found'}, status=404)

    full_path = os.path.join(settings.STORAGE_ROOT, obj.storage_path)
    if not os.path.exists(full_path):
        return Response({'detail': 'File on disk not found'}, status=404)

    obj.last_downloaded_at = datetime.now()
    obj.save(update_fields=['last_downloaded_at'])
    logger.info('Public download of %s', obj.original_name)

    return FileResponse(open(full_path, 'rb'), as_attachment=True,
                        filename=obj.original_name)
