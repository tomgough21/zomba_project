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


@login_required
def create_player(request):
    Player.objects.create(user = request.user)
    user = request.user
    username = user.username
    return HttpResponseRedirect('/zomba/profile/'+ username)

def profile(request, username):
    context_dict={}
    try:
        user = User.objects.get(username = username)
        context_dict['profile_user'] = user
        player = Player.objects.get(user = user)
        context_dict['player'] = player
    except:
        pass
    return render(request, 'zomba/profile.html',context_dict)

def user_login(request):

    # If the request is a HTTP POST, try to pull out the relevant information.
    if request.method == 'POST':
        # Gather the username and password provided by the user.
        # This information is obtained from the login form.
                # We use request.POST.get('<variable>') as opposed to request.POST['<variable>'],
                # because the request.POST.get('<variable>') returns None, if the value does not exist,
                # while the request.POST['<variable>'] will raise key error exception
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Use Django's machinery to attempt to see if the username/password
        # combination is valid - a User object is returned if it is.
        user = authenticate(username=username, password=password)

        # If we have a User object, the details are correct.
        # If None (Python's way of representing the absence of a value), no user
        # with matching credentials was found.
        if user:
            # Is the account active? It could have been disabled.
            if user.is_active:
                # If the account is valid and active, we can log the user in.
                # We'll send the user back to the homepage.
                login(request, user)
                return HttpResponseRedirect('/zomba/')
            else:
                # An inactive account was used - no logging in!
                return HttpResponse("Your Zomba account is disabled.")
        else:
            # Bad login details were provided. So we can't log the user in.
            print "Invalid login details: {0}, {1}".format(username, password)
            return HttpResponse("Invalid login details supplied.")

    # The request is not a HTTP POST, so display the login form.
    # This scenario would most likely be a HTTP GET.
    else:
        # No context variables to pass to the template system, hence the
        # blank dictionary object...
        return render(request, 'registration/login.html', {})

@login_required
def restricted(request):
	return HttpResponse("Since you're logged in, you can see this text")

def user_logout(request):
	logout(request)
	return HttpResponseRedirect('/zomba/')

#hacked together for testing
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

def helper_get_gamestate(g):
    house = g.street.get_current_house()
    state = { "game_state" : g.game_state,
              "time_left": g.time_left,

              "player":{ "party": g.player_state.party,
                         "ammo": g.player_state.ammo,
                         "food": g.player_state.food ,
                         "kills": g.player_state.kills,
                         "days": g.player_state.days},
              "street":{ "name": g.street.name,
                         "num_of_houses": g.street.num_of_houses,
                         "current_house": g.street.current_house},
              "house":  { "num_of_rooms" : house.num_of_rooms,
                           "current_room" : house.current_room}
            }
    if g.is_day_over():
        state["game_state"] = "DAY_OVER"
    if g.is_game_over():
        state["game_state"] = "GAME_OVER"

    return state

@login_required
def engine_update(request):
    if request.is_ajax():
        update_event = json.loads(request.body)
        if "instruction" not in update_event:
            return JsonResponse({"command": "malformed", "status": "failed"})

        if update_event["instruction"] == "new_game":   #restart game
            g = helper_new_game(request.user)
            return JsonResponse({"command": "new_game", "status": "ok", "state": helper_get_gamestate(g) })

        if update_event["instruction"] == "load_game":      #either load or newgame and tell client which
            g = helper_get_game(request.user)
            if g == None:
                g = helper_new_game(request.user)
                return JsonResponse({"command": "new_game", "status": "ok", "state": helper_get_gamestate(g)})
            return JsonResponse({"command": "load_game", "status": "ok", "state": helper_get_gamestate(g)})

        if update_event["instruction"] == "take_turn":  #take a turn
            g = helper_get_game(request.user)
            if(update_event["turn"] in g.turn_options()):
                g.take_turn(update_event["turn"], int(update_event["data1"]))
                helper_save_game(request.user, g)
                return JsonResponse({"command": "take_turn", "status": "ok", "state": helper_get_gamestate(g)})
            return JsonResponse({"command": "take_turn", "status": "invalid turn", "state": helper_get_gamestate(g)})

        if update_event["instruction"] == "end_day":  #end the day
            g = helper_get_game(request.user)
            g.end_day()
            g.start_new_day()
            helper_save_game(request.user, g)
            return JsonResponse({"command": "end_day", "status": "ok", "state": helper_get_gamestate(g)})

    return JsonResponse({"command": update_event, "status": "failed"})

@login_required
def engine_debug(request):
    if request.user.is_superuser:
        return render(request,'zomba/engine_debug.html')
    else:
        return HttpResponseRedirect('/zomba/')

@login_required
def engine_editor(request):
    if request.user.is_superuser:
        return render(request,'zomba/engine_editor.html')
    else:
        return HttpResponseRedirect('/zomba/')

@login_required
def engine_test(request):
    if request.user.is_superuser:
        return render(request,'zomba/engine_test.html')
    else:
        return HttpResponseRedirect('/zomba/')