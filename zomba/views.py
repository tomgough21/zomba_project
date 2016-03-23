from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import  login_required

from datetime import datetime
import json
from django.http import JsonResponse
import pickle

import zomba_engine.game as Engine
from zomba.forms import*

def index(request):
    context_dict = {}
    context_dict['visits'] = 0
    response = render(request,'zomba/index.html', context_dict)
    return response

def about(request):
	return render(request, 'zomba/about.html')

def leaderboard(request):
    mostDays = Player.objects.order_by('-most_days_survived')[:20]
    mostKills = Player.objects.order_by('-most_kills')[:20]
    mostPartyMembers = Player.objects.order_by('-most_people')[:20]
    context_dict = {'mostDays':mostDays,'mostKills':mostKills,'mostPartyMembers':mostPartyMembers}
    return render(request, 'zomba/leaderboard.html',context_dict)
    
def achievements(request):
    return render(request, 'zomba/achievements.html')
    
def gallery(request):
    return render(request, 'zomba/gallery.html')

def profile(request, username):
    context_dict={}
    try:
        user = User.objects.get(username = username)
        context_dict['profile_user'] = user
        player = Player.objects.get(user = user)
        context_dict['player'] = player
        context_dict['average_days'] = player.total_days / player.games_played
    except:
        pass
    return render(request, 'zomba/profile.html',context_dict)

#these methods should be in a ZombaInterface class, time is against me
def helper_update_stats(player, game):
    if(not player or not game):
        return

    if player.most_kills < game.player_state.kills:
        player.most_kills = game.player_state.kills

    if player.most_people < game.player_state.party:
        player.most_people = game.player_state.party

    if player.most_days_survived < game.player_state.days:
        player.most_days_survived = game.player_state.days

def helper_get_achievement(player):
    achievements = Achievement.objects.filter(player = player)
    acc_dict = {}
    for achievement in achievements:
        acc_dict[achievement.badge.name] = achievement.badge
    return acc_dict

def helper_new_achievement(player, game):
    badges = helper_get_achievement(player)

    if player.most_days_survived >= 20 and "Survivor Gold" not in badges:
        Achievement.objects.get_or_create(badge=Badge.objects.filter(name = "Survivor Gold")[0],player=player)
    elif player.most_days_survived >= 10 and "Survivor Silver" not in badges:
        Achievement.objects.get_or_create(badge=Badge.objects.filter(name = "Survivor Silver")[0],player=player)
    elif player.most_days_survived >= 5 and "Survivor Bronze" not in badges:
        Achievement.objects.get_or_create(badge=Badge.objects.filter(name = "Survivor Bronze")[0],player=player)

    if player.most_kills >= 50 and "Kills Gold" not in badges:
        Achievement.objects.get_or_create(badge=Badge.objects.filter(name = "Kills Gold")[0],player=player)
    elif player.most_kills >= 20 and "Kills Silver" not in badges:
        Achievement.objects.get_or_create(badge=Badge.objects.filter(name = "Kills Silver")[0],player=player)
    elif player.most_kills >= 10 and "Kills Bronze" not in badges:
        Achievement.objects.get_or_create(badge=Badge.objects.filter(name = "Kills Bronze")[0],player=player)

    if player.games_played >= 20 and "Stamina Gold" not in badges:
        Achievement.objects.get_or_create(badge=Badge.objects.filter(name = "Stamina Gold")[0],player=player)
    elif player.games_played >= 10 and "Stamina Silver" not in badges:
        Achievement.objects.get_or_create(badge=Badge.objects.filter(name = "Stamina Silver")[0],player=player)
    elif player.games_played >= 5 and "Stamina Bronze" not in badges:
        Achievement.objects.get_or_create(badge=Badge.objects.filter(name = "Stamina Bronze")[0],player=player)

    if player.most_people >= 40 and "Party Gold" not in badges:
        Achievement.objects.get_or_create(badge=Badge.objects.filter(name = "Party Gold")[0],player=player)
    elif player.most_people >= 20 and "Party Silver" not in badges:
        Achievement.objects.get_or_create(badge=Badge.objects.filter(name = "Party Silver")[0],player=player)
    elif player.most_people >= 10 and "Party Bronze" not in badges:
        Achievement.objects.get_or_create(badge=Badge.objects.filter(name = "Party Bronze")[0],player=player)
    return

