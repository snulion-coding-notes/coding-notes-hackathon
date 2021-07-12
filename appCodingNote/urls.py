from django.urls import path
from appCodingNote import views

urlpatterns = [
    path('', views.index, name='index'),
]
