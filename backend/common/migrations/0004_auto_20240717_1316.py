# Generated by Django 3.2.25 on 2024-07-17 13:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0003_customuser_profile'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='levels_first',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='customuser',
            name='levels_second',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='customuser',
            name='levels_third',
            field=models.IntegerField(default=0),
        ),
    ]
