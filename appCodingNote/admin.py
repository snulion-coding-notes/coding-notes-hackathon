from django.contrib import admin
from .models import Bookmark, Folder, Note, Tag

# Register your models here.
admin.site.register(Folder)
admin.site.register(Note)
admin.site.register(Tag)
admin.site.register(Bookmark)
