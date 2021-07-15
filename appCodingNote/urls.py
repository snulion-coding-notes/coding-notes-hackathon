from django.contrib.admin.options import VERTICAL
from django.urls import path
from appCodingNote import views

app_name = 'appCodingNote'
urlpatterns = [
    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard/createfolder/', views.FolderCRUD.create_folder, name='create_folder'),
    path('dashboard/<int:fid>/readfolder/', views.FolderCRUD.read_folder, name='read_folder'),
    path('dashboard/<int:fid>/updatefolder/', views.FolderCRUD.update_folder, name='update_folder'),
    path('dashboard/<int:fid>/deletefolder/', views.FolderCRUD.delete_folder, name='delete_folder'),
    path('dashboard/<int:fid>/createnote/', views.NoteCRUD.create_note, name='create_note'),
    path('dashboard/<int:fid>/<int:nid>/readnote/', views.NoteCRUD.read_note, name='read_note'),
    path('dashboard/<int:fid>/<int:nid>/updatenote/', views.NoteCRUD.update_note, name='update_note'),
    path('dashboard/<int:fid>/<int:nid>/deletenote/', views.NoteCRUD.delete_note, name='delete_note'),
    path('dashboard/<int:fid>/<int:nid>/', views.Bookmarking.create_bookmark, name='create_bookmark'),
    path('dashboard/<int:fid>/<int:nid>/createtag/', views.Taging.create_tag, name='create_tag'),
    path('dashboard/<int:fid>/<int:nid>/<int:tid>/updatetag/', views.Taging.update_tag, name='update_tag'),
    path('dashboard/<int:fid>/<int:nid>/<int:tid>/deletetag/', views.Taging.delete_tag, name='delete_tag'),
]
