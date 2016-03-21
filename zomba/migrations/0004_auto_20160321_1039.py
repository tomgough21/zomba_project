# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zomba', '0003_player_average_kills'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='average_kills',
            field=models.FloatField(default=0),
            preserve_default=True,
        ),
    ]
