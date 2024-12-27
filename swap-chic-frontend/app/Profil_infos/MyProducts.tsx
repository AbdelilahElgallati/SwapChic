import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useRouter, useFocusEffect } from "expo-router";
// import CategoryScroll from "../../components/CategoryScroll";
import { getMyProduct, getOneCategory } from "../../Services/api";
import ProductCard from "../../components/ProductCardDetail";

const MyProducts = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [categoryNames, setCategoryNames] = useState({});
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // const fetchProducts = async () => {
  //   try {
  //     console.log(user?.id);
  //     const data = await getMyProduct(user?.id);
  //     setProducts(data);
  //     console.log(products);
  //   } catch (error) {
  //     console.error("Erreur lors de la récupération des porduit", error);
  //   }
  // };

  const fetchProducts = async () => {
    try {
      console.log("Fetching products for user:", user?.id);
      const data = await getMyProduct(user?.id);
      console.log("Products fetched:", data); // Vérifiez les propriétés des produits ici
      // setProducts(data);
      setProducts(data.map(product => ({
        ...product,
        id: product.id || product._id, // Normalisez les identifiants
      })));
    } catch (error) {
      console.error("Erreur lors de la récupération des produits", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // Gestion du rafraîchissement (Pull-to-Refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // router.replace("/");
      router.push("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const names = {};
      if (products) {
        for (let product of products) {
          try {
            const category = await getOneCategory(product.categoryId);
            names[product.id] = category.name;
          } catch (error) {
            console.error(
              `Error fetching category for product ${product.id}:`,
              error
            );
          }
        }
        setCategoryNames(names);
      }
    };

    if (products.length > 0) {
      fetchCategories();
    }
  }, [products]);

  // const handleSearch = (query) => {
  //   Alert.alert("Recherche", `Vous avez recherché : ${query}`);
  // };

  // const navigateToProductDetails = (product) => {
  //   console.log(product.name);
  //   // router.push(`/product/${product._id}`);
  // };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.mainContainer}>
        <Text>Mes produits</Text>

        <View style={styles.productList}>
          {/* {products &&
            products.map((product) => (
              // <ProductCard
              //   key={product._id}
              //   product={product}
              //   categoryName={categoryNames[product.id] || "Loading..."}
              //   onModify={() => console.log(`Modify ${product.id}`)}
              //   onDelete={() => console.log(`Delete ${product.id}`)}
              //   onPress={() => console.log(`Pressed ${product.id}`)}
              // />

              <TouchableOpacity
                style={styles.card}
                onPress={() => console.log(`Pressed ${product.id}`)}
                onDelete={() => console.log(`Delete ${product.id}`)}
                onModify={() => console.log(`Modify ${product.id}`)}
              >
                <Image source={{ uri: product.photo }} style={styles.image} />
                <View style={styles.details}>
                  <Text style={styles.name}>{product.name}</Text>
                  <Text style={styles.category}>
                    Category: {categoryNames[product.id]}
                  </Text>
                  <Text style={styles.condition}>
                    Condition: {product.condition || "N/A"}
                  </Text>
                  <Text style={styles.price}>{product.price} €</Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {product.description}
                  </Text>
                  <Text style={styles.status}>Status: {product.status}</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.modifyButton]}
                      onPress={() => onModify(product)}
                    >
                      <Text style={styles.buttonText}>Modify</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.deleteButton]}
                      onPress={() => onDelete(product)}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))} */}

          {products &&
            products.map((product) => {
              console.log(product); // Inspectez ici pour vérifier les propriétés disponibles
              return (
                <TouchableOpacity
                  style={styles.card}
                  key={product.id || product._id} // Utilisez un identifiant unique
                  onPress={() =>
                    console.log(`Pressed ${product.id || product._id}`)
                  }
                >
                  {product.photo && (
                    <Image
                      source={{ uri: product.photo }}
                      style={styles.image}
                    />
                  )}
                  <View style={styles.details}>
                    <Text style={styles.name}>
                      {product.name || "Unnamed Product"}
                    </Text>
                    <Text style={styles.category}>
                      Category: {categoryNames[product.id] || "Loading..."}
                    </Text>
                    <Text style={styles.condition}>
                      Condition: {product.condition || "N/A"}
                    </Text>
                    <Text style={styles.price}>{product.price || 0} €</Text>
                    <Text style={styles.description} numberOfLines={2}>
                      {product.description || "No description available"}
                    </Text>
                    <Text style={styles.status}>
                      Status: {product.status || "Unavailable"}
                    </Text>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[styles.button, styles.modifyButton]}
                        onPress={() =>
                          console.log(`Modify ${product.id || product._id}`)
                        }
                      >
                        <Text style={styles.buttonText}>Modify</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={() =>
                          console.log(`Delete ${product.id || product._id}`)
                        }
                      >
                        <Text style={styles.buttonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
    </ScrollView>
  );
};

export default MyProducts;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
    paddingVertical: 10,
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
  productList: {
    marginTop: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 3,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  details: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 5,
  },
  condition: {
    fontSize: 14,
    color: "#34495E",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#27AE60",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: product.status === "Sold" ? "#E74C3C" : "#3498DB",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  modifyButton: {
    backgroundColor: "#3498DB",
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});


