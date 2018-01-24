from .models import Post, Comment
from rest_framework import serializers

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('url', 'title', 'author', 'text', 'posted_date', 'id')

class CommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comment
        fields = ('url', 'author', 'text', 'comment_date','parent_post', 'parent_comment', 'show_reply', 'id')
