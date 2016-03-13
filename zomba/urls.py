from django.conf.urls import patterns, url
from zomba import views

urlpatterns = patterns('',
  url(r'^$', views.index, name='index'),
	url(r'^about',views.about,name = 'about'),
	url(r'^login/$',views.user_login,name='login'),
	url(r'^restricted/',views.restricted,name='restricted'),
	url(r'^logout/$',views.user_logout, name='logout'),
  url(r'^debug/',views.engine_debug, name='debug'),
  url(r'^engine_update/', views.engine_update, name='engine_update'),
)
