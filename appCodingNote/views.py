from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from .models import Folder, Note, Bookmark, Tag
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import requests
from bs4 import BeautifulSoup


# TODO : Tag 모델 수정 후 my_tags 있는 부분 수정 필요할 시 수정해야 함 for sidebar (210721)


def index(request):
    cur_user = request.user
    if cur_user.is_authenticated:
        return render(request, 'appCodingNote/dashboard.html')
    else:
        return render(request, 'appCodingNote/index.html')


@csrf_exempt
def result(request):
    notes = Note.objects.all()
    search_keyword = request.POST.get('keyword', '')
    if(search_keyword):
        search_note_list=notes.filter(Q (note_name=search_keyword) | Q (tags__tag_name=search_keyword))
        return render(request, 'appCodingNote/index-search.html', {'notes':search_note_list})

    return render(request, 'appCodingNote/index.html')
    # 인덱스 - 검색 결과 템플릿 위해 추가


def dashboard(request):
    cur_user = request.user
    if cur_user.is_authenticated:
        all_notes = Note.objects.all()
        all_tags = Tag.objects.all()
        my_folders = Folder.objects.filter(author=request.user)
        my_note=Note.objects.filter(author=request.user)
        my_tags=Tag.objects.none()
        for note in my_note:
            my_tags=my_tags.union(note.tags.all())
        
        return render(request, 'appCodingNote/dashboard.html', {'all_notes': all_notes, 'all_tags': all_tags, 'my_folders': my_folders, 'my_tags': my_tags})
    else :
        return render(request, 'appCodingNote/index.html')

class FolderCRUD:
    def create_folder(request):
        if request.method == 'POST':
            folder_name = request.POST['folderName']

            try:
                Folder.objects.get(folder_name=folder_name, author=request.user)
                return JsonResponse({'message': '중복된 폴더명입니다'})

            except:
                Folder.objects.create(
                    folder_name=folder_name, author=request.user)
                return HttpResponse()

    def read_folder(request, fid):
        folder = Folder.objects.get(id=fid)
        notes = Note.objects.filter(folder__id=fid)
        my_folders = Folder.objects.filter(author=request.user)
        my_tags = Tag.objects.filter(notes__author=request.user)
        
        return render(request, 'appCodingNote/folder.html', {'folder': folder, 'notes': notes, 'my_folders': my_folders, 'my_tags': my_tags})

    def update_folder(request, fid):
        folder = Folder.objects.filter(id=fid)
        folder.update(folder_name=request.POST['folderName'])
        return redirect(f'/codingnote/dashboard/{fid}/readfolder/')

    def delete_folder(request, fid):
        folder = Folder.objects.get(id=fid)
        folder.delete()
        return redirect(f'/dashboard/')


class NoteCRUD:
    def create_note(request, fid):
        if request.method == 'POST':
            note_name = request.POST['noteName']
            note_link = request.POST['noteLink']
            if not note_link.startswith('https://'):
                note_link = 'https://' + note_link

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
                note_link_image = 'https://raw.githubusercontent.com/bewisesh91/SNULION-django-hackaton/main/appCodingNote/static/img/default-image.png'

            note_comment = request.POST['noteComment']
            tagMass=Tagging.create_tag(request)
            newNote = Note.objects.create(folder_id=fid, note_name=note_name, note_link=note_link, note_link_title=note_link_title, note_link_image=note_link_image, note_comment=note_comment, author=request.user)
            for tag in tagMass:
                newNote.tags.add(tag)
            
            notes = Note.objects.filter(folder_id=fid)
            notesNum = notes.count()
            return JsonResponse({'notesNum': notesNum, 'note_link_title': note_link_title, 'note_link': note_link})
        else:
            return redirect(f'/dashboard/{fid}/readfolder/')

    def read_note(request, fid, nid):
        folder = Folder.objects.get(id=fid)
        note = Note.objects.get(id=nid)
        tags = Tag.objects.filter(note__id=nid)
        return render(request, 'appCodingNote/note.html', {'folder': folder, 'note': note, 'tags': tags})

    def update_note(request, fid, nid):
        note = Note.objects.filter(id=nid)
        note.update(note_name=request.POST['noteName'],
                    note_link_title=request.POST['noteLink'], note_comment=request.POST['noteComment'])

        tag_mass = Tagging.create_tag(request)
        tag_name_array = []
        for tag in tag_mass:
                Note.objects.get(id=nid).tags.add(tag)
                tag_name_array.append(tag.tag_name)

        updated_note = Note.objects.get(id=nid)
        updated_note_title = updated_note.note_name
        updated_note_comment = updated_note.note_comment
        updated_note_link_title = updated_note.note_link_title
        updated_note_tags = ' '.join(tag_name_array)
        return JsonResponse({'updatedNoteName': updated_note_title, 'updatedNoteComment': updated_note_comment, 'updatedNoteLinkTitle': updated_note_link_title, 'updatedNoteTags': updated_note_tags})


    def delete_note(request, fid, nid):
        note = Note.objects.get(id=nid)
        note.delete()
        notes = Note.objects.filter(folder_id=fid)
        return JsonResponse({'notesNum': notes.count()})


