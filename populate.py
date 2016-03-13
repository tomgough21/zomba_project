import os
import django
from zomba.models import *

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zomba_project.settings')

django.setup()

def populate():
    add_user('p3p','p3p@p3psoft.co.uk','password')
    #add your test users here

def add_user(username, email, password):
    user = User.objects.get_or_create(username=username, email=email)[0]
    user.set_password(password)
    user.save()
    return user

if __name__ == '__main__':
    populate()

