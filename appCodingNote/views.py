from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from .models import Folder, Note, Bookmark, Tag
from django.views.decorators.csrf import csrf_exempt
import requests
from bs4 import BeautifulSoup
import os
import sys
import urllib.request
import ssl
import json

# TODO : Tag 모델 수정 후 my_tags 있는 부분 수정 필요할 시 수정해야 함 for sidebar (210721)


def index(request):
    cur_user = request.user
    if cur_user.is_authenticated:
        return redirect(f'/dashboard')
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
        my_note = Note.objects.filter(author=request.user)

        my_tags = Tag.objects.none()
        for note in my_note:
            my_tags = my_tags.union(note.tags.all())
        
        return render(request, 'appCodingNote/folder.html', {'folder': folder, 'notes': notes, 'my_folders': my_folders, 'my_tags': my_tags})

    def update_folder(request, fid):
        folder = Folder.objects.filter(id=fid)
        folder.update(folder_name=request.POST['folderName'])
        return redirect(f'/dashboard/{fid}/readfolder/')

    def delete_folder(request, fid):
        folder = Folder.objects.get(id=fid)
        folder.delete()
        return redirect(f'/')


class NoteCRUD:
    def create_note(request, fid):
        if request.method == 'POST':
            note_name = request.POST['noteName']
            note_comment = request.POST['noteComment']
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
                note_link_title = note_link                    # note_link_title 정보를 가져 올 수 없을 경우 처리

            if soup.select_one('meta[property="og:image"]') is not None:
                og_image = soup.select_one('meta[property="og:image"]')
                note_link_image = og_image['content']   # note_link_image 얻기
                try : 
                    is_error = note_link_image.getcode()
                    if is_error == 400 or is_error == 404 :
                        note_link_image = 'https://raw.githubusercontent.com/bewisesh91/SNULION-django-hackaton/main/appCodingNote/static/img/default-image.png'
                except:
                    note_link_image = og_image['content']   # note_link_image 얻기
            else:
                # note_link_image 정보를 가져 올 수 없을 경우 처리, 디폴트 이미지 필요
                note_link_image = 'https://raw.githubusercontent.com/bewisesh91/SNULION-django-hackaton/main/appCodingNote/static/img/default-image.png'
            stackoverflow_search_result = Crawl.stackoverflow_search_result(request, note_name)
            new_note = Note.objects.create(folder_id=fid, note_name=note_name, note_link=note_link, note_link_title=note_link_title, note_link_image=note_link_image, note_comment=note_comment, author=request.user, note_overflow_link=stackoverflow_search_result)
            tagMass = Tagging.create_tag(request)
            tag_name_array = []
            for tag in tagMass:
                new_note.tags.add(tag)
                tag_name_array.append(tag.tag_name)
            
            notesNum = Note.objects.filter(folder_id=fid).count()
            new_note_name = new_note.note_name
            new_note_comment = new_note.note_comment
            new_note_link = new_note.note_link
            new_note_link_title = new_note.note_link_title
            new_note_tags = ' '.join(tag_name_array)
            return JsonResponse({
                'notesNum': notesNum,
                'newNoteName': new_note_name,
                'newNoteComment': new_note_comment,
                'newNoteLink': new_note_link,
                'newNoteLinkTitle': new_note_link_title,
                'newNoteTags': new_note_tags
                })
        else:
            return redirect(f'/{fid}/readfolder/')

    def read_note(request, fid, nid):
        folder = Folder.objects.get(id=fid)
        note = Note.objects.get(id=nid)
        tags = Tag.objects.filter(note__id=nid)
        return render(request, 'appCodingNote/note.html', {'folder': folder, 'note': note, 'tags': tags})

    def update_note(request, fid, nid):
        note = Note.objects.filter(id=nid)
        note_link = request.POST['noteLink']
        note_name= request.POST['noteName']
        if not note_link.startswith('https://'):
                note_link = 'https://' + note_link

        headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
        data = requests.get(note_link, headers=headers)
        soup = BeautifulSoup(data.text, 'html.parser')

        if soup.select_one('meta[property="og:title"]') is not None:
            og_title = soup.select_one('meta[property="og:title"]')
            note_link_title = og_title['content']
        else:
            note_link_title = note_link
            print(note_link_title)

        if soup.select_one('meta[property="og:image"]') is not None:
            og_image = soup.select_one('meta[property="og:image"]')
            note_link_image = og_image['content']
            try : 
                is_error = note_link_image.getcode()
                if is_error == 400 or is_error == 404 :
                    note_link_image = 'https://raw.githubusercontent.com/bewisesh91/SNULION-django-hackaton/main/appCodingNote/static/img/default-image.png'
            except:
                note_link_image = og_image['content']
        else:
            note_link_image = 'https://raw.githubusercontent.com/bewisesh91/SNULION-django-hackaton/main/appCodingNote/static/img/default-image.png'
        stackoverflow_search_result = Crawl.stackoverflow_search_result(request, note_name)
        note.update(note_name=note_name,
                    note_link=note_link, note_link_title=note_link_title, note_comment=request.POST['noteComment'], 
                    note_link_image=note_link_image, note_overflow_link=stackoverflow_search_result)

        # 태그 
        tag_mass = Tagging.create_tag(request)
        tag_name_array = []
        updated_note = Note.objects.get(id=nid)
        updated_note.tags.clear()

        for tag in tag_mass:
                Note.objects.get(id=nid).tags.add(tag)
                tag_name_array.append(tag.tag_name)

        updated_note_title = updated_note.note_name
        updated_note_comment = updated_note.note_comment
        updated_note_link = updated_note.note_link
        updated_note_link_title = updated_note.note_link_title
        updated_note_tags = ' '.join(tag_name_array)

        return JsonResponse({
            'updatedNoteName': updated_note_title,
            'updatedNoteComment': updated_note_comment,
            'updatedNoteLink': updated_note_link,
            'updatedNoteLinkTitle': updated_note_link_title,
            'updatedNoteTags': updated_note_tags
            })


    def delete_note(request, fid, nid):
        note = Note.objects.get(id=nid)
        note.delete()
        notes = Note.objects.filter(folder_id=fid)
        return JsonResponse({'notesNum': notes.count()})


