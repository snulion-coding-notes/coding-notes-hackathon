from re import M
from django.core.checks import messages
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import auth
from django import forms


# Create your views here.
def signup(request):
    if request.method == 'POST':
        if request.POST['password1'] == request.POST['password2']:
            if User.objects.filter(username=request.POST['username']).exists():
                message = "이미 사용중인 아이디입니다."
                return render(request, 'appCodingNote/index.html', {'message': message})
            user = User.objects.create_user(
                username=request.POST['username'], password=request.POST['password1'], email=request.POST['email'])
            auth.login(request, user)
            return redirect('/codingnote/dashboard')
    return render(request, 'codingnote/')


def signin(request):
    if request.method == "POST":
        try:
            user = User.objects.get(username=request.POST['username'])

        except:
            user = None

        if user:
            if user.check_password(request.POST['password']):
                auth.login(request, user)
                return redirect('/codingnote/dashboard')
            else:
                message = "패스워드가 올바르지 않습니다."
                return render(request, 'appCodingNote/index.html', {'message': message})
                # return JsonResponse({'message': message})
        else:
            message = "아이디가 올바르지 않습니다."
            return render(request, 'appCodingNote/index.html', {'message': message})
            # return JsonResponse({'message': message})
    else:
        return render(request, 'appCodingNote/index.html')


def signout(request):
    if request.method == "GET":
        auth.logout(request)
        return redirect('/')
