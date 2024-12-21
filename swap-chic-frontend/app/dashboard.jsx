import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-react'; // Pour récupérer les informations sur l'utilisateur connecté
import { useNavigation } from '@react-navigation/native'; // Si vous utilisez React Navigation

const Dashboard = () => {
  const { user, isLoaded } = useUser(); // Récupère l'utilisateur connecté via Clerk
  const navigation = useNavigation(); // Utilisation de la navigation

  const handleSignOut = () => {
    // Déconnexion de l'utilisateur
    user.signOut();
    Alert.alert("You have been signed out!");
    navigation.replace("/"); // Redirige vers la page d'accueil
  };

  if (!isLoaded) {
    return <Text>Loading...</Text>; // Afficher un écran de chargement tant que l'utilisateur n'est pas récupéré
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, {user.firstName}!</Text>
      <Text style={styles.subtitle}>This is your user dashboard.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Info</Text>
        <Text style={styles.cardContent}>Email: {user.email}</Text>
        <Text style={styles.cardContent}>Full Name: {user.fullName}</Text>
      </View>

      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  signOutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Dashboard;
