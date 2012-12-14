from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
	title = models.CharField(max_length = 256)
	content = models.TextField()
	poster = models.ForeignKey(User)
	posted_on = models.DateTimeField(auto_now = True)
	
	class Meta:
		get_latest_by = 'posted_on'
		ordering = ['-posted_on']

class Mod(models.Model):
	name = models.CharField(max_length = 128)
	version = models.CharField(max_length = 64, blank = True)
	url = models.URLField(blank = True)
	wiki = models.URLField(blank = True)
	donate_url = models.URLField(blank = True)
	description = models.CharField(max_length = 1024, blank = True)
	last_updated = models.DateTimeField(auto_now = True)
	
	class Meta:
		ordering = ['name']
	
	def __unicode__(self):
		return self.name
	
