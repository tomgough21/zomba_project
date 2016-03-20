# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zomba', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='total_days',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='player',
            name='total_kills',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
