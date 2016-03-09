# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rango', '0005_auto_20160219_1604'),
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
