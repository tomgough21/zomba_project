# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rango', '0002_auto_20160212_1604'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Like',
        ),
        migrations.DeleteModel(
            name='View',
        ),
        migrations.AddField(
            model_name='category',
            name='like',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='category',
            name='view',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
