import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = () => {
    if (email === 'test@example.com' && password === 'password123') {
      Alert.alert('Connexion réussie', 'Bienvenue !');
      router.push('/'); // Naviguer vers la page "Home"
    } else {
      Alert.alert('Erreur', 'Identifiants incorrects.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Adresse e-mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Pas encore inscrit ?{' '}
        <Text style={styles.link} onPress={() => router.push('/sign-up')}>
          Créer un compte
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  link: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
});

export default SignIn;
