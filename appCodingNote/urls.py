from django.contrib.admin.options import VERTICAL
from django.urls import path
from appCodingNote import views

app_name = 'appCodingNote'
urlpatterns = [
    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard/createfolder/', views.create_folder, name='create_folder'),
    path('dashboard/<int:id>/readfolder/', views.read_folder, name='read_folder'),
    path('dashboard/<int:id>/deletefolder/', views.delete_folder, name='delete_folder'),
]
