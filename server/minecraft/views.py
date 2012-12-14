import copy
import re
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseRedirect
from django.views.generic import ListView, View

from minecraft.models import Mod, Post
from minecraft.util.messages import *

class LoginView(View):
	# TODO: Setup SSL http://stackoverflow.com/questions/2131727/django-and-ssl-question
	def post(self, request, *args, **kwargs):
		path = request.path_info
		
		if '/' in path:
			action = path[path.rfind('/') + 1:]
		else:
			action = '/'
			
		print request.REQUEST
		if 'next' in request.REQUEST:
			next = request.REQUEST['next']
		else:
			next = '/' # TODO: use the full path of the request
		
		if action == 'login':
			username = request.REQUEST['username']
			password = request.REQUEST['password']
			
			user = authenticate(username = username, password = password)
			if not user:
				addErrorMessage(request, 'Invalid username or password.')
			else:
				login(request, user)
		elif action == 'logout':
			logout(request)
			
		return HttpResponseRedirect(next)

class BlogView(ListView):
	context_object_name = 'posts'
	model = Post
	template_name = 'blog.html'
	
	def get_queryset(self):
		if re.match(r'^/post/\d+', self.request.path_info):
			postID = self.request.path_info[self.request.path_info.rfind('/') + 1:]
			return Post.objects.filter(id = postID) # TODO: a detail view might be better?
		else:
			return Post.objects.all()[0:10] # TODO: Look at paginate.
	
	def post(self, request, *args, **kwargs):
		path = request.path_info
		
		if '/' in path:
			action = path[path.rfind('/') + 1:]
		else:
			action = '' 
		
		if action == 'add':
			user = request.user
			if not user.is_authenticated():
				return HttpResponseForbidden()
			
			try:
				title   = request.REQUEST['title']
				content = request.REQUEST['content']
			except KeyError as e:
				return HttpResponse('Missing argument') # TODO
			
			Post.objects.create(title = title, content = content, poster = user)
			
			addSuccessMessage(request, 'Post successfully added.')
		elif action == 'edit':
			user = request.user
			if not user.is_authenticated():
				return HttpResponseForbidden()
			
			try:
				id = request.REQUEST['id']
				title   = request.REQUEST['title']
				content = request.REQUEST['content']
			except KeyError as e:
				return HttpResponse('Missing argument') # TODO
			
			post = Post.objects.get(id = id)
			post.title = title
			post.content = content
			post.poster = user
			
			post.save()
		elif action == 'remove':
			user = request.user
			if not user.is_authenticated():
				return HttpResponseForbidden()
			
			try:
				id = request.REQUEST['id']
			except KeyError as e:
				return HttpResponse('Missing argument') # TODO
			
			Post.objects.get(id = id).delete()
			
			addSuccessMessage(request, 'Post successfully removed.')
		else:
			pass
	
		return HttpResponseRedirect('/')

class ModsView(ListView):
	context_object_name = 'mods'
	model = Mod
	template_name = 'mods.html'
	
	def get_context_data(self, **kwargs):
		context = super(ListView, self).get_context_data(**kwargs)
		context['last_update'] = self.last_updated()
		return context
	
	def last_updated(self):
		return Mod.objects.order_by('-last_updated')[0].last_updated
		
	def post(self, request, *args, **kwargs):
		path = request.path_info
		
		if '/' in path:
			action = request.path_info[request.path_info.rfind('/') + 1:]
		else:
			action = ''
		
		if action == 'add' or action == 'edit':
			try:
				id          = request.REQUEST['id']
				name        = request.REQUEST['name']
				version     = request.REQUEST['version']
				url         = request.REQUEST['url']
				wiki        = request.REQUEST['wiki']
				donate_url  = request.REQUEST['donate-url']
				description = request.REQUEST['description']
			except KeyError as e:
				return HttpResponse('Missing argument') # TODO
		
			if action == 'add':
				if not name or name == '':
					return HttpResponse('No name was given') # TODO: return error code.
				
				mod = Mod(name = name, version = version,
						  url = url, wiki = wiki, donate_url = donate_url, description = description)
				
				mod.save()
				
				return HttpResponse('Success') # TODO
			else:
				if not id or id == '':
					return HttpResponse('No ID was given') # TODO
				
				mod = Mod.objects.get(id = id)
				if not mod:
					return HttpResponse('No mod found') # TODO
				
				mod.id = id
				mod.name = name
				mod.version = version
				mod.url = url
				mod.wiki = wiki
				mod.donate_url = donate_url
				mod.description = description
				
				mod.save()
				
				return HttpResponse('Success') # TODO
		elif action == 'remove':
			if len(request.POST) <= 1:
				return HttpResponse('No IDs were given') # TODO
			
			mods = copy.deepcopy(request.POST)
			del mods['csrfmiddlewaretoken']
			
			Mod.objects.filter(id__in = mods).delete()
			
			return HttpResponse('Success')
		else:
			return HttpResponse('Method not defined') # TODO: return error code
		
		return HttpResponse('TODO') # TODO make redirect
