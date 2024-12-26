import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
  FlatList,
  Alert,
} from "react-native";
import { useUser } from "@clerk/clerk-react";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getMyProduct,
  getProductSearchNameUser,
  getProductByCategoryUser,
  getCategory,
  deleteProduct,
} from "../../Services/api";

const MyProducts = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  const fetchProducts = async () => {
    try {
      const data = await getMyProduct(user?.id);
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleSearch = async (query) => {
    try {
      const productSearch = await getProductSearchNameUser(query, user?.id);
      setProducts(productSearch);
    } catch (error) {
      console.error("Erreur lors de la recherche des produits", error);
    }
  };

  const handleSearchByCategory = async (id) => {
    try {
      const productSearch = await getProductByCategoryUser(id, user?.id);
      setProducts(productSearch);
    } catch (error) {
      console.error("Erreur lors de la recherche des produits", error);
    }
  };

  const handleEditProduct = async (productId) => {
    try {
      const existingProductId = await AsyncStorage.getItem("productId");
      if (existingProductId !== null) {
        console.log("Ancien productId trouvé, suppression de l'ancien.");
        await AsyncStorage.removeItem("productId");
      }
      await AsyncStorage.setItem("productId", productId);
      router.push("/Product_Info/EditProduct");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du productId:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await deleteProduct(productId);
      if (response.ok) {
        Alert.alert("Succès", "Produit supprimé avec succès.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du productId:", error);
    }
  };

  const handleViewProduct = (productId) => {
    router.push(`/Product_Info/DetailProduct?productId=${productId}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.photo }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.categoryId.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>Prix: {item.price} DH</Text>
      </View>

      <View style={styles.actionsContainer}>
        {/* <TouchableOpacity onPress={() => handleViewProduct(item._id)}>
          <Image
            source={require("../../assets/images/view.png")}
            style={styles.actionIcon}
          />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => handleEditProduct(item._id)}>
          <Image
            source={require("../../assets/images/edit.png")}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(item._id)}>
          <Image
            source={require("../../assets/images/delete.png")}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.mainContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => handleSearch(searchQuery)}
          >
            <Image
              source={require("../../assets/images/search.png")}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => handleSearchByCategory(item._id)}
            >
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.productList}>
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={styles.containerProductList}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    elevation: 4,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
    paddingVertical: 12,
  },
  searchButton: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#3498DB",
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: "#3498DB",
    paddingHorizontal: 20,
    height: 40,
    justifyContent: "center",
    borderRadius: 20,
    marginHorizontal: 5,
    elevation: 2,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  productList: {
    marginTop: 20,
  },
  containerProductList: {
    padding: 8,
  },
  productContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    padding: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2C3E50",
  },
  productCategory: {
    color: "#888",
    marginBottom: 5,
  },
  productDescription: {
    color: "#666",
    marginBottom: 5,
  },
  productPrice: {
    fontWeight: "bold",
    color: "#3498DB",
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginLeft: 15,
    tintColor: "#3498DB",
  },
});

export default MyProducts;


