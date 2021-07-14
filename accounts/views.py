from django.shortcuts import render, redirect
from django.contrib.auth.models import User  
from django.contrib import auth  


# Create your views here.
def signup(request):
    if request.method == 'POST':
        if request.POST['password1'] == request.POST['password2']:
            user = User.objects.create_user(username=request.POST['username'], password=request.POST['password1'], email=request.POST['email'])
            auth.login(request, user)
            return redirect('codingnote/dashboard/')
    return render(request, 'codingnote/')


def signin(request):
    if request.method == "POST":
        user = User.objects.get(username=request.POST['username'])
        if user :
            if user.check_password(request.POST['password']) :
                auth.login(request, user)
                return render(request, 'appCodingNote/dashboard.html')
            else :
                message = "패스워드가 올바르지 않습니다."
                return render(request, {'message': message})
        else :
            message = "아이디가 올바르지 않습니다."
            return render(request, {'message': message})
    else :
        return render(request, 'appCodingNote/index.html')

def signout(request):
    if request.method == "POST":
        auth.logout(request)
        return render(request, 'appCodingNote/index.html')
