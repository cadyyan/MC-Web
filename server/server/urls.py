from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

from minecraft.views import *

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'server.views.home', name='home'),
    # url(r'^server/', include('server.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
	
	url(r'^[/]*$', BlogView.as_view()),
    url(r'^login[/]*$', LoginView.as_view()),
    url(r'^logout[/]*$', LoginView.as_view()),
	url(r'^post/\d+[/]*$', BlogView.as_view()),
    url(r'^post/add[/]*$', BlogView.as_view()),
    url(r'^post/edit[/]*$', BlogView.as_view()),
    url(r'^post/remove[/]*$', BlogView.as_view()),
	url(r'^mods[/]*$', ModsView.as_view()),
	url(r'^mods/add[/]*$', ModsView.as_view()),
	url(r'^mods/edit[/]*$', ModsView.as_view()),
	url(r'^mods/remove[/]*$', ModsView.as_view())
)
