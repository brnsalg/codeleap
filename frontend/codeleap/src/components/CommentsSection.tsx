import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Todo, Comment as TodoComment } from "../types/todo";
import Icon from "react-native-vector-icons/Ionicons";

type Props = {
  todo: Todo;
  username: string;
  commentTexts: { [key: string]: string };
  setCommentTexts: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  addComment: (todoId: string, content: string) => void;
  deleteComment: (todoId: string, commentId: string) => void;
};

const getTimeAgo = (createdAt: string) => {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const diffMs = now - created;

  const minutes = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}min`;
  return "seconds ago";
};

export const CommentsSection: React.FC<Props> = ({
  todo,
  username,
  commentTexts,
  setCommentTexts,
  addComment,
  deleteComment,
}) => {
  return (
    <View style={{ marginTop: 10 }}>
      {todo.comments?.map((c) => (
        <View key={c.id} style={styles.commentRow}>
          <Text style={{ fontStyle: "italic", flex: 1 }}>
            {c.username}: {c.content} ({getTimeAgo(c.created_datetime)})
          </Text>
          {c.username === username && (
            <TouchableOpacity onPress={() => deleteComment(todo.id, c.id)}>
              <Icon name="trash" size={18} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TextInput
        placeholder="Add comment..."
        value={commentTexts[todo.id] || ""}
        onChangeText={(text) =>
          setCommentTexts((prev) => ({ ...prev, [todo.id]: text }))
        }
        style={styles.input}
      />
      <TouchableOpacity
        onPress={() => {
          addComment(todo.id, commentTexts[todo.id] || "");
          setCommentTexts((prev) => ({ ...prev, [todo.id]: "" }));
        }}
      >
        <Text style={styles.addText}>Comment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  commentRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  deleteText: { color: "#ff4d4d", marginLeft: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 5,
    marginTop: 5,
  },
  addText: { color: "#007bff", marginTop: 5 },
});
