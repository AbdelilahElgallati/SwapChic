import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { getCategory } from "../Services/api";

const CategoryScroll = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory();
        setCategories(data);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement des catégories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Chargement...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity key={category._id} style={styles.categoryButton}>
          <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 10,
  },
  categoryButton: {
    backgroundColor: "#2C3E50", // Match Dashboard primary text color
    paddingHorizontal: 15,
    height: 40, // Fixed height for buttons
    justifyContent: "center", // Center text vertically
    borderRadius: 20,
    marginHorizontal: 5,
    elevation: 2, // To match the style of the Dashboard buttons
  },
  categoryText: {
    color: "#FFFFFF", // Keep text white for contrast
    fontSize: 16,
    fontWeight: "500",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 10,
    color: "#888",
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 10,
    color: "#E74C3C",
  },
});

export default CategoryScroll;
