from rest_framework import serializers
from .models import Todo, Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class TodoSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Todo
        fields = '__all__'

    def get_likes_count(self, obj):
        return len(obj.liked_by)
