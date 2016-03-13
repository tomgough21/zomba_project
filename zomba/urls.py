from django.conf.urls import patterns, url
from zomba import views

urlpatterns = patterns('',
  url(r'^$', views.index, name='index'),
	url(r'^about',views.about,name = 'about'),
  url(r'^contact',views.contact,name = 'contact'),
	url(r'^login/$',views.user_login,name='login'),
	url(r'^restricted/',views.restricted,name='restricted'),
	url(r'^logout/$',views.user_logout, name='logout'),
 
)
