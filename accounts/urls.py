from django.urls import path
from accounts import views

urlpatterns = [    
    path('signup/', views.signup, name='signup'),
    path('checkusername/', views.checkusername, name='checkusername'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
]