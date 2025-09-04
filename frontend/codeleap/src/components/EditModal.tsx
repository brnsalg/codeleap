import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Todo } from "../types/todo";

type Props = {
  visible: boolean;
  todo: Todo | null;
  onSave: (updatedTodo: Todo) => void;
  onClose: () => void;
  onChange: (todo: Todo) => void;
};

export const EditModal: React.FC<Props> = ({
  visible,
  todo,
  onSave,
  onClose,
  onChange,
}) => {
  if (!todo) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Todo</Text>
          <TextInput
            style={styles.input}
            value={todo.title}
            onChangeText={(text) => onChange({ ...todo, title: text })}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={todo.content}
            onChangeText={(text) => onChange({ ...todo, content: text })}
            multiline
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { flex: 1, backgroundColor: "#aaa" }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { flex: 1, marginRight: 10 }]}
              onPress={() => onSave(todo)}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: "#007bff",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
