from json.encoder import JSONEncoder
from re import M
from django.core.checks import messages
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import auth
from django import forms
from django.urls import reverse


# Create your views here.
def checkusername(request):
    result = not User.objects.filter(username = request.POST['username']).exists()
    return JsonResponse({'result':result})

def signup(request):
    if request.method == 'POST':
        if request.POST['signup-password1'] == request.POST['signup-password2']:
            user = User.objects.create_user(
                username=request.POST['signup-username'], password=request.POST['signup-password1'], email=request.POST['signup-email'])
            auth.login(request, user)
            return redirect('/dashboard')
    return render(request, 'appCodingNote/index.html')


def checksignin(request):
    if request.method == "POST":
        try:
            user = User.objects.get(username=request.POST['signin-username'])
        except:
            user = None
        if user:
            result = user.check_password(request.POST['signin-password'])
            return JsonResponse({'result':result})
        else:
            return JsonResponse({'result':False})

def signin(request):
    if request.method == "POST":
        user = User.objects.get(username=request.POST['signin-username'])
        auth.login(request, user)
        return redirect('/dashboard')
    else:
        return render(request, 'appCodingNote/index.html')

def signout(request):
    if request.method == "GET":
        auth.logout(request)
        return redirect('/')

def findpw(request):
    result = User.objects.filter(email = request.POST['findpw-email'], username = request.POST['findpw-username']).exists()
    return JsonResponse({'result':result})

# def pw(request):
#     if request.method == "POST":
#         try: 
#             User.objects.get(email=request.POST['check-email'], username=request.POST['check-username'])
#             return JsonResponse({'result':True})
#         except:
#             return JsonResponse({'result':False})

def resetpw(request): 
    user = User.objects.get(email=request.POST['findpw-email'], username=request.POST['findpw-username'])
    user.set_password(request.POST['resetpw-password'])
    user.save()
    return JsonResponse({'result':True})