def helper_save_game(user, game):
    player = get_object_or_404(Player, user = user);
    if(not player.current_game):
        player.current_game = InGame.objects.create(
            game_state = pickle.dumps({"game_state": game.game_state, "time_left": game.time_left}),
            street_state = pickle.dumps(game.street),
            update_state = pickle.dumps(game.update_state),
            player_state = pickle.dumps(game.player_state),
        );
    else:
        player.current_game.player_state = pickle.dumps(game.player_state)
        player.current_game.update_state = pickle.dumps(game.update_state)
        player.current_game.street_state = pickle.dumps(game.street)
        player.current_game.game_state = pickle.dumps({"game_state": game.game_state, "time_left": game.time_left})


    player.current_game.save()
    helper_update_stats(player, game)
    helper_new_achievement(player, game)
    player.save()

def helper_new_game(user):  
    g = Engine.Game()
    g.start_new_day()
    helper_save_game(user, g)
    return g

def helper_get_game(user):
    player = get_object_or_404(Player, user = user)

    if player.current_game == None:
        return None

    g = Engine.Game()
    g.player_state = pickle.loads(player.current_game.player_state)
    g.update_state = pickle.loads(player.current_game.update_state)
    g.street = pickle.loads(player.current_game.street_state)
    game_state = pickle.loads(player.current_game.game_state)
    g.game_state = game_state["game_state"]
    g._time_left = game_state["time_left"]
    return g

def helper_get_gamestate(user, g):
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
        player = get_object_or_404(Player, user = user);
 #you dont get the stat boost unless you finish
        player.games_played += 1
        player.total_days += g.player_state.days
        player.total_kills += g.player_state.kills
        player.save();

    return state

@login_required
def engine_update(request):
    if request.is_ajax():
        update_event = json.loads(request.body)
        if "instruction" not in update_event:
            return JsonResponse({"command": "malformed", "status": "failed"})

        if update_event["instruction"] == "new_game":   #restart game
            g = helper_new_game(request.user)
            return JsonResponse({"command": "new_game", "status": "ok", "state": helper_get_gamestate(request.user, g) })

        if update_event["instruction"] == "load_game":      #either load or newgame and tell client which
            g = helper_get_game(request.user)
            if g == None:
                g = helper_new_game(request.user)
                return JsonResponse({"command": "new_game", "status": "ok", "state": helper_get_gamestate(request.user, g)})
            return JsonResponse({"command": "load_game", "status": "ok", "state": helper_get_gamestate(request.user, g)})

        if update_event["instruction"] == "take_turn":  #take a turn
            g = helper_get_game(request.user)
            if(update_event["turn"] in g.turn_options()):
                if update_event["turn"] == "MOVE" and int(update_event["data1"]) == g.street.current_house: #move to current house, noop
                    return JsonResponse({"command": "take_turn", "status": "ok", "state": helper_get_gamestate(request.user, g)})
                g.take_turn(update_event["turn"], int(update_event["data1"]))
                helper_save_game(request.user, g)
                return JsonResponse({"command": "take_turn", "status": "ok", "state": helper_get_gamestate(request.user, g)})
            return JsonResponse({"command": "take_turn", "status": "invalid turn", "state": helper_get_gamestate(request.user, g)})

        if update_event["instruction"] == "end_day":  #end the day
            g = helper_get_game(request.user)
            g.end_day()
            g.start_new_day()
            helper_save_game(request.user, g)
            return JsonResponse({"command": "end_day", "status": "ok", "state": helper_get_gamestate(request.user, g)})

    return JsonResponse({"command": update_event, "status": "failed"})

@login_required
def engine_editor(request):
    if request.user.is_superuser:
        return render(request,'zomba/engine_editor.html')
    else:
        return HttpResponseRedirect('/zomba/')

@login_required
def game(request):
    return render(request,'zomba/game.html')
