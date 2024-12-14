import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import imgbg from '@/assets/images/bg.jpg';
const { width, height } = Dimensions.get('window'); // Pour récupérer les dimensions de l'écran

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      
      <ImageBackground
        source={imgbg} 
        style={styles.imageSection}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.brandTitle}>ChicShop</Text>
          <Text style={styles.subtitle}>The Ultimate Marketplace</Text>
        </View>
      </ImageBackground>

      
      <View style={styles.whiteSection}>
        <Text style={styles.heading}>Your Appearance Shows Your Quality</Text>
        <Text style={styles.description}>
          Discover and shop quality products tailored to your style.
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign Up with Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  imageSection: {
    width: width,
    height: height * 0.6, // Prend 60% de l'écran
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.3)', // Légère opacité
    paddingVertical: 210,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '300',
  },
  whiteSection: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 40, // Coins arrondis pour un effet de transition
    borderTopRightRadius: 40,
    marginTop: -40, // Superposition douce
    paddingHorizontal: 20,
    elevation: 5,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width:350,
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:'center',
  },
});

export default WelcomeScreen;
