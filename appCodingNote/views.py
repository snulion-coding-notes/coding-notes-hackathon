import json
from django.http.response import JsonResponse
from django.shortcuts import render, redirect
from .models import Folder, Note, Bookmark, Tag
from django.views.decorators.csrf import csrf_exempt
import requests
from bs4 import BeautifulSoup


def index(request):
    return render(request, 'appCodingNote/index.html')


def result(request):
    return render(request, 'appCodingNote/index-search.html')
    # 인덱스 - 검색 결과 템플릿 위해 추가


def dashboard(request):
    all_notes = Note.objects.all()
    all_tags = Tag.objects.all()
    my_folders = Folder.objects.filter(author=request.user)
    my_tags = Tag.objects.filter(user=request.user)
    return render(request, 'appCodingNote/dashboard.html', {'all_notes': all_notes, 'all_tags': all_tags, 'my_folders': my_folders, 'my_tags': my_tags})


class FolderCRUD:
    def create_folder(request):
        if request.method == 'POST':
            folder_name = request.POST['folderName']
            Folder.objects.create(folder_name=folder_name, author=request.user)
        return redirect('appCodingNote:dashboard')

    def read_folder(request, fid):
        folder = Folder.objects.get(id=fid)
        notes = Note.objects.filter(folder__id=fid)
        return render(request, 'appCodingNote/folder.html', {'folder': folder, 'notes': notes})

    def update_folder(request, fid):
        folder = Folder.objects.get(id=fid)
        folder.update(folder_name=request.POST['folderName'])
        return redirect(f'/dashboard/{fid}/readfolder/')

    def delete_folder(request, fid):
        folder = Folder.objects.get(id=fid)
        folder.delete()
        return redirect(f'/dashboard/')


class NoteCRUD:
    def create_note(request, fid):
        if request.method == 'POST':
            note_name = request.POST['noteName']
            note_link = request.POST['noteLink']

            # note_link로 부터 데이터 쌓기
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
            data = requests.get(note_link, headers=headers)
            soup = BeautifulSoup(data.text, 'html.parser')

            if soup.select_one('meta[property="og:title"]') is not None:
                og_title = soup.select_one('meta[property="og:title"]')
                note_link_title = og_title['content']   # note_link_title 얻기
            else:
                note_link_title = ""                    # note_link_title 정보를 가져 올 수 없을 경우 처리

            if soup.select_one('meta[property="og:image"]') is not None:
                og_image = soup.select_one('meta[property="og:image"]')
                note_link_image = og_image['content']   # note_link_image 얻기
            else:
                # note_link_image 정보를 가져 올 수 없을 경우 처리, 디폴트 이미지 필요
                note_link_image = None

            note_comment = request.POST['noteComment']

            Note.objects.create(folder_id=fid, note_name=note_name, note_link=note_link, note_link_title=note_link_title,
                                note_link_image=note_link_image, note_comment=note_comment, author=request.user)
            nid = Note.objects.get(note_name=note_name).id
            Tag.objects.create(
                tag_name=request.POST['tag'], user=request.user, note_id=nid)
            # Note.objects.create(folder_id=fid, note_name=note_name, note_link_title=note_link_title, note_comment=note_comment)
            notes = Note.objects.filter(folder__id=fid)
            notesNum = notes.count()
            return JsonResponse({'notesNum': notesNum, 'note_link_title': note_link_title})
        else:
            return redirect(f'/dashboard/{fid}/readfolder/')

    def read_note(request, fid, nid):
        folder = Folder.objects.get(id=fid)
        note = Note.objects.get(id=nid)
        return render(request, 'appCodingNote/note.html', {'folder': folder, 'note': note})

    def update_note(request, fid, nid):
        note = Note.objects.filter(id=nid) #update 메서드는 querySet에 적용되므로 get대신 filter
        # note.update(note_name=request.POST['noteName'], note_link=request.POST['noteLink'], note_link_title=request.POST['noteLinkTitle'], note_comment=request.POST['noteComment'])
        note.update(note_name=request.POST['noteName'],
                    note_link_title=request.POST['noteLinkTitle'], note_comment=request.POST['noteComment'])
        return redirect(f'/dashboard/{fid}/readfolder/')

    def delete_note(request, fid, nid):
        note = Note.objects.get(id=nid)
        note.delete()
        notes = Note.objects.filter(folder__id=fid)
        return JsonResponse({'notesNum': notes.count()})


class Bookmarking:
    def create_bookmark(request, fid, nid):
        note = Note.objects.get(id=nid)
        is_bookmarking = note.bookmark_set.filter(user_id=request.user.id)
        if is_bookmarking:
            note.bookmark_set.get(user=request.user).delete()
        else:
            Bookmark.objects.create(user=request.user, note=note)
        return redirect(f'/dashboard/{fid}/{nid}/readnote/')


class Tagging:
    def create_tag(request, fid, nid):
        note = Note.objects.get(id=nid)
        Tag.objects.create(user=request.user, note=note,tag_name=request.POST['tagName'])
        return redirect(f'/dashboard/{fid}/{nid}/readnote/')

    def read_tag(request, tid):
        tag = Tag.objects.get(id=tid)
        tag_name = tag.tag_name
        tagged_notes = Note.objects.filter(
            tag__tag_name=tag_name, author=request.user)
        return render(request, 'appCodingNote/tag.html', {'tagged_notes': tagged_notes, 'tag_name': tag_name})

    def update_tag(request, fid, nid, tid):
        tag = Tag.objects.get(id=tid)
        tag.update(tag_name=request.POST['tagName'])
        return redirect(f'/dashboard/{fid}/{nid}/readnote/')

    def delete_tag(request, fid, nid, tid):
        tag = Tag.objects.get(id=tid)
        tag.delete()
        return redirect(f'/dashboard/{fid}/{nid}/readnote/')


class Search:
    def loginSearch(request):
        return render()


class chromeExtension:
    @csrf_exempt
    def create_note(request):
        note_name = request.POST['noteName']
        note_link_title = request.POST['noteTitle']
        note_link = request.POST['noteLink']
        note_comment = request.POST['noteComment']
        folder_name = request.POST['file']
        try:
            fid = Folder.objects.get(folder_name=folder_name).id
        except:
            Folder.objects.create(folder_name=folder_name, author=request.user)
            fid = Folder.objects.get(folder_name=folder_name).id
        Note.objects.create(folder_id=fid, note_name=note_name, note_link=note_link,
                            note_link_title=note_link_title, note_comment=note_comment, author=request.user)
        nid = Note.objects.get(note_name=note_name).id
        Tag.objects.create(
            tag_name=request.POST['noteTag'], user=request.user, note_id=nid)
        return render(request, 'appCodingNote/index.html')
