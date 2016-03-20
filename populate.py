import os
import django
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
    #add your test users here

def add_user(username, email, password,mostKills,mostDays,mostPartyMembers, totalDays, totalKills):
    user = User.objects.get_or_create(username=username, email=email)[0]
    user.set_password(password)
    user.save()
    #create the Player profile
    profile = Player.objects.get_or_create(user = user,most_kills=mostKills,most_days_survived=mostDays,most_people=mostPartyMembers,total_days=totalDays,total_kills=totalKills)
    return user

def setup_admin_account():
    user = User.objects.create_superuser(username='admin', password='password', email='admin@zomba.co.uk')
    user.save()
    Player.objects.get_or_create(user = user);
    return

if __name__ == '__main__':
    populate()

