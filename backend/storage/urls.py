from django.urls import path

from . import views

urlpatterns = [
    path('files/', views.files_list, name='files_list'),
    path('files/upload/', views.upload_file, name='upload_file'),
    path('files/<int:pk>/', views.file_detail, name='file_detail'),
    path('files/<int:pk>/download/', views.download_file, name='download_file'),
    path('files/<int:pk>/share/', views.share_file, name='share_file'),
    path('s/<uuid:token>/', views.download_by_link, name='download_by_link'),
]
