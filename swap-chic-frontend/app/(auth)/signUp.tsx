import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateFields = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!name.trim()) errors.name = "Le nom est requis.";
    if (!email.trim()) errors.email = "L'email est requis.";
    else if (!emailRegex.test(email)) errors.email = "Format d'email invalide.";
    if (!password) errors.password = "Le mot de passe est requis.";
    else if (password.length < 6)
      errors.password = "Le mot de passe doit comporter au moins 6 caractères.";
    if (!phone) errors.phone = "Le numéro de téléphone est requis.";
    else if (!phoneRegex.test(phone))
      errors.phone = "Numéro de téléphone invalide (10 chiffres requis).";
    if (!localisation.trim()) errors.localisation = "La ville est requise.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission requise",
        "Autorisez l'accès à votre galerie pour ajouter une photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone", phone);
    formData.append("localisation", localisation);

    if (photo) {
      const filename = photo.split("/").pop();
      const type = `image/${filename.split(".").pop()}`;
      formData.append("photo", {
        uri: photo,
        name: filename,
        type,
      });
    }

    try {
      const response = await fetch("http://192.168.1.2:3001/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Succès", "Utilisateur inscrit avec succès !");
        router.push("/signIn");
      } else {
        Alert.alert("Erreur", data.message || "Échec de l'inscription.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      Alert.alert("Erreur", "Un problème est survenu lors de l'inscription.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        value={name}
        onChangeText={setName}
      />
      {fieldErrors.name && (
        <Text style={styles.errorText}>{fieldErrors.name}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      {fieldErrors.email && (
        <Text style={styles.errorText}>{fieldErrors.email}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {fieldErrors.password && (
        <Text style={styles.errorText}>{fieldErrors.password}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      {fieldErrors.phone && (
        <Text style={styles.errorText}>{fieldErrors.phone}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Localisation"
        value={localisation}
        onChangeText={setLocalisation}
      />
      {fieldErrors.localisation && (
        <Text style={styles.errorText}>{fieldErrors.localisation}</Text>
      )}

      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>
          {photo ? "Changer de photo" : "Ajouter une photo"}
        </Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Vous avez déja un compte ?{" "}
        <Text style={styles.link} onPress={() => router.push("/signIn")}>
          Se connecter
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6200EE",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  photoButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  photoButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginTop: 15,
  },
  footerText: {
    marginTop: 25,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  link: {
    color: "#6200EE",
    fontWeight: "bold",
  },
});

export default SignUp;
