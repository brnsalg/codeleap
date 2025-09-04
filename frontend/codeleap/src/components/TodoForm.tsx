import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type Props = {
  title: string;
  content: string;
  setTitle: (text: string) => void;
  setContent: (text: string) => void;
  onSubmit: () => void;
};

export const TodoForm: React.FC<Props> = ({
  title,
  content,
  setTitle,
  setContent,
  onSubmit,
}) => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="hello world"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Content here"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, !title || !content ? styles.buttonDisabled : {}]}
        onPress={onSubmit}
        disabled={!title || !content}
      >
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
