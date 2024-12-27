import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useRouter, useFocusEffect } from "expo-router";
import {
  getMyProduct,
  getProductSearchNameUser,
  getProductByCategoryUser,
  getCategory,
  deleteProduct,
} from "../../Services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchBar from "@/components/SearchBar";
import { MaterialIcons } from "@expo/vector-icons";

const MyProducts = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false); 

  const fetchProducts = async () => {
    try {
      const data = await getMyProduct(user?.id);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategory();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
      fetchCategories();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    await fetchCategories();
    setRefreshing(false);
  };

  const handleSearchByCategory = async (id) => {
    try {
      const productSearch = await getProductByCategoryUser(id, user?.id);
      setProducts(productSearch);
    } catch (error) {
      console.error("Erreur lors de la recherche des produits", error);
    }
  };

  const goToProductDetail = async (productId) => {
    try {
      await AsyncStorage.setItem("productId", productId);
      router.push(`/Product_Info/DetailProduct`);
    } catch (error) {
      console.error("Error navigating to product detail", error);
    }
  };

  const handleSearch = async (searchQuery: String) => {
    try {
      const productSearch = await getProductSearchNameUser(searchQuery, user?.id);
      setProducts(productSearch);
    } catch (error) {
      console.error("Erreur lors de la recherche des produits", error);
    }
  };

  const handleEditProduct = async (productId) => {
    try {
      const existingProductId = await AsyncStorage.getItem("productId");
      if (existingProductId !== null) {
        await AsyncStorage.removeItem("productId");
      }
      await AsyncStorage.setItem("productId", productId);
      router.push("/Product_Info/EditProduct");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du productId:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    setIsDeleting(true);  
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer ce produit ?",
      [
        { text: "Annuler", style: "cancel", onPress: () => setIsDeleting(false) },  
        { 
          text: "Supprimer", 
          onPress: async () => { 
            try {
              const response = await deleteProduct(id);
              if (response.ok) {
                Alert.alert("Succès", "Produit supprimé avec succès.");
                await onRefresh(); 
              }
            } catch (error) {
              console.error("Erreur lors de la suppression du produit:", error);
            } finally {
              setIsDeleting(false);  
            }
          }
        },
      ]
    );
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <TouchableOpacity onPress={() => goToProductDetail(item._id)}>
        <Image source={{ uri: item.photo }} style={styles.productImage} />
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      
      {/* Conteneur pour les icônes de modification et de suppression */}
      <View style={styles.iconContainer}>
        {/* Edit Icon */}
        <TouchableOpacity onPress={() => handleEditProduct(item._id)} style={styles.iconButton}>
          <MaterialIcons name="edit" size={24} color="black" />
        </TouchableOpacity>
        
        {/* Delete Icon */}
        <TouchableOpacity onPress={() => handleDeleteProduct(item._id)} style={styles.iconButton}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category._id}
              style={styles.categoryButton}
              onPress={() => handleSearchByCategory(category._id)}
            >
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  horizontalScroll: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  categoriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  contentContainer: {
    padding: 16,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 4,
    overflow: "hidden",
    alignItems: "center",
    width: 200,
    marginBottom: 16,
    position: "relative",
  },
  productImage: {
    width: 200,
    height: 180,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 8,
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  iconButton: {
    padding: 5,
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
});

export default MyProducts;