from django.shortcuts import render, redirect
from .models import Folder, Note, Bookmark

# Create your views here.
def index(request):
    return render(request, 'appCodingNote/index.html')

def dashboard(request):
    folders = Folder.objects.all()
    ### tags ### 
    return render(request, 'appCodingNote/dashboard.html', {'folders': folders})
    

class FolderCRUD:
    def create_folder(request):
        folder_name = request.POST['folderName']
        Folder.objects.create(folder_name=folder_name)
        return redirect('appCodingNote:dashboard')

    def read_folder(request, fid):
        folder = Folder.objects.get(id=fid)
        return render(request, 'appCodingNote/folder.html', {'folder': folder})

    def update_folder(request, fid):
        folder = Folder.objects.get(id=fid)
        folder.update(folder_name = request.POST['folderName'])
        return redirect('appCodingNote:dashboard')

    def delete_folder(request, fid):
        folder = Folder.objects.get(id=fid)
        folder.delete()
        return redirect('appCodingNote:dashboard')


class NoteCRUD:
    def create_note(request, fid):
        note_name = request.POST['noteName']
        note_link = request.POST['noteLink']
        note_link_title = request.POST['noteLinkTitle']
        note_comment = request.POST['noteComment']
        Note.objects.create(folder_id=fid, note_name=note_name, note_link=note_link, note_link_title=note_link_title, note_comment=note_comment, author=request.user)
        return redirect(f'/dashboard/{fid}/readfolder/')
    
    def read_note(request, nid):
        note = Note.objects.get(id=nid)
        return render(request, 'appCodingNote/note.html', {'note': note})

    def update_note(request, fid, nid):
        note = Note.objects.get(id=nid)
        note.update(note_name=request.POST['noteName'], note_link=request.POST['noteLink'], note_link_title=request.POST['noteLinkTitle'], note_comment=request.POST['noteComment'])
        return redirect(f'/dashboard/{fid}/readfolder/')

    def delete_note(request, fid, nid):
        note = Note.objects.get(id=nid)
        note.delete()
        return redirect(f'/dashboard/{fid}/readfolder/')


class Bookmarking:
    def create_bookmark(request, fid, nid):
        note = Note.objects.get(id=nid)
        is_bookmarking = note.bookmark_set.filter(user_id=request.user.id)
        if is_bookmarking:
            note.bookmark_set.get(user=request.user).delete()
        else:
            Bookmark.objects.create(user=request.user, note=note)
        return redirect(f'/dashboard/{fid}/readfolder/')

def delete_folder(request, id):
    folder = Folder.objects.get(id=id)
    folder.delete()
    return redirect('appCodingNote:dashboard')