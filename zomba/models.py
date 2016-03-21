from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User
from zomba_engine.game import *

#todo: need to add badges to Population script
class Badge(models.Model):
    name = models.CharField(max_length=128,unique=True)
    description = models.TextField()
    criteria = models.IntegerField(default = 0)
    bage_type = models.CharField(max_length=128,unique=True)
    level = models.CharField(max_length=128,unique=True)
    icon = models.ImageField(upload_to='profile_images', blank=True)
    def __unicode__(self):
        return self.name

class InGame(models.Model):
    game_state = models.TextField()
    street_state = models.TextField()
    update_state = models.TextField()
    player_state = models.TextField()
    def __unicode__(self):
        return self.game_state

class Player(models.Model):
    user = models.OneToOneField(User)
    profile_picture = models.ImageField(upload_to='profile_images', blank=True)
    #global statistics
    games_played = models.IntegerField(default = 0)
    most_days_survived = models.IntegerField(default = 0)
    most_kills = models.IntegerField(default = 0)
    most_people = models.IntegerField(default = 0)
    total_days = models.FloatField(default = 0)
    total_kills = models.IntegerField(default = 0)
    #game object
    current_game = models.OneToOneField(InGame, null=True, blank=True)
    def __unicode__(self):
        return self.user.username


class Achievement(models.Model):
    player = models.ForeignKey(Player)
    badge = models.ForeignKey(Badge)
    date_awarded = models.DateTimeField(auto_now_add=True, blank=True)
    def __unicode__(self):
        return self.player.user.username + " Achieved " + self.badge.name
