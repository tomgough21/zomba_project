# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zomba', '0004_auto_20160321_1039'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='player',
            name='average_kills',
        ),
    ]
