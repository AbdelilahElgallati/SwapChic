// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
// import imgbg from '@/assets/images/bg.jpg';
// import { Link } from 'expo-router';
// const { width, height } = Dimensions.get('window'); 

// const WelcomeScreen = () => {
//   return (
//     <View style={styles.container}>
      
//       <ImageBackground
//         source={imgbg} 
//         style={styles.imageSection}
//         resizeMode="cover"
//       >
//         <View style={styles.overlay}>
//           <Text style={styles.brandTitle}><Text style={styles.letter}>Swap</Text><Text style={styles.brandTitle}>Chic</Text></Text>
//           <Text style={styles.subtitle}>The Ultimate Marketplace</Text>
//         </View>
//       </ImageBackground>

      
//       <View style={styles.whiteSection}>
//         <Text style={styles.heading}>Your Appearance Shows Your Quality</Text>
//         <Text style={styles.description}>
//           Discover and shop quality products tailored to your style.
//         </Text>
//         <TouchableOpacity style={styles.button}>
//           <Link style={styles.buttonText} href="/(auth)/signUp">Sign Up</Link>
//           {/* <Text ></Text> */}
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button}>
//            <Link style={styles.buttonText} href="/(auth)/signIn">Sign In</Link>
//           {/* <Text style={styles.buttonText}>Sign In</Text> */}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: '#fff',
//   },
//   imageSection: {
//     width: width,
//     height: height * 0.6, // Prend 60% de l'écran
//     justifyContent: 'flex-end',
//   },
//   overlay: {
//     backgroundColor: 'rgba(0,0,0,0.3)', // Légère opacité
//     paddingVertical: 210,
//     alignItems: 'center',
//   },
//   brandTitle: {
//     fontSize: 45,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 5,
//     textShadowColor: '#1466b8', 
//     textShadowOffset: { width: 2, height: 3 }, 
//     textShadowRadius: 5, 
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: '300',
//     textShadowColor: '#000', 
//     textShadowOffset: { width: 2, height: 3 }, 
//     textShadowRadius: 5, 
//   },
//   whiteSection: {
//     flex: 1,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderTopLeftRadius: 40,
//     borderTopRightRadius: 40,
//     marginTop: -40, 
//     paddingHorizontal: 20,
//     elevation: 5,  
//   },
  
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   button: {
//     width:350,
//     marginTop:10,
//     backgroundColor: '#000',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign:'center',
//   },
//   letter:{
//     color:'#1466b8',
//     fontWeight:'bold',
//     fontSize:50,
//     textShadowColor: '#fff',  // Couleur de l'ombre (bordure)
//     textShadowOffset: { width: 2, height: 3 }, // Décalage de l'ombre (bordure)
//     textShadowRadius: 5, // Taille de l'ombre (bordure)
    
//   },
// });

// export default WelcomeScreen;


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import imgbg from '@/assets/images/bg.jpg';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={imgbg}
        style={styles.imageSection}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.brandTitle}>
            <Text style={styles.letter}>Swap</Text>
            <Text>Chic</Text>
          </Text>
          <Text style={styles.subtitle}>The Ultimate Marketplace</Text>
        </View>
      </ImageBackground>

      <View style={styles.whiteSection}>
        <Text style={styles.heading}>Your Appearance Shows Your Quality</Text>
        <Text style={styles.description}>
          Discover and shop quality products tailored to your style.
        </Text>
        <TouchableOpacity style={styles.button}>
          <Link style={styles.buttonText} href="/(auth)/signUp">Sign Up</Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Link style={styles.buttonText} href="/(auth)/signIn">Sign In</Link>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageSection: { width, height: height * 0.6 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  brandTitle: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  letter: { color: '#f39c12' },
  subtitle: { fontSize: 16, color: '#fff', marginTop: 10 },
  whiteSection: { flex: 1, backgroundColor: '#fff', padding: 20 },
  heading: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  description: { textAlign: 'center', marginVertical: 10 },
  button: {
    backgroundColor: '#f39c12',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default WelcomeScreen;
