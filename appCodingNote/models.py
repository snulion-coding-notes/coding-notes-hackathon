from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


# Create your models here.

class Folder(models.Model):
    author = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    folder_name = models.CharField(max_length=256)
    folder_created_at = models.DateTimeField(default=timezone.now)
    folder_updated_at = models.DateTimeField(blank=True, null=True) 

    def folder_update_date(self): 
        self.folder_updated_at = timezone.now()
        self.save()

    def __str__(self):
        return self.folder_name
    
class Tag(models.Model):
    tag_name = models.CharField(max_length=100)

    def __str__(self):
        return self.tag_name


class Note(models.Model):
    author = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    bookmark_users = models.ManyToManyField(User, blank=True, related_name='bookmark_notes', through='Bookmark')
    tags = models.ManyToManyField(Tag, blank=True, related_name='notes')
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='notes')
    note_name = models.TextField(blank=True, null=True) 
    note_link = models.URLField()
    note_link_title = models.TextField(blank=True, null=True) 
    note_link_image = models.URLField(blank=True, null=True) 
    note_comment = models.TextField(blank=True, null=True) 
    note_created_at = models.DateTimeField(default=timezone.now)
    note_updated_at = models.DateTimeField(blank=True, null=True) 

    def note_update_date(self): 
        self.note_updated_at = timezone.now()
        self.save()

    def __str__(self):
        return self.note_name


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    note = models.ForeignKey(Note, on_delete=models.CASCADE)


