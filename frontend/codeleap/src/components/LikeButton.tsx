import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Todo } from "../types/todo";

type Props = {
  todo: Todo;
  username: string;
  onToggleLike: (todo: Todo) => void;
};

export const LikeButton: React.FC<Props> = ({
  todo,
  username,
  onToggleLike,
}) => {
  const liked = todo.liked_by.includes(username);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onToggleLike(todo)}>
        <Text>
          {todo.liked_by.length}{" "}
          {todo.liked_by.includes(username) ? "❤️" : "🤍"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  button: { padding: 5, borderRadius: 5, marginRight: 5 },
  text: { fontSize: 16 },
  count: { fontSize: 14 },
});
