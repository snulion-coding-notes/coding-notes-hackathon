from django.contrib.admin.options import VERTICAL
from django.urls import path
from appCodingNote import views

app_name = 'appCodingNote'
urlpatterns = [
    path('', views.index, name='index'),
    path('result/', views.result, name='result'), # 인덱스 - 검색 결과 템플릿 위해 추가
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
    path('dashboard/<int:fid>/<int:nid>/readbookmark/', views.Bookmarking.read_bookmark, name='read_bookmark'),
    path('dashboard/<int:fid>/<int:nid>/createtag/', views.Tagging.create_tag, name='create_tag'),
    path('dashboard/<int:tid>/readtag/', views.Tagging.read_tag, name='read_tag'),
    path('dashboard/<int:fid>/<int:nid>/<int:tid>/updatetag/', views.Tagging.update_tag, name='update_tag'),
    path('dashboard/<int:fid>/<int:nid>/<int:tid>/deletetag/', views.Tagging.delete_tag, name='delete_tag'),
    path('dashboard/search/', views.Search.loginSearch, name='login_search'),
]
