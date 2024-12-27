// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { useUser } from '@clerk/clerk-react'; // Assurez-vous que vous utilisez Clerk pour l'authentification

// const HeaderBar = ({ onLogout }) => {
//   const { user } = useUser(); // Récupérer l'utilisateur connecté depuis Clerk

//   return (
//     <View style={styles.headerContainer}>
//       <Text style={styles.userName}>{user?.firstName || "Utilisateur"}</Text>
      
//       <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
//         <Text style={styles.logoutButtonText}>Déconnexion</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#6200EE',
//   },
//   userName: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   logoutButton: {
//     backgroundColor: '#FF3B30',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   logoutButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default HeaderBar;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser } from '@clerk/clerk-react'; // Assurez-vous que vous utilisez Clerk pour l'authentification

const HeaderBar = ({ onLogout }) => {
  const { user } = useUser(); // Récupérer l'utilisateur connecté depuis Clerk

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.userName}>Welcome, {user?.firstName || "Utilisateur"}</Text>
      
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF', // Fond blanc
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Légère bordure grise pour séparer le header du contenu
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Pour les appareils Android
  },
  userName: {
    color: '#333', // Couleur plus sombre pour le texte
    fontSize: 18,
    fontWeight: '500', // Moins gras pour une apparence plus élégante
  },
  logoutButton: {
    backgroundColor: '#007BFF', // Bleu professionnel pour le bouton
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20, // Bord arrondi pour un style plus moderne
    borderWidth: 1,
    borderColor: '#007BFF', // Bordure du même bleu pour une touche uniforme
  },
  logoutButtonText: {
    color: '#FFFFFF', // Texte blanc pour contraster avec le bleu
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HeaderBar;
