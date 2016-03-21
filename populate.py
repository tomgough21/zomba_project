import os
import django
from zomba.models import *

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zomba_project.settings')

django.setup()

def populate():
    #automate admin password and player profile:
    setup_admin_account()
    #add a standard user
    p3p = add_user('p3p','p3p@p3psoft.co.uk','password',0,1,2,3,4,0)
    test = add_user('test','test@test.com','12345',0,0,0,0,0,0)
    jill = add_user('jill','jill@test.com','jill',10,15,10,28,45,10)
    bob = add_user('bob','bob@test.com','bob',45,5,5,0,0,3)
    jen = add_user('jen','jen@test.com','jen',30,10,40,0,0,22)
    tom = add_user('tom','tom@test.com','tom',0,0,0,0,0,0)
    alex = add_user('alex','alex@test.com','alex',0,0,0,0,0,0)
    kiro = add_user('kiro','kiro@test.com','kiro',0,0,0,0,0,0)
    jess = add_user('jess','jess@test.com','jess',0,0,0,0,0,0)
    lyle = add_user('lyle','lyle@test.com','lyle',0,0,0,0,0,0)
    joe = add_user('joe','joe@test.com','joe',0,0,0,0,0,0)
    mark = add_user('mark','mark@test.com','mark',0,0,0,0,0,0)
    nigel = add_user('nigel','nigel@test.com','nigel',0,0,0,0,0,0)
    luke = add_user('luke','luke@test.com','luke',0,0,0,0,0,0)
    han = add_user('han','han@test.com','han',0,0,0,0,0,0)
    leya = add_user('leya','leya@test.com','leya',0,0,0,0,0,0)
    chewie = add_user('chewie','chewie@test.com','chewie',0,0,0,0,0,0)
    jabba = add_user('jabba','jabba@test.com','jabba',0,0,0,0,0,0)
    lando = add_user('lando','lando@test.com','lando',0,0,0,0,0,0)
    palpatine = add_user('palpatine','palpatine@test.com','palpatine',0,0,0,0,0,0)


    gold_days = add_badge('Survivor Gold','survive for 15 days','days',15,3,'images/badges/gold_days0000.jpg')
    silver_days = add_badge('Survivor Silver','survive for 10 days','days',10,2,'images/badges/silver_days0000.jpg')
    bronze_days = add_badge('Survivor Bronze','survive for 5 days','days',5,1,'images/badges/bronze_days0000.jpg')
	
    gold_party = add_badge('Party Gold','40 party members','party',40,3,'images/badges/gold_party0000.jpg')
    silver_party = add_badge('Party Silver','20 party members','party',20,2,'images/badges/silver_party0000.jpg')
    bronze_party = add_badge('Party Bronze','10 party members','party',10,1,'images/badges/bronze_party0000.jpg')
	
    gold_games = add_badge('Stamina Gold','play 20 games','games',20,3,'images/badges/gold_games0000.jpg')
    silver_games = add_badge('Stamina Silver','play 10 games','games',10,2,'images/badges/silver_games0000.jpg')
    bronze_games = add_badge('Stamina Bronze','play 5 games','games',5,1,'images/badges/bronze_games0000.jpg')
	
    gold_kills = add_badge('Kills Gold','kill 50 zombies','kills',50,3,'images/badges/gold_kills0000.jpg')
    silver_kills = add_badge('Kills Silver','kill 20 zombies','kills',20,2,'images/badges/silver_kills0000.jpg')
    bronze_kills = add_badge('Kills Bronze','kill 10 zombies','kills',10,1,'images/badges/bronze_kills0000.jpg')

    
    add_achievement(bronze_kills, jill)
    add_achievement(bronze_days, jill)
    add_achievement(silver_days, jill)
    add_achievement(gold_days, jill)
    add_achievement(bronze_party, jill)
    add_achievement(bronze_games, jill)
    add_achievement(silver_games, jill)

    add_achievement(bronze_kills, bob)
    add_achievement(silver_kills, bob)
    add_achievement(bronze_days, bob)

    add_achievement(bronze_kills, jen)
    add_achievement(silver_kills, jen)
    add_achievement(bronze_days, jen)
    add_achievement(silver_days, jen)
    add_achievement(bronze_party, jen)
    add_achievement(silver_party, jen)
    add_achievement(gold_party, jen)
    add_achievement(bronze_games, jen)
    add_achievement(silver_games, jen)
    add_achievement(gold_games, jen)




def add_user(username, email, password,mostKills,mostDays,mostPartyMembers, totalDays, totalKills, gamesPlayed):
    user = User.objects.get_or_create(username=username, email=email)[0]
    user.set_password(password)
    user.save()
    #create the Player profile
    player = Player.objects.get_or_create(user = user,most_kills=mostKills,most_days_survived=mostDays,most_people=mostPartyMembers,total_days=totalDays,total_kills=totalKills, games_played=gamesPlayed)[0]
    return player

def add_badge(name,description,badge_type,criteria,level,icon):
    b = Badge.objects.get_or_create(name=name)[0]
    b.description=description
    b.badge_type=badge_type
    b.criteria=criteria
    b.level=level
    b.icon=icon
    b.save()
    return b

def add_achievement(badge,player):
    a = Achievement.objects.get_or_create(badge=badge,player=player)[0]
    a.save()
    return a

def setup_admin_account():
    user = User.objects.create_superuser(username='admin', password='password', email='admin@zomba.co.uk')
    user.save()
    Player.objects.get_or_create(user = user);
    return

if __name__ == '__main__':
    populate()

