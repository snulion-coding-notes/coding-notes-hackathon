from re import M
from django.core.checks import messages
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import auth
from django import forms


# Create your views here.
def checkusername(request):
    result = not User.objects.filter(username = request.POST['username']).exists()
    return JsonResponse({'result':result})

def signup(request):
    if request.method == 'POST':
        if request.POST['password1'] == request.POST['password2']:
            user = User.objects.create_user(
                username=request.POST['username'], password=request.POST['password1'], email=request.POST['email'])
            auth.login(request, user)
            return redirect('/dashboard')
    return render(request, 'appCodingNote/index.html')


def checksignin(request):
    if request.method == "POST":
        try:
            user = User.objects.get(username=request.POST['username'])
        except:
            user = None
        if user:
            result = user.check_password(request.POST['password'])
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
