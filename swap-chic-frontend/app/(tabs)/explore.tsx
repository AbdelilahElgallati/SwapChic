// import React, { useState, useEffect, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   Image,
//   TextInput,
//   ScrollView,
//   RefreshControl,
//   FlatList,
// } from "react-native";
// import { useUser, useAuth } from "@clerk/clerk-react";
// import { useRouter, useFocusEffect } from "expo-router";
// import CategoryScroll from "../../components/CategoryScroll";
// import {
//   getProduct,
//   getProductSearchName,
//   getProductByCategory,
//   getCategory,
// } from "../../Services/api";
// import ProductCard from "../../components/productCard";

// const explore = () => {
//   const router = useRouter();
//   const { user } = useUser();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [products, setProducts] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const data = await getCategory();
//         setCategories(data);
//       } catch (err) {
//         setError(err.message || "Erreur lors du chargement des catégories.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const data = await getProduct();
//       setProducts(data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des produit", error);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchProducts();
//     }, [])
//   );

//   // Gestion du rafraîchissement (Pull-to-Refresh)
//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchProducts();
//     setRefreshing(false);
//   };

//   const handleSearch = async (query) => {
//     try {
//       const productSearch = await getProductSearchName(query);
//       setProducts(productSearch);
//     } catch (error) {
//       console.error("Erreur lors de la recherche des produits", error);
//     }
//   };

//   const handleSearchByCategory = async (id) => {
//     try {
//       const productSearch = await getProductByCategory(id);
//       setProducts(productSearch);
//     } catch (error) {
//       console.error("Erreur lors de la recherche des produits", error);
//     }
//   };

//   const navigateToProductDetails = (product) => {
//     console.log(product.name);
//     // router.push(`/product/${product._id}`);
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.productContainer}>
//       <Image source={{ uri: item.photo }} style={styles.productImage} />
//       <View style={styles.productDetails}>
//         <Text style={styles.productName}>{item.name}</Text>
//         <Text style={styles.productCategory}>{item.categoryId.name}</Text>
//         <Text style={styles.productCondition}>Condition: {item.condition}</Text>
//         <Text style={styles.productDescription}>{item.description}</Text>
//         <Text style={styles.productPrice}>Prix: {item.price} DH</Text>
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView
//       contentContainerStyle={styles.scrollContainer}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       <View style={styles.mainContainer}>
//         <View style={styles.searchBarContainer}>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Rechercher..."
//             placeholderTextColor="#888"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             onSubmitEditing={() => handleSearch(searchQuery)}
//           />
//           <TouchableOpacity
//             style={styles.searchButton}
//             onPress={() => handleSearch(searchQuery)}
//           >
//             <Image
//               source={require("../../assets/images/search.png")}
//               style={styles.searchIcon}
//             />
//           </TouchableOpacity>
//         </View>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.scrollContainer}
//         >
//           {categories.map((category) => (
//             <TouchableOpacity
//               key={category._id}
//               style={styles.categoryButton}
//               onPress={() => handleSearchByCategory(category._id)}
//             >
//               <Text style={styles.categoryText}>{category.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         <View style={styles.productList}>
//           {/* {products &&
//             products.map((product) => (
//               <ProductCard
//                 key={product._id}
//                 product={product}
//                 onPress={navigateToProductDetails}
//               />
//             ))} */}
//           <FlatList
//             data={products}
//             renderItem={renderItem}
//             keyExtractor={(item) => item._id.toString()}
//             contentContainerStyle={styles.containerProductList}
//           />
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   mainContainer: {
//     flex: 1,
//     backgroundColor: "#F5F7FA",
//     padding: 20,
//   },
//   headerContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   userName: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#2C3E50",
//   },
//   logoutButton: {
//     backgroundColor: "#E74C3C",
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   logoutButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   searchBarContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     elevation: 2,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: "#2C3E50",
//     paddingVertical: 10,
//   },
//   searchButton: {
//     padding: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   searchIcon: {
//     width: 20,
//     height: 20,
//     tintColor: "#3498DB",
//   },
//   productList: {
//     marginTop: 20,
//   },
//   // scrollContainer: {
//   //   paddingVertical: 10,
//   // },
//   categoryButton: {
//     backgroundColor: "#2C3E50", 
//     paddingHorizontal: 15,
//     height: 40, 
//     justifyContent: "center", // Center text vertically
//     borderRadius: 20,
//     marginHorizontal: 5,
//     elevation: 2, 
//   },
//   categoryText: {
//     color: "#FFFFFF", // Keep text white for contrast
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   loadingText: {
//     textAlign: "center",
//     fontSize: 16,
//     marginVertical: 10,
//     color: "#888",
//   },
//   errorText: {
//     textAlign: "center",
//     fontSize: 16,
//     marginVertical: 10,
//     color: "#E74C3C",
//   },

//   containerProductList: {
//     padding: 16,
//   },
//   productContainer: {
//     flexDirection: "row",
//     marginBottom: 20,
//   },
//   productImage: {
//     width: 100,
//     height: 100,
//     marginRight: 16,
//     borderRadius: 8,
//   },
//   productDetails: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   productCategory: {
//     color: "#888",
//     marginBottom: 5,
//   },
//   productCondition: {
//     color: "#888",
//     marginBottom: 5,
//   },
//   productDescription: {
//     color: "#666",
//     marginBottom: 5,
//   },
//   productPrice: {
//     fontWeight: "bold",
//   },
// });

// export default explore;


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
} from "react-native";
import { useUser } from "@clerk/clerk-react";
import { useFocusEffect } from "expo-router";
import CategoryScroll from "../../components/CategoryScroll";
import {
  getProduct,
  getProductSearchName,
  getProductByCategory,
  getCategory,
} from "../../Services/api";
import ProductCard from "../../components/productCard";

const Explore = () => {
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
      const data = await getProduct();
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produit", error);
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
      const productSearch = await getProductSearchName(query);
      setProducts(productSearch);
    } catch (error) {
      console.error("Erreur lors de la recherche des produits", error);
    }
  };

  const handleSearchByCategory = async (id) => {
    try {
      const productSearch = await getProductByCategory(id);
      setProducts(productSearch);
    } catch (error) {
      console.error("Erreur lors de la recherche des produits", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.photo }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.categoryId.name}</Text>
        {/* <Text style={styles.productCondition}>Condition: {item.condition}</Text> */}
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>Prix: {item.price} DH</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
          <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch(searchQuery)}>
            <Image source={require("../../assets/images/search.png")} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category._id}
              style={styles.categoryButton}
              onPress={() => handleSearchByCategory(category._id)}
            >
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
    backgroundColor: "#F0F0F0", // fallback for missing images
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
  productCondition: {
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
});

export default Explore;
