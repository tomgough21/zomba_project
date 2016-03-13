from django.contrib import admin
from zomba.models import *

class MedalAdmin(admin.ModelAdmin):
  list_display = ('logo', 'name', 'threshold', 'next_rank')
class AchievementAdmin(admin.ModelAdmin):
  list_display = ('name', 'progress', 'rank', 'player')
class GameAdmin(admin.ModelAdmin):
  list_display = ('game_state', 'street_state', 'update_state', 'player_state')
class PlayerAdmin(admin.ModelAdmin):
  list_display = ('user', 'in_game', 'picture')

admin.site.register(Medal,MedalAdmin)
admin.site.register(Achievement,AchievementAdmin)
admin.site.register(Game,GameAdmin)
admin.site.register(Player,PlayerAdmin)


# Register your models here.
