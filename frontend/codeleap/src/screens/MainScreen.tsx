import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Todo, Comment as TodoComment } from "../types/todo";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleLike,
  addComment,
  deleteComment,
} from "../api/todos";
import { ErrorModal } from "../components/ErrorModal";
import { EditModal } from "../components/EditModal";
import { DeleteModal } from "../components/DeleteModal";
import { CommentsSection } from "../components/CommentsSection";
import { LikeButton } from "../components/LikeButton";
import Icon from "react-native-vector-icons/Ionicons";
import { TodoForm } from "../components/TodoForm";

type Props = NativeStackScreenProps<RootStackParamList, "MainScreen">;

export default function MainScreen({ route }: Props) {
  const { username } = route.params;
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>(
    {}
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);

  // React Query
  const { data: todos = [] } = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const createTodoMutation = useMutation<Todo, Error, Partial<Todo>>({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
      setContent("");
    },
    onError: (err: any) => {
      setErrorMessage("Erro ao criar todo");
      setErrorVisible(true);
    },
  });

  const updateTodoMutation = useMutation<Todo, Error, Todo>({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setEditModalVisible(false);
      setEditTodo(null);
    },
    onError: (err: any) => {
      setErrorMessage("Erro ao atualizar todo");
      setErrorVisible(true);
    },
  });

  const deleteTodoMutation = useMutation<void, Error, string>({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    onError: (err: any) => {
      setErrorMessage("Erro ao deletar todo");
      setErrorVisible(true);
    },
  });

  const toggleLikeMutation = useMutation<Todo, Error, Todo>({
    mutationFn: (todo: Todo) => toggleLike(todo, username),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    onError: (err: any) => {
      setErrorMessage("Erro ao curtir/descurtir");
      setErrorVisible(true);
    },
  });

  const addCommentMutation = useMutation<
    TodoComment,
    Error,
    { todoId: string; content: string }
  >({
    mutationFn: ({ todoId, content }) => addComment(todoId, username, content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    onError: (err: any) => {
      setErrorMessage("Erro ao adicionar comentário");
      setErrorVisible(true);
    },
  });

  const deleteCommentMutation = useMutation<
    void,
    Error,
    { todoId: string; commentId: string }
  >({
    mutationFn: ({ todoId, commentId }) =>
      deleteComment(todoId, commentId, username),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    onError: (err: any) => {
      setErrorMessage("Erro ao deletar comentário");
      setErrorVisible(true);
    },
  });

  // Handlers
  const handleAddTodo = () => {
    if (!title || !content) return;
    createTodoMutation.mutate({ username, title, content });
  };

  const handleEditTodo = () => {
    if (!editTodo) return;
    updateTodoMutation.mutate(editTodo);
  };

  const openDeleteModal = (todo: Todo) => {
    if (todo.username !== username) return;
    setTodoToDelete(todo);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (todoToDelete) {
      deleteTodoMutation.mutate(todoToDelete.id);
      setDeleteModalVisible(false);
      setTodoToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setTodoToDelete(null);
  };

  const getTimeAgo = (createdAt: string) => {
    const now = Date.now();
    const created = new Date(createdAt).getTime();
    const diffMs = now - created;

    const minutes = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}min ago`;
    return "seconds ago";
  };

  return (
    <SafeAreaView style={styles.container}>
      <TodoForm
        title={title}
        content={content}
        setTitle={setTitle}
        setContent={setContent}
        onSubmit={handleAddTodo}
      />

      <FlatList
        style={styles.list}
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <View style={styles.todoHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.todoTitle}>{item.title}</Text>
              </View>

              {item.username === username && (
                <View style={styles.todoActions}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => openDeleteModal(item)}
                  >
                    <Icon name="trash" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                      setEditTodo(item);
                      setEditModalVisible(true);
                    }}
                  >
                    <Icon name="pencil" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.todoHeaderRow}>
              <Text style={styles.todoUsername}>@{item.username}</Text>
              <Text style={styles.todoTime}>
                {getTimeAgo(item.created_datetime)}
              </Text>
            </View>

            {/* Conteúdo */}
            <Text style={{ marginTop: 8 }}>{item.content}</Text>

            {/* Like e comentários */}
            <LikeButton
              todo={item}
              username={username}
              onToggleLike={(todo) => toggleLikeMutation.mutate(todo)}
            />
            <CommentsSection
              todo={item}
              username={username}
              commentTexts={commentTexts}
              setCommentTexts={setCommentTexts}
              addComment={(todoId, content) =>
                addCommentMutation.mutate({ todoId, content })
              }
              deleteComment={(todoId, commentId) =>
                deleteCommentMutation.mutate({ todoId, commentId })
              }
            />
          </View>
        )}
      />

      <EditModal
        visible={editModalVisible}
        todo={editTodo}
        onChange={setEditTodo}
        onSave={handleEditTodo}
        onClose={() => {
          setEditModalVisible(false);
          setEditTodo(null);
        }}
      />

      <DeleteModal
        visible={deleteModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: "#fafafa",
    fontSize: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  todoItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  todoTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: "700",
    color: "#222",
  },
  todoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#4a90e2",
  },
  todoActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    backgroundColor: "transparent",
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  todoContent: {
    padding: 12,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  todoHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    marginTop: 8,
  },

  todoUsername: {
    fontWeight: "700",
    color: "#838282ff",
  },
  todoTime: {
    fontStyle: "italic",
    color: "#838282ff",
  },
});
