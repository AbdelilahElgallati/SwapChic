import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useUser, useAuth } from "@clerk/clerk-react";
import { useRouter, useFocusEffect } from "expo-router";
import {
  getProduct,
  getProductSearchName,
  getCategory,
  getProductByCategory,
} from "../../Services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";
import { useNavigation } from "@react-navigation/native";

const Dashboard = () => {
  const router = useRouter();
  const { user } = useUser();
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handeleSignOut = async () => {
    try {
      await signOut();
      // navigation.navigate('index')
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProduct();
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

  const handleLike = (productId) => {
    setLikedProducts((prevLikedProducts) =>
      prevLikedProducts.includes(productId)
        ? prevLikedProducts.filter((id) => id !== productId)
        : [...prevLikedProducts, productId]
    );
  };

  const handleSearchByCategory = async (id) => {
    try {
      const productSearch = await getProductByCategory(id);
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
      const productSearch = await getProductSearchName(searchQuery);
      setProducts(productSearch);
    } catch (error) {
      console.error("Erreur lors de la recherche des produits", error);
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <TouchableOpacity onPress={() => goToProductDetail(item._id)} >
        <Image source={{ uri: item.photo }} style={styles.productImage} />
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleLike(item._id)}
        style={styles.likeButton}
      >
        <FontAwesome
          name={likedProducts.includes(item._id) ? "heart" : "heart-o"}
          size={16}
          color={likedProducts.includes(item._id) ? "#fff" : "gray"}
        />
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
         <Text style={styles.brandTitle}>
                    <Text style={styles.letter}>Swap</Text>Chic
                  </Text>
        <View style={styles.userInfo}>
            <TouchableOpacity style={{ marginRight: 20,borderRadius: 20, padding: 8, backgroundColor: "#F5F5F5F5" }}>
              <MaterialIcons name="notifications-none" size={22} color="black" />
            </TouchableOpacity>
          <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
        </View>
      </View>

      <View style={styles.searchBar}>
      <TouchableOpacity onPress={() => handleSearch(searchQuery)} style={styles.searchButton}>
      <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="SearchProduct"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
      </View>
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
   //backgroundColor: "#fff",
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    // color: "#333",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#000",
    // marginLeft: -10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
    tintColor: "#fff",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchBar: {
    height: 50,
    
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    //  color: "#FAFAFAFA",
    backgroundColor: "#FAFAFAFA",
    // elevation: 4,
    marginBottom: 10,
    borderRadius: 40,
    paddingHorizontal: 15,
  },
  searchInput: {
    borderRadius: 8,
    paddingHorizontal: 16,
    flex: 1,
    fontSize: 15,
    // color: "red",
    justifyContent:"center",
    marginLeft:-10,
    marginBottom:-4,
    paddingVertical: 12,
  },
  searchButton: {
    marginLeft: 4,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "red",
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
    backgroundColor: "#FAFAFAFA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    height: 40,
    color:"balck",
    justifyContent: "center",
    fontWeight:"bold",

  },
  categoryText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "ultralight",
  },
  contentContainer: {
    padding: 10,
    // backgroundColor: "#FAFAFAFA",
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
    overflow: "hidden",
    alignItems: "center",
    width: 300,
    height: 300,
  },
  productImage: {
    width: 190,
    height: 210,
    resizeMode: "cover",
    borderBottomLeftRadius: 30, // Bord inférieur gauche arrondi
    borderBottomRightRadius: 30, // Bord inférieur droit arrondi
    // overflow: "hidden", // Important pour appliquer le borderRadius sur l'image
  },
  
  productInfo: {
    padding: 8,
    alignItems: "center",
    marginTop: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#4FBF26",
    marginTop: 4,
  },
  likeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 6,
  },
  row: {
    justifyContent: "space-between",
  },
  letter: {
    color: "#fff",

    fontWeight: "bold",
    fontSize:35,
    textShadowColor: "#da051d",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  brandTitle: {
    fontSize: 30,
    
  fontWeight: "bold",
  fontStyle: "normal",
  
    color: "#da051d",
     marginLeft: -15,
    marginTop:-10,
    padding:5,
    width:"70%",
    // backgroundColor:"#000",
    //  marginBottom: -10,
    textShadowColor: "gray",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});

export default Dashboard;
