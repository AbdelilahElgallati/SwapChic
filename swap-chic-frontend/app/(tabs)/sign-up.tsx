import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
// import axios from 'axios';
import { registerUser } from "../../api/api";

const SingUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    localisation: "",
  });
  const [photo, setPhoto] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectPhoto = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets) {
        const selectedPhoto = response.assets[0];
        setPhoto({
          uri: selectedPhoto.uri,
          type: selectedPhoto.type,
          name: selectedPhoto.fileName,
        });
      }
    });
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password || !photo) {
      return Alert.alert(
        "Erreur",
        "Tous les champs et une photo sont obligatoires."
      );
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("phone", formData.phone);
      data.append("localisation", formData.localisation);
      data.append("photo", {
        uri: photo.uri,
        type: photo.type,
        name: photo.name,
      });

      const response = await registerUser(data);
      Alert.alert("Succès", response.data.message);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", error.response?.data?.message || "Erreur serveur.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        onChangeText={(text) => handleInputChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        onChangeText={(text) => handleInputChange("email", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        onChangeText={(text) => handleInputChange("password", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        keyboardType="phone-pad"
        onChangeText={(text) => handleInputChange("phone", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Localisation"
        onChangeText={(text) => handleInputChange("localisation", text)}
      />
      <TouchableOpacity style={styles.photoButton} onPress={handleSelectPhoto}>
        <Text style={styles.photoButtonText}>Choisir une photo</Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo.uri }} style={styles.preview} />}
      <Button title="S'inscrire" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  photoButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  photoButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  preview: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default SingUp;
