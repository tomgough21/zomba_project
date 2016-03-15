from django.conf.urls import patterns, url
from zomba import views

urlpatterns = patterns('',
  url(r'^$', views.index, name='index'),
	url(r'^about',views.about,name = 'about'),
	url(r'^leaderboard_kills',views.leaderboard_kills,name='leaderboard_kills'),
	url(r'^leaderboard_survived',views.leaderboard_survived,name='leaderboard_survived'),
	url(r'^leaderboard_team',views.leaderboard_team,name='leaderboard_team'),
	url(r'^achievements',views.achievements,name='achievements'),
	url(r'^login/$',views.user_login,name='login'),
	url(r'^restricted/',views.restricted,name='restricted'),
	url(r'^logout/$',views.user_logout, name='logout'),
  url(r'^debug/',views.engine_debug, name='debug'),
  url(r'^engine_update/', views.engine_update, name='engine_update'),
  url(r'^update_player/', views.create_player, name='create_player'),
  url(r'^profile/(?P<username>[\w\-]+)/$', views.profile, name='profile'),
)
