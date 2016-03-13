# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('zomba', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('picture', models.ImageField(upload_to=b'profile_images', blank=True)),
                ('in_game', models.OneToOneField(null=True, blank=True, to='zomba.Game')),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='player',
            name='in_game',
        ),
        migrations.RemoveField(
            model_name='player',
            name='user',
        ),
        migrations.AlterField(
            model_name='achievement',
            name='player',
            field=models.ForeignKey(to='zomba.Profile'),
        ),
        migrations.DeleteModel(
            name='Player',
        ),
    ]
