# todo/views.py
from rest_framework import viewsets
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN,HTTP_201_CREATED, HTTP_204_NO_CONTENT
from rest_framework.decorators import action
from rest_framework.response import Response

from todo.serializers import TodoSerializer, CommentSerializer
from .models import Todo, Comment


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all().order_by('-created_datetime')
    serializer_class = TodoSerializer

    @action(detail=True, methods=['post'])
    def toggle_like(self, request, pk=None):
        todo = self.get_object()
        username = request.data.get("username")
        if not username:
            return Response({"error": "Username required"}, status=HTTP_400_BAD_REQUEST)

        if username in todo.liked_by:
            todo.liked_by.remove(username)
        else:
            todo.liked_by.append(username)
        todo.save()
        serializer = self.get_serializer(todo)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        todo = self.get_object()
        username = request.data.get("username")
        content = request.data.get("content")

        if not username or not content:
            return Response({"error": "username and content required"}, status=HTTP_400_BAD_REQUEST)

        comment = Comment.objects.create(todo=todo, username=username, content=content)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='comments/(?P<comment_id>[^/.]+)')
    def delete_comment(self, request, pk=None, comment_id=None):
        try:
            comment = Comment.objects.get(id=comment_id, todo_id=pk)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=HTTP_404_NOT_FOUND)

        username = request.query_params.get("username")

        if comment.username != username:
            return Response({"error": "Not allowed"}, status=HTTP_403_FORBIDDEN)

        comment.delete()
        return Response(status=HTTP_204_NO_CONTENT)