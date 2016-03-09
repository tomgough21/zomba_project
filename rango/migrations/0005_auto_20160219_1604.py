# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rango', '0004_auto_20160219_1554'),
    ]

    operations = [
        migrations.RenameField(
            model_name='category',
            old_name='likes',
            new_name='like',
        ),
        migrations.RenameField(
            model_name='category',
            old_name='views',
            new_name='view',
        ),
        migrations.RenameField(
            model_name='page',
            old_name='views',
            new_name='view',
        ),
    ]
