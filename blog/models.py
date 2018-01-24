# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=300, default="Thrilling Garlic News")
    author = models.CharField(max_length=100, default="A Mystery Guest")
    text = models.TextField()
    posted_date = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    author = models.CharField(max_length=100, default="Insightful Internet Citizen")
    text = models.TextField()
    comment_date = models.DateTimeField(auto_now_add=True)
    parent_post = models.IntegerField()
    parent_comment = models.IntegerField()
    show_reply = models.BooleanField(default=False)

