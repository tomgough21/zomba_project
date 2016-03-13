# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zomba', '0003_auto_20160313_1833'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Game',
            new_name='InGame',
        ),
    ]
