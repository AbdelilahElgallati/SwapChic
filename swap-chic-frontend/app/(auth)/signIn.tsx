import React, { useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "@/hooks/warmUpBrowser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

// Assurez-vous de gérer l'authentification à partir de Clerk ici
WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  useWarmUpBrowser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleSignInGoogle = React.useCallback(async () => {
    try {
      // Utilisation de `expo-linking` pour créer l'URL de redirection
      const redirectUrl = Linking.createURL("/", { scheme: "swapchic" });

      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: redirectUrl, // Utilisez l'URL créée avec expo-linking
      });

      // Si le flux d'authentification est réussi
      if (createdSessionId) {
        setActive({ session: createdSessionId }); // Définit la session comme acti
        router.replace("/(tabs)"); // Redirige l'utilisateur vers la page du tableau de bord
      } else {
        alert("Veuillez compléter le processus d’authentification.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur d’authentification. Veuillez réessayer.");
    }
  }, [startOAuthFlow]);

  const validateFields = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) errors.email = "L'email est requis";
    else if (!emailRegex.test(email)) errors.email = "Email invalide";

    if (!password) errors.password = "Le mot de passe est requis";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateFields()) return;

    try {
      const response = await axios.post("https://swapchic-api.onrender.com/user/login", {
        email,
        password,
      });
      // console.log(response.data);
      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);

        try {
          const userData = await fetchUserData(response.data.token);
          console.log("Données utilisateur :", userData);

          router.push("/(tabs)"); // Redirection vers le tableau de bord
        } catch {
          Alert.alert(
            "Erreur",
            "Impossible de récupérer les données utilisateur."
          );
        }
      }
    } catch (err) {
      console.error(err);
      handleErrors(err);
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("https://swapchic-api.onrender.com/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Renvoie les données utilisateur
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des données utilisateur : ",
        err
      );
      throw err;
    }
  };

  const handleErrors = (err) => {
    if (err.response?.data?.error) {
      const errorMessage = err.response.data.error;

      if (errorMessage.includes("Email incorrect")) {
        setFieldErrors({
          email: "Email incorrect",
          password: "",
        });
      } else if (errorMessage.includes("Mot de passe incorrect")) {
        setFieldErrors({
          email: "",
          password: "Mot de passe incorrect",
        });
      } else {
        Alert.alert("Erreur", "Un problème est survenu lors de la connexion.");
      }
    } else {
      Alert.alert("Erreur", "Erreur inconnue. Veuillez réessayer.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se connecter</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignInGoogle}>
        <Text style={styles.buttonText}>Sign In with Google</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Pas encore inscrit ?{" "}
        <Text style={styles.link} onPress={() => router.push("/signUp")}>
          Créer un compte
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6200EE",
    marginBottom: 30,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default SignIn;
