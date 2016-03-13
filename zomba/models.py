from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User
from zomba_engine.game import *

class Medal(models.Model):
    logo = models.ImageField(upload_to='profile_images', blank=True)
    name = models.CharField(max_length=128,unique=True)
    threshold = models.IntegerField(default = 0)
    next_rank = models.ForeignKey('self', blank=True, null=True);

    def __unicode__(self):
        return self.name

class Game(models.Model):
    game_state = models.TextField()
    street_state = models.TextField()
    update_state = models.TextField()
    player_state = models.TextField()

    def __unicode__(self):
        return self.game_state

class Player(models.Model):
    user = models.OneToOneField(User)
    in_game = models.OneToOneField(Game, null=True, blank=True)
    picture = models.ImageField(upload_to='profile_images', blank=True)

    def __unicode__(self):
        return self.user.username

class Achievement(models.Model):
    name = models.CharField(max_length=128,unique=True)
    progress = models.IntegerField(default = 0)
    rank = models.ForeignKey(Medal)
    player = models.ForeignKey(Player)
    def __unicode__(self):
        return self.name