from django.contrib import admin
from zomba.models import *

class BadgeAdmin(admin.ModelAdmin):
  list_display = ('name', 'description', 'criteria', 'bage_type', 'level', 'icon')
class AchievementAdmin(admin.ModelAdmin):
  list_display = ('player', 'badge', 'date_awarded')
class InGameAdmin(admin.ModelAdmin):
  list_display = ('game_state', 'street_state', 'update_state', 'player_state')
class PlayerAdmin(admin.ModelAdmin):
  list_display = ('user', 'profile_picture', 'games_played', 'most_days_survived', 'most_kills', 'most_people', 'current_game', 'total_days', 'total_kills')

admin.site.register(Badge,BadgeAdmin)
admin.site.register(Achievement,AchievementAdmin)
admin.site.register(InGame,InGameAdmin)
admin.site.register(Player,PlayerAdmin)


# Register your models here.
