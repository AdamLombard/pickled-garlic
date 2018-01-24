# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from .models import Post, Comment
from rest_framework import viewsets
from blog.serializers import PostSerializer, CommentSerializer

def index(request):
    return render(request, 'blog/index.html')

def post_detail(request, id):
    return render(request, "blog/post_detail.html")

def new_post(request):
    return render(request, 'blog/new_post.html')

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-posted_date')
    serializer_class = PostSerializer

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def get_queryset(self):
        queryset = Comment.objects.all().order_by('comment_date')
        parent_id = self.request.query_params.get('parent_id', None)
        if parent_id is not None:
            queryset = queryset.filter(parent_post=parent_id)
        return queryset
