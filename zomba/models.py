from django.utils import timezone
from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User
from registration.signals import *
import zomba_engine.game as Engine
import pickle

def addPlayer(sender, user, request, **kwargs):
    Player.objects.get_or_create(user=user)

user_registered.connect(addPlayer)

class Badge(models.Model):
    name = models.CharField(max_length=128,unique=True)
    description = models.TextField()
    criteria = models.IntegerField(default = 0)
    badge_type = models.CharField(max_length=128,)
    level = models.CharField(max_length=128)
    icon = models.ImageField(upload_to='images/badges', blank=True)
    def __unicode__(self):
        return self.name

class InGame(models.Model):
    game_state = models.TextField()
    street_state = models.TextField()
    update_state = models.TextField()
    player_state = models.TextField()
    game_object = None

    def __init__(self, *args, **kwargs):
        super(InGame, self).__init__(*args, **kwargs)
        self.game_object = Engine.Game()
        if not self.id: #model has not been saved yet
            self.game_object.start_new_day()
        else:   #load current state
            self.game_object.player_state = pickle.loads(self.player_state)
            self.game_object.update_state = pickle.loads(self.update_state)
            self.game_object.street = pickle.loads(self.street_state)
            game_state = pickle.loads(self.game_state)
            self.game_object.game_state = game_state["game_state"]
            self.game_object._time_left = game_state["time_left"]

    def restart(self):
        self.game_object = Engine.Game()
        self.game_object.start_new_day()

    def as_dictionary(self):
        g = self.game_object
        house = g.street.get_current_house()
        room  = house.room_list[house.current_room];
        state = { "game_state" : g.game_state,
          "time_left": g.time_left,
          "player": { "party": g.player_state.party,
                      "ammo" : g.player_state.ammo,
                      "food" : g.player_state.food ,
                      "kills": g.player_state.kills,
                      "days" : g.player_state.days},
          "street": { "name" : g.street.name,
                      "num_of_houses": g.street.num_of_houses,
                      "current_house": g.street.current_house },
          "house":  { "num_of_rooms" : house.num_of_rooms,
                      "current_room" : house.current_room},
          "room":   { "zombies": room.zombies, 
                      "people" : room.people,
                      "food"   : room.food,
                      "ammo"   : room.ammo },
          "update": { "food"   : g.update_state.food,
                      "ammo"   : g.update_state.ammo,
                      "kills"   : g.update_state.kills,
                      "party"   : g.update_state.party},
        }
        if g.is_day_over():
            state["game_state"] = "DAY_OVER"
        if g.is_game_over():
            state["game_state"] = "GAME_OVER"
        return state

    def save(self, *args, **kwargs):
        self.player_state = pickle.dumps(self.game_object.player_state)
        self.update_state = pickle.dumps(self.game_object.update_state)
        self.street_state = pickle.dumps(self.game_object.street)
        self.game_state = pickle.dumps({
            "game_state": self.game_object.game_state, 
            "time_left": self.game_object.time_left
        })
        super(InGame, self).save(*args, **kwargs)

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

    @property
    def average_days(self):
        if self.games_played != 0:
            return self.total_days / self.games_played
        return 0

    def get_new_achievements(self):
        now = timezone.now()
        earlier = now - timezone.timedelta(seconds=30)
        achievements = []
        for ach in Achievement.objects.filter(player = self, date_awarded__range=(earlier,now)):
            achievements.append({"name":ach.badge.name, "icon":ach.badge.icon.url, "desc":ach.badge.description});
        return achievements

    def get_gamestate_dict(self):
        state = self.current_game.as_dictionary()
        state['new_achievements'] = self.get_new_achievements()
        return state

    def new_game(self):
        game = self.current_game.game_object
        if game.is_game_over():
            self.games_played += 1
            self.total_days += game.player_state.days
            self.total_kills += game.player_state.kills
        self.current_game.restart()
        
    def save(self, *args, **kwargs): 
        if not self.current_game :
            self.current_game = InGame.objects.create()
        self.current_game.save()
        self._calculate_stats()
        self._caluculate_achievements() #autocreate the earned achievements
        super(Player, self).save(*args, **kwargs)

    def _calculate_stats(self):
        game = self.current_game.game_object
        if self.most_kills < game.player_state.kills:
            self.most_kills = game.player_state.kills
        if self.most_people < game.player_state.party:
            self.most_people = game.player_state.party
        if self.most_days_survived < game.player_state.days:
            self.most_days_survived = game.player_state.days

    def _caluculate_achievements(self):
        badges = Badge.objects.all()
        for badge in badges:
            #badge type is the tracked variable name to easily add new badges (code independance)
            if getattr(self, badge.badge_type) >= badge.criteria:
                if Achievement.objects.filter(player = self, badge = badge).first() == None:
                    Achievement.objects.create(badge = badge, player = self)

    def __unicode__(self):
        return self.user.username


class Achievement(models.Model):
    player = models.ForeignKey(Player)
    badge = models.ForeignKey(Badge)
    date_awarded = models.DateTimeField(auto_now_add=True, blank=True)
    def __unicode__(self):
        return self.player.user.username + " Achieved " + self.badge.name
