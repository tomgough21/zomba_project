# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rango', '0003_auto_20160214_1440'),
    ]

    operations = [
        migrations.RenameField(
            model_name='category',
            old_name='like',
            new_name='likes',
        ),
        migrations.RenameField(
            model_name='category',
            old_name='view',
            new_name='views',
        ),
        migrations.RenameField(
            model_name='page',
            old_name='view',
            new_name='views',
        ),
    ]
