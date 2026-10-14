import logging

from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from .models import User
from .serializers import RegisterSerializer, UserSerializer

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        logger.info('Registered user: %s', serializer.validated_data.get('login'))
        return Response({'detail': 'OK'}, status=201)
    logger.warning('Registration failed: %s', serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    login_ = request.data.get('login')
    password = request.data.get('password')
    user = authenticate(request, login=login_, password=password)
    if user is None:
        logger.warning('Login failed for: %s', login_)
        return Response({'detail': 'Неверный логин или пароль'}, status=400)
    login(request, user)
    logger.info('User logged in: %s', login_)
    return Response(UserSerializer(user).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logger.info('User logged out: %s', request.user.login)
    logout(request)
    return Response({'detail': 'OK'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response(UserSerializer(request.user).data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def users_list(request):
    users = User.objects.all().order_by('id')
    return Response(UserSerializer(users, many=True).data)


@api_view(['DELETE', 'PATCH'])
@permission_classes([IsAdminUser])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'detail': 'Not found'}, status=404)

    if request.method == 'DELETE':
        # Запрет админу удалить самого себя
        if user.pk == request.user.pk:
            logger.warning('Admin %s tried to delete self', request.user.login)
            return Response(
                {'detail': 'Нельзя удалить самого себя'},
                status=400,
            )
        logger.info('Admin %s deletes user %s', request.user.login, user.login)
        user.delete()
        return Response(status=204)

    # PATCH
    if 'is_admin' in request.data:
        new_value = bool(request.data['is_admin'])
        # Запрет админу снять с себя права администратора
        if user.pk == request.user.pk and new_value is False:
            logger.warning('Admin %s tried to revoke own admin', request.user.login)
            return Response(
                {'detail': 'Нельзя снять права администратора с самого себя'},
                status=400,
            )
        user.is_admin = new_value
        # Синхронизируем is_staff (нужно для IsAdminUser)
        user.is_staff = new_value
        user.save()
        logger.info('Admin %s set is_admin=%s for %s',
                    request.user.login, new_value, user.login)

    return Response(UserSerializer(user).data)
