from django.shortcuts import render, redirect
from .models import Folder

# Create your views here.
def index(request):
    return render(request, 'appCodingNote/index.html')

def dashboard(request):
    folders = Folder.objects.all()
    ### tags ### 
    return render(request, 'appCodingNote/dashboard.html', {'folders': folders})
    

def create_folder(request):
    folder_name = request.POST['folderName']
    Folder.objects.create(folder_name=folder_name)
    return redirect('appCodingNote:dashboard')


def read_folder(request, id):
    folder = Folder.objects.get(id=id)
    return render(request, 'appCodingNote/folder.html', {'folder': folder})


def update_folder(request, id):
    folder = Folder.objects.get(id=id)
    return render(request, 'appCodingNote/dashboard.html', {'folder': folder})


def delete_folder(request, id):
    folder = Folder.objects.get(id=id)
    folder.delete()
    return redirect('appCodingNote:dashboard')
