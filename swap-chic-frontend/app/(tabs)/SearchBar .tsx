import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery); // Appeler la fonction de recherche passée en prop
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher..."
        placeholderTextColor="#888" // Couleur claire pour le texte de l'espace vide
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Image
          source={require('../../assets/images/search.png')} 
          style={styles.searchIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF', // Fond blanc
    borderRadius: 25, // Bordure arrondie pour un look moderne
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Ombre pour un effet de profondeur (Android)
    marginHorizontal: 20,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingLeft: 15,
    backgroundColor: '#f5f5f5', // Fond gris clair pour le champ de recherche
    borderRadius: 25,
    color: '#333', // Texte sombre
  },
  searchButton: {
    padding: 8,
    marginLeft: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
});

export default SearchBar;
