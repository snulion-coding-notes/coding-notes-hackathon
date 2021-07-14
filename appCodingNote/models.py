from django.db import models
from django.utils import timezone

# Create your models here.


### Folder Class 생성 ###
class Folder(models.Model):
    folder_name = models.CharField(max_length=256)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(blank=True, null=True) 

    def update_date(self): 
        self.updated_at = timezone.now()
        self.save()

    def __str__(self):
        return self.folder_name

