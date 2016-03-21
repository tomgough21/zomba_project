# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zomba', '0002_auto_20160320_2239'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='average_kills',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
