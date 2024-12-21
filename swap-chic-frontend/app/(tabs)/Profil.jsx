import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';

export default function Profil() {
  const { user } = useUser();
  
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: user?.imageUrl }} 
          style={styles.image}
        />
        <Text style={styles.userName}>{user?.fullName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50, // Pour rendre l'image ronde
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
