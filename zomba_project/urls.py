from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from registration.backends.simple.views import RegistrationView

class MyRegistrationView(RegistrationView):
	def get_success_url(self,user):
		return '/zomba/profile/'+ user.username

urlpatterns = patterns('',
    url(r'^', include('zomba.urls')), #root redirect
    url(r'^admin/', include(admin.site.urls)),
    url(r'^zomba/', include('zomba.urls')),
    url(r'^accounts/register/$', MyRegistrationView.as_view(), name='registration_register'),
    url(r'^accounts/', include('registration.backends.simple.urls')),
    url(r'^avatar/', include('avatar.urls')),
)

if settings.DEBUG:
    urlpatterns += patterns(
        'django.views.static',(r'^media/(?P<path>.*)','serve',{'document_root':settings.MEDIA_ROOT}), )
