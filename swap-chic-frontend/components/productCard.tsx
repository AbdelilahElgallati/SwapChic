import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const ProductCard = ({ product, onPress }) => {
  if (!product || !product.name) {
    console.error("Produit invalide:", product);
    return null; // Ne rien afficher si le produit est invalide
  }

  const defaultImage = "https://via.placeholder.com/150"; // URL de l'image par défaut

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.photo || defaultImage }}
          style={styles.image}
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
        <Text style={styles.condition}>État: {product.condition || "Inconnu"}</Text>
        <Text style={styles.category}>
          Catégorie: {product.categoryId?.name || "Inconnue"}
        </Text>
        <Text style={styles.price}>{product.price} DH</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 3,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 10,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F5F5F5", // Couleur de fond pour les images manquantes
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 10,
  },
  condition: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#34495E",
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E44AD",
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498DB",
    marginTop: 10,
  },
});

export default ProductCard;
