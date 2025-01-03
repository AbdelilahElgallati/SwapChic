import React, { useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import img from "@/assets/images/chic.png";
import bg from "@/assets/images/bg.jpg";

interface Product {
  id: number;
  name: string;
  price: number;
  image: any; 
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([
    { id: 1, name: "Montre élégante", price: 199.99, image: img },
    { id: 2, name: "Sac à main en cuir", price: 149.99, image: bg },
    { id: 3, name: "Chaussures de sport", price: 89.99, image: img },
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((product) => product.id !== id));
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>Vous n'avez pas encore de produits favoris.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price.toFixed(2)} DHs</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFavorite(item.id)}
              >
                <Feather name="trash-2" size={16} color="#fff" />
                <Text style={styles.removeButtonText}>Retirer des favoris</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  card: {
    marginTop: 16,
    borderWidth:1.2,
    borderColor: "#000",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  }
,  
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#da051d",
    padding: 10,
    borderRadius: 8,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
});
