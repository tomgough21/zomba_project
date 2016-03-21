# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zomba', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='badge',
            old_name='bage_type',
            new_name='badge_type',
        ),
        migrations.AlterField(
            model_name='badge',
            name='icon',
            field=models.ImageField(upload_to=b'badge_icon', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='badge',
            name='level',
            field=models.CharField(max_length=128),
            preserve_default=True,
        ),
    ]
