from django.urls import path

from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('me/', views.current_user, name='current_user'),
    path('users/', views.users_list, name='users_list'),
    path('users/<int:pk>/', views.user_detail, name='user_detail'),
]
