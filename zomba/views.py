from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import  login_required

from datetime import datetime
import json
from django.http import JsonResponse
import pickle

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
        context_dict['achievements'] = []
        for badge_type in Badge.objects.values_list('badge_type', flat=True).distinct():    #get each type of badge in an array, loop over each
            context_dict['achievements'].append(Achievement.objects.filter(player = player, badge__badge_type__contains=badge_type).order_by('-badge__level').first())  #get the best achievement of each type, if any
    except:
        pass
    return render(request, 'zomba/profile.html', context_dict)

@login_required
def engine_update(request):
    if request.is_ajax():
        player = get_object_or_404(Player, user = request.user)
        update_event = json.loads(request.body)
        if "instruction" not in update_event:
            return JsonResponse({"command": "malformed", "status": "failed"})

        if update_event["instruction"] == "new_game":   #restart game
            player.new_game()
            player.save()
            return JsonResponse({"command": "new_game", "status": "ok", "state": player.get_gamestate_dict() })

        if update_event["instruction"] == "load_game":      #either load or newgame and tell client which
            return JsonResponse({"command": "new_game", "status": "ok", "state": player.get_gamestate_dict()})

        if update_event["instruction"] == "take_turn":  #take a turn
            g = player.current_game.game_object
            if(update_event["turn"] in g.turn_options()):
                if update_event["turn"] == "MOVE" and int(update_event["data1"]) == g.street.current_house: #move to current house, noop
                    return JsonResponse({"command": "take_turn", "status": "ok", "state": player.get_gamestate_dict()})
                g.take_turn(update_event["turn"], int(update_event["data1"]))
                player.save()
                return JsonResponse({"command": "take_turn", "status": "ok", "state": player.get_gamestate_dict()})
            return JsonResponse({"command": "take_turn", "status": "invalid turn", "state": player.get_gamestate_dict()})

        if update_event["instruction"] == "end_day":  #end the day
            g = player.current_game.game_object
            g.end_day()
            g.start_new_day()
            player.save()
            return JsonResponse({"command": "end_day", "status": "ok", "state": player.get_gamestate_dict()})

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
