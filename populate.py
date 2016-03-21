import os
import django
import datetime
from zomba.models import *

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zomba_project.settings')

django.setup()

def populate():
    #automate admin password and player profile:
    setup_admin_account()
    #add a standard user
    add_user('p3p','p3p@p3psoft.co.uk','password',0,1,2,3,4)
    add_user('test','test@test.com','12345',0,0,0,0,0)
    add_user('jill','jill@test.com','jill',0,0,0,0,0)
    add_user('bob','bob@test.com','bob',0,0,0,0,0)
    add_user('jen','jen@test.com','jen',0,0,0,0,0)
    add_user('tom','tom@test.com','tom',0,0,0,0,0)
    add_user('alex','alex@test.com','alex',0,0,0,0,0)
    add_user('kiro','kiro@test.com','kiro',0,0,0,0,0)
    add_user('jess','jess@test.com','jess',0,0,0,0,0)
    add_user('lyle','lyle@test.com','lyle',0,0,0,0,0)
    add_user('joe','joe@test.com','joe',0,0,0,0,0)
    add_user('mark','mark@test.com','mark',0,0,0,0,0)
    add_user('nigel','nigel@test.com','nigel',0,0,0,0,0)
    add_user('luke','luke@test.com','luke',0,0,0,0,0)
    add_user('han','han@test.com','han',0,0,0,0,0)
    add_user('leya','leya@test.com','leya',0,0,0,0,0)
    add_user('chewie','chewie@test.com','chewie',0,0,0,0,0)
    add_user('jabba','jabba@test.com','jabba',0,0,0,0,0)
    add_user('lando','lando@test.com','lando',0,0,0,0,0)
    add_user('trump','trump@test.com','trump',0,0,0,0,0)

    gold_days = add_badge('Days-15','survive for 15 days','gold_days',15,3,'badges/gold_days0000.jpg')
    silver_days = add_badge('Days-10','survive for 10 days','silver_days',10,2,'badges/silver_days0000.jpg')
    bronze_days = add_badge('Days-5','survive for 5 days','bronze_days',5,1,'badges/bronze_days0000.jpg')
	
    gold_party = add_badge('Party-40','40 party members','gold_party',40,3,'badges/gold_party0000.jpg')
    silver_party = add_badge('Party-20','20 party members','silver_party',20,2,'badges/silver_party0000.jpg')
    bronze_party = add_badge('Party-10','10 party members','bronze_party',10,1,'badges/bronze_party0000.jpg')
	
    gold_games = add_badge('Stamina-20','play 20 games','gold_games',20,3,'badges/gold_games0000.jpg')
    silver_games = add_badge('Stamina-10','play 10 games','silver_games',10,2,'badges/silver_games0000.jpg')
    bronze_games = add_badge('Stamina-5','play 5 games','bronze_games',5,1,'badges/bronze_games0000.jpg')
	
    gold_kills = add_badge('Kills-50','kill 50 zombies','gold_kills',50,3,'badges/gold_kills0000.jpg')
    silver_kills = add_badge('Kills-20','kill 20 zombies','silver_kills',20,2,'badges/silver_kills0000.jpg')
    bronze_kills = add_badge('Kills-10','kill 10 zombies','bronze_kills',10,1,'badges/bronze_kills0000.jpg')
    #add your test users here

def add_user(username, email, password,mostKills,mostDays,mostPartyMembers, totalDays, totalKills):
    user = User.objects.get_or_create(username=username, email=email)[0]
    user.set_password(password)
    user.save()
    #create the Player profile
    profile = Player.objects.get_or_create(user = user,most_kills=mostKills,most_days_survived=mostDays,most_people=mostPartyMembers,total_days=totalDays,total_kills=totalKills)
    return user

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

