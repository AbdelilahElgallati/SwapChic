import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useUser } from "@clerk/clerk-react"; // Pour récupérer les informations sur l'utilisateur connecté
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Dashboard = () => {
  // const { user, isLoaded } = useUser(); // Récupère l'utilisateur connecté via Clerk
  const { signOut } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token manquant");

      const response = await axios.get("http://192.168.1.2:3001/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur :", err);
      router.replace("/(auth)/signIn");
    } finally {
      setLoading(false);
    }
  };

  // Redirection si l'utilisateur n'est pas chargé
  // useEffect(() => {
  //   if (isLoaded && !user) {
  //     router.replace("/(auth)/signIn");
  //   }
  // }, [isLoaded, user]);

  useEffect(() => {
    fetchUser();
  }, []);

  // const handleSignOut = async () => {
  //   try {
  //     await signOut(); // Appel à la méthode signOut via useAuth
  //     // Alert.alert("Vous êtes déconnecté !");
  //     router.replace("/"); // Redirige vers la page d'accueil
  //   } catch (error) {
  //     console.error("Erreur lors de la déconnexion : ", error);
  //     Alert.alert("Erreur", "Impossible de vous déconnecter.");
  //   }
  // };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/(auth)/signIn");
  };


  // if (!isLoaded || !user) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <Text style={styles.loadingText}>Chargement...</Text>
  //     </View>
  //   );
  // }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Utilisateur non connecté</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bienvenue, {user.name} !</Text>
      <Text style={styles.subtitle}>Ceci est votre tableau de bord utilisateur.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informations du compte</Text>
        <Text style={styles.cardContent}>Email : {user.email}</Text>
        <Text style={styles.cardContent}>Nom complet : {user.name}</Text>
      </View>

      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutButtonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  signOutButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
});

export default Dashboard;