class Bookmarking:
    def create_bookmark(request):
        note_id = request.POST['noteId']

        note = Note.objects.get(id=note_id)

        if note.bookmark_set.filter(user_id=request.user.id).count():
            note.bookmark_set.get(user=request.user).delete()
        else:
            Bookmark.objects.create(user=request.user, note=note)

        is_bookmarking = note.bookmark_set.filter(
            user_id=request.user.id).count()

        return JsonResponse({'isBookmarking': is_bookmarking})

    def read_bookmark(request):
        my_bookmarks = Bookmark.objects.filter(user=request.user)

        my_folders = Folder.objects.filter(author=request.user)
        my_tags = Tag.objects.filter(notes__author=request.user)
        my_note = Note.objects.filter(author=request.user)

        my_tags = Tag.objects.none()
        for note in my_note:
            my_tags = my_tags.union(note.tags.all())

        return render(request, 'appCodingNote/bookmark.html', {'my_folders': my_folders, 'my_tags': my_tags, 'my_bookmarks': my_bookmarks})
        


class Tagging:
    def create_tag(request):
        tag_mass = request.POST['tag']
        list_tag = tag_mass.split(' ')
        trimmed_list = list(filter(None, list_tag))

        returnTag=Tag.objects.none()
        for tag in trimmed_list:
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
            if len(search_keyword):
                if search_type == 'name-and-tag':
                    search_note_list=note_list.filter(note_name__icontains=search_keyword)
                    search_note_list2=note_list.filter(tags__tag_name__icontains=search_keyword)
                    search_note_list.union(search_note_list2)
                    if not search_note_list:
                        search_note_list=search_note_list2
                elif search_type == 'name':
                    search_note_list = note_list.filter(
                        note_name__icontains=search_keyword)
                elif search_type == 'tag':
                    search_note_list=note_list.filter(tags__tag_name__icontains=search_keyword)
                my_search_note_list=search_note_list.filter(author=request.user)
                other_search_note_list=search_note_list.exclude(author=request.user)
                return render(request, 'appCodingNote/login-search.html', {'myNote': my_search_note_list, 'otherNote': other_search_note_list, 'my_folders': my_folders, 'my_tags': my_tags})
            return render(request, 'appCodingNote/login-search.html')
        return redirect('appCodingNote:dashboard')


class chromeExtension:
    @csrf_exempt
    def create_note(request):
        if request.method=="GET":
            folder_mass=Folder.objects.filter(author=request.user)
            folder_name_array=[]
            for folder in folder_mass:
                folder_name_array.append(folder.folder_name)
            return  JsonResponse({'result': folder_name_array})
        else:
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
            
            stackoverflow_search_result = Crawl.stackoverflow_search_result(request, note_name)
            tagMass=Tagging.create_tag(request)
            newNote = Note.objects.create(folder_id=fid, note_name=note_name, note_link=note_link, 
                                        note_link_title=note_link_title, note_link_image=note_link_image, 
                                        note_comment=note_comment, author=request.user, note_overflow_link=stackoverflow_search_result)
            for tag in tagMass:
                newNote.tags.add(tag)
            return render(request, 'appCodingNote/index.html')


    
class Crawl:
    def stackoverflow_search_result(request, new_note_name):
        context = ssl._create_unverified_context()
        client_id = '0ur6n190qb'
        client_secret = 'Dnl4YIhneF6UzIP1W0XzMmVpE1vBjpbgzwNLkj5W'
        encText = urllib.parse.quote(new_note_name)
        data = "source=ko&target=en&text=" + encText
        url = "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation"
        transrequests = urllib.request.Request(url)
        transrequests.add_header("X-NCP-APIGW-API-KEY-ID",client_id)
        transrequests.add_header("X-NCP-APIGW-API-KEY",client_secret)
        response = urllib.request.urlopen(transrequests, data=data.encode("utf-8"), context=context)
        rescode = response.getcode()
        if(rescode==200):
            response_body = response.read()
            str_index = response_body.decode('utf-8').find('translatedText')
            trans_result = response_body.decode('utf-8')[str_index+17:-4]
            stackoverflow_search = f'https://stackoverflow.com/search?q={trans_result}'
            return stackoverflow_search
        else:
            print("Error Code:" + rescode)
