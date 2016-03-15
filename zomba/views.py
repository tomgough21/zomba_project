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

@login_required
def create_player(request):
    Player.objects.create(user = request.user)
    user = request.user
    username = user.username
    return HttpResponseRedirect('/zomba/profile/'+ username)

@login_required
def profile(request, username):
    return HttpResponse("this profile is amazing look at all those cool achievements")

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
    if(not player.in_game):
        player.in_game = InGame.objects.create(
            game_state = pickle.dumps(game.game_state),
            street_state = pickle.dumps(game.street),
            update_state = pickle.dumps(game.update_state),
            player_state = pickle.dumps(game.player_state),
        );
    else:
        player.in_game.player_state = pickle.dumps(game.player_state)
        player.in_game.update_state = pickle.dumps(game.update_state)
        player.in_game.street_state = pickle.dumps(game.street)
        player.in_game.game_state = pickle.dumps(game.game_state)

    player.in_game.save()
    player.save()

def helper_new_game(user):
    g = Engine.Game()
    g.start_new_day()
    helper_save_game(user, g)

def helper_get_game(user):
    player = get_object_or_404(Player, user = user);
    g = Engine.Game()
    g.player_state = pickle.loads(player.in_game.player_state)
    g.update_state = pickle.loads(player.in_game.update_state)
    g.street = pickle.loads(player.in_game.street_state)
    g.game_state = pickle.loads(player.in_game.game_state)
    return g

@login_required
def engine_update(request):
    if request.is_ajax():
        update_event = json.loads(request.body)
        if "instruction" not in update_event:
            return JsonResponse({"command": "malformed", "status": "failed"})

        if update_event["instruction"] == "new_game":   #create a new game and send the state
            helper_new_game(request.user)
            status = {}
            return JsonResponse({"command": "new_game", "status": "ok"})

        if update_event["instruction"] == "load_game":      #this would just send the whole game state (refresh)
            g = helper_get_game(request.user)
            return JsonResponse({"command": "load_game", "status": "ok"})

        if update_event["instruction"] == "take_turn":  #take a turn
            g = helper_get_game(request.user)
            if(update_event["turn"] in g.turn_options()):
                g.take_turn(update_event["turn"], int(update_event["data1"]))
                helper_save_game(request.user, g)
                return JsonResponse({"command": "take_turn", "status": "ok", "game_state": g.game_state})
            return JsonResponse({"command": "take_turn", "status": "invalid turn"})

    return JsonResponse({"command": update_event, "status": "failed"})

@login_required
def engine_debug(request):
    if request.user.is_superuser:
        return render(request,'zomba/engine_debug.html')
    else:
        return HttpResponseRedirect('/zomba/')