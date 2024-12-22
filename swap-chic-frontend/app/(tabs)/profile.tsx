import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useNavigation, useNavigationContainerRef } from '@react-navigation/native';
import { useRouter } from "expo-router";


export default function Profil() {
  const router = useRouter();
  const { user } = useUser();
  const navigation = useNavigation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/signIn");
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: user?.imageUrl }} 
          style={styles.image}
        />
        <Text style={styles.userName}>{user?.fullName}</Text>
      </View>
      <View style={styles.emailContainer}>
        <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>
      <View style={styles.boxContainer}>
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.boxIcon}>✏️</Text>
          <Text style={styles.boxText}>Modifier mon profil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Panier')}>
          <Text style={styles.boxIcon}>🛒</Text>
          <Text style={styles.boxText}>Mon panier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('MyProducts')}>
          <Text style={styles.boxIcon}>📤</Text>
          <Text style={styles.boxText}>Mes produits partagés</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Connections')}>
          <Text style={styles.boxIcon}>🔗</Text>
          <Text style={styles.boxText}>Mes connections</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={handleLogout}>
          <Text style={styles.boxIcon}>🚪</Text>
          <Text style={styles.boxText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    marginTop: 50,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  emailContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  email: {
    fontSize: 16,
    color: '#888',
  },
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    width: '48%',
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  boxIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  boxText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});



  