class Bookmarking:
    def create_bookmark(request, fid, nid):
        note = Note.objects.get(id=nid)

        if note.bookmark_set.filter(user_id=request.user.id).count():
            note.bookmark_set.get(user=request.user).delete()
        else:
            Bookmark.objects.create(user=request.user, note=note)

        is_bookmarking = note.bookmark_set.filter(
            user_id=request.user.id).count()

        return JsonResponse({'isBookmarking': is_bookmarking})


class Tagging:
    def create_tag(request):
        tagMass=request.POST['tag']
        list_tag=tagMass.split(' ')
        returnTag=Tag.objects.none()
        for tag in list_tag:
            if Tag.objects.filter(tag_name=tag).exists():
                returnTag=returnTag.union(Tag.objects.filter(tag_name=tag))
            else:
                Tag.objects.create(tag_name=tag)
                returnTag=returnTag.union(Tag.objects.filter(tag_name=tag))
        return returnTag


    def read_tag(request, tid):
        tag = Tag.objects.get(id=tid)
        tag_name = tag.tag_name
        tagged_notes = Note.objects.filter(
            tags__tag_name=tag_name, author=request.user)
        my_folders = Folder.objects.filter(author=request.user)
        my_note=Note.objects.filter(author=request.user)
        my_tags=Tag.objects.none()
        for note in my_note:
            my_tags=my_tags.union(note.tags.all())
        return render(request, 'appCodingNote/tag.html', {'tagged_notes': tagged_notes, 'tag_name': tag_name, 'my_folders': my_folders, 'my_tags': my_tags})

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
        search_keyword = request.POST.get('keyword', '')
        search_type = request.POST.get('search-option', '')
        note_list = Note.objects.order_by('-id')
        my_folders = Folder.objects.filter(author=request.user)
        my_note=Note.objects.filter(author=request.user)
        my_tags=Tag.objects.none()
        for note in my_note:
            my_tags=my_tags.union(note.tags.all())  
        if search_keyword :
            if len(search_keyword) > 1 :
                if search_type == 'name-and-tag':
                    search_note_list=note_list.filter(Q (note_name=search_keyword) | Q (tags__tag_name=search_keyword))
                elif search_type == 'name':
                    search_note_list = note_list.filter(
                        note_name=search_keyword)
                elif search_type == 'tag':
                    search_note_list=note_list.filter(tags__tag_name=search_keyword)
                my_search_note_list=search_note_list.filter(author=request.user)
                other_search_note_list=search_note_list.exclude(author=request.user)
                return render(request, 'appCodingNote/login-search.html', {'myNote': my_search_note_list, 'otherNote': other_search_note_list, 'my_folders': my_folders, 'my_tags': my_tags})
            return render(request, 'appCodingNote/login-search.html')
        return redirect('appCodingNote:dashboard')


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

        headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
        data = requests.get(note_link, headers=headers)
        soup = BeautifulSoup(data.text, 'html.parser')
        
        if soup.select_one('meta[property="og:image"]') is not None:
            og_image = soup.select_one('meta[property="og:image"]')
            note_link_image = og_image['content']   # note_link_image 얻기
        else:
            # note_link_image 정보를 가져 올 수 없을 경우 처리, 디폴트 이미지 필요
            note_link_image = 'https://raw.githubusercontent.com/bewisesh91/SNULION-django-hackaton/main/appCodingNote/static/img/default-image.png'
        
        tagMass=Tagging.create_tag(request)
        newNote = Note.objects.create(folder_id=fid, note_name=note_name, note_link=note_link, note_link_title=note_link_title, note_link_image=note_link_image, note_comment=note_comment, author=request.user)
        for tag in tagMass:
            newNote.tags.add(tag)
        return render(request, 'appCodingNote/index.html')
