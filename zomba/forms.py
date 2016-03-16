from django import forms
from zomba.models import*
from django.contrib.auth.models import User

class UserForm(forms.ModelForm):
	password = forms.CharField(widget=forms.PasswordInput())

	class Meta:
		model = User
		fields = ('username','email','password')

class PlayerForm(forms.ModelForm):
	class Meta:
		model = Player
		fields = ('current_game','profile_picture')


