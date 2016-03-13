import os
import django
from zomba.models import *

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zomba_project.settings')

django.setup()

def populate():
    #automate admin password and player profile:
    setup_admin_account()
    #add a standard user
    add_user('p3p','p3p@p3psoft.co.uk','password')

    #add your test users here

def add_user(username, email, password):
    user = User.objects.get_or_create(username=username, email=email)[0]
    user.set_password(password)
    user.save()
    #create the Player profile
    profile = Player.objects.get_or_create(user = user);
    return user

def setup_admin_account():
    user = User.objects.create_superuser(username='admin', password='password', email='admin@zomba.co.uk')
    user.save()
    Player.objects.get_or_create(user = user);
    return

if __name__ == '__main__':
    populate()

