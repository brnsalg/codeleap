import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

export default function Signup({ navigation }: Props) {
  const [name, setName] = useState("");
  const [modalVisible, setModalVisible] = useState(true);

  const handleEnter = () => {
    console.log("Nome:", name);
    setModalVisible(false);
    navigation.replace("MainScreen", { username: name });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Please enter your username</Text>
            <TextInput
              style={styles.input}
              placeholder="John doe"
              value={name}
              onChangeText={setName}
            />
            <TouchableOpacity
              style={[styles.button, name ? {} : styles.buttonDisabled]}
              onPress={handleEnter}
              disabled={!name}
            >
              <Text style={styles.buttonText}>Enter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, marginBottom: 15 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonDisabled: { backgroundColor: "#aaa" },
  buttonText: { color: "#fff", fontSize: 16 },
});
