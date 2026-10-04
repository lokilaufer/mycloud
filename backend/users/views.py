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
        logger.info('Admin %s deletes user %s', request.user.login, user.login)
        user.delete()
        return Response(status=204)

    if 'is_admin' in request.data:
        user.is_admin = bool(request.data['is_admin'])
        user.save()
    return Response(UserSerializer(user).data)
