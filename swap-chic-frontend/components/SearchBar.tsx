import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React from "react";

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Product"
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={() => handleSearch(searchQuery)}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => handleSearch(searchQuery)}
      >
        <Image
          source={require("../assets/images/search.png")}
          style={styles.searchIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 4,
    marginBottom: 10,
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  searchInput: {
    borderRadius: 8,
    paddingHorizontal: 16,
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
    paddingVertical: 12,
  },
  searchButton: {
    marginLeft: 8,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#3498db",
  },
});
