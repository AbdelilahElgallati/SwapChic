// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
// import { Link } from 'expo-router';
// import imgbg from '@/assets/images/bg.jpg';

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
//           <Text style={styles.brandTitle}>
//             <Text style={styles.letter}>Swap</Text>
//             <Text>Chic</Text>
//           </Text>
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
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button}>
//           <Link style={styles.buttonText} href="/(auth)/signIn">Sign In</Link>
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
//     height: height * 0.6, 
//     justifyContent: 'flex-end',
//   },
//   overlay: {
//     backgroundColor: 'rgba(0,0,0,0.3)', 
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
//     textShadowColor: '#fff',  
//     textShadowOffset: { width: 2, height: 3 }, 
//     textShadowRadius: 5, 
    
//   },
// });

// export default WelcomeScreen;


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Pressable } from 'react-native';
import { Link } from 'expo-router';
import imgbg from '@/assets/images/bg.jpg';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground source={imgbg} style={styles.imageSection} resizeMode="cover">
        <View style={styles.overlay}>
          <Text style={styles.brandTitle}>
            <Text style={styles.letter}>Swap</Text>Chic
          </Text>
          <Text style={styles.subtitle}>Your Style. Your Marketplace.</Text>
        </View>
      </ImageBackground>

      <View style={styles.whiteSection}>
        <Text style={styles.heading}>Express Yourself Through Style</Text>
        <Text style={styles.description}>
          Shop, discover, and create your perfect look with high-quality products tailored to your taste.
        </Text>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Link style={styles.buttonText} href="/(auth)/signUp">Sign Up</Link>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.button, styles.secondaryButton, pressed && styles.buttonPressed]}>
          <Link style={styles.secondaryButtonText} href="/(auth)/signIn">Sign In</Link>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  imageSection: {
    width,
    height: height * 0.6,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 150,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 6,
  },
  letter: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 56,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
  },
  whiteSection: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -30,
    paddingHorizontal: 20,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    width: 350,
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  secondaryButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
