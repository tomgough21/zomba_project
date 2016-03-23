from django.conf.urls import patterns, url
from zomba import views

urlpatterns = patterns('',
  url(r'^$', views.index, name='index'),
	url(r'^about',views.about,name = 'about'),
	url(r'^leaderboard',views.leaderboard,name='leaderboard'),
	url(r'^gallery',views.gallery,name='gallery'),
	url(r'^achievements',views.achievements,name='achievements'),
  url(r'^editor/',views.engine_editor, name='editor'),
  url(r'^game/',views.game, name='game'),
  url(r'^engine_update/', views.engine_update, name='engine_update'),
  url(r'^profile/(?P<username>[\w\-]+)/$', views.profile, name='profile'),
)
