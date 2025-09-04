from django.db import models


class Todo(models.Model):
    username = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_datetime = models.DateTimeField(auto_now_add=True)
    liked_by = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.title


class Comment(models.Model):
    todo = models.ForeignKey(Todo, related_name="comments", on_delete=models.CASCADE)
    username = models.CharField(max_length=100)
    content = models.TextField()
    created_datetime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username}: {self.content[:20]}"