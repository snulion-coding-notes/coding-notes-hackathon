from django.contrib.admin.options import VERTICAL
from django.urls import path
from appCodingNote import views

app_name = 'appCodingNote'
urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('result/', views.result, name='result'),
    path('readbookmark/', views.Bookmarking.read_bookmark, name='read_bookmark'),
    path('createbookmark/', views.Bookmarking.create_bookmark, name='create_bookmark'),
    path('createtag/', views.Tagging.create_tag, name='create_tag'),
    path('createfolder/', views.FolderCRUD.create_folder, name='create_folder'),
    path('<int:fid>/readfolder/', views.FolderCRUD.read_folder, name='read_folder'),
    path('<int:fid>/updatefolder/', views.FolderCRUD.update_folder, name='update_folder'),
    path('<int:fid>/deletefolder/', views.FolderCRUD.delete_folder, name='delete_folder'),
    path('<int:fid>/createnote/', views.NoteCRUD.create_note, name='create_note'),
    path('<int:fid>/<int:nid>/updatenote/', views.NoteCRUD.update_note, name='update_note'),
    path('<int:fid>/<int:nid>/deletenote/', views.NoteCRUD.delete_note, name='delete_note'),
    path('<int:tid>/readtag/', views.Tagging.read_tag, name='read_tag'),
    path('search/', views.Search.loginSearch, name='login_search')
]
