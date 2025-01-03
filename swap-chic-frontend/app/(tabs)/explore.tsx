// import React, { useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   ScrollView,
//   FlatList,
//   RefreshControl,
//   ImageBackground,
// } from "react-native";
// import { useUser, useAuth } from "@clerk/clerk-react";
// import { useRouter, useFocusEffect } from "expo-router";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import { getCategoriesWithProductCount, getCategorySearchName } from "../../Services/api";

// const explore = () => {
//   const router = useRouter();
//   const { user } = useUser();
//   const { signOut } = useAuth();
//   const [categories, setCategories] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const fetchCategories = async () => {
//     try {
//       const data = await getCategoriesWithProductCount();
//       setCategories(data);
//     } catch (error) {
//       console.error("Error fetching categories", error);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchCategories();
//     }, [])
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchCategories();
//     setRefreshing(false);
//   };

//   const handleSearchByCategory = async (id) => {
//     try {
//       router.push(`/Product_Info/ProductCategory?idCategory=${id}`);
//     } catch (error) {
//       console.error("Error fetching products by category", error);
//     }
//   };

//   const handleSearch = async (query) => {
//     try {
//       const searchResults = await getCategorySearchName(query);
//       setCategories(searchResults);
//     } catch (error) {
//       console.error("Error searching products by name", error);
//     }
//   };

//   const renderHeader = () => (
//     <View>
//       <View style={styles.header}>
//         <Text style={styles.brandTitle}>Categories</Text>
//         <View style={styles.userInfo}>
//           <TouchableOpacity
//             style={styles.notificationButton}
//           >
//             <MaterialIcons name="notifications-none" size={22} color="black" />
//           </TouchableOpacity>
//           <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
//         </View>
//       </View>
//       <View style={styles.searchBar}>
//         <TouchableOpacity
//           onPress={() => handleSearch(searchQuery)}
//           style={styles.searchButton}
//         >
//           <AntDesign name="search1" size={24} color="black" />
//         </TouchableOpacity>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search Categories"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.horizontalScroll}
//       >
//         <View style={styles.container}>
//           {categories.map((category) => (
//             <TouchableOpacity
//               key={category._id}
//               style={styles.productCard}
//               onPress={() => handleSearchByCategory(category._id)}
//             >
//               <ImageBackground source={{ uri: category.image }} style={styles.productImage}>
//                 <Text style={styles.categoryText}>{category.name}</Text>
//                 <Text style={styles.nb}>{category.productCount} Products</Text>
//               </ImageBackground>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={categories}
//         keyExtractor={(item) => item._id}
//         numColumns={2}
//         columnWrapperStyle={styles.row}
//         ListHeaderComponent={renderHeader}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.contentContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     elevation: 3,
//   },
//   brandTitle: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#da051d",
//     marginLeft: -15,
//     marginTop: -10,
//     padding: 5,
//     width: "70%",
//     textShadowColor: "gray",
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 5,
//   },
//   userInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   notificationButton: {
//     marginRight: 20,
//     borderRadius: 20,
//     padding: 8,
//     backgroundColor: "#F5F5F5",
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   searchBar: {
//     height: 50,
//     marginTop: 30,
//     flexDirection: "row",
//     padding: 5,
//     alignItems: "center",
//     backgroundColor: "#FAFAFAFA",
//     marginBottom: 10,
//     borderRadius: 40,
//     paddingHorizontal: 15,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     marginLeft: -10,
//     marginBottom: -4,
//     paddingVertical: 12,
//   },
//   searchButton: {
//     padding: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   horizontalScroll: {
//     marginTop: 8,
//     paddingHorizontal: 8,
//   },
//   productCard: {
//     flex: 1,
//     margin: 8,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     elevation: 5,
//     overflow: "hidden",
//     width: 350,
//     height: 150,
//   },
//   productImage: {
//     width: 350,
//     height: 210,
//     resizeMode: "cover",
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   categoryText: {
//     fontSize: 22,
//     color: "#fff",
//     fontWeight: "400",
//   },
//   nb: {
//     fontSize: 16,
//     color: "#F5F5F5F5",
//   },
//   contentContainer: {
//     padding: 10,
//   },
//   row: {
//     justifyContent: "space-between",
//   },
// });

// export default explore;

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// import React, { useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   ScrollView,
//   FlatList,
//   RefreshControl,
//   ImageBackground,
//   Keyboard,
//   TouchableWithoutFeedback,
// } from "react-native";
// import { useUser, useAuth } from "@clerk/clerk-react";
// import { useRouter, useFocusEffect } from "expo-router";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import {
//   getCategoriesWithProductCount,
//   getCategorySearchName,
// } from "../../Services/api";

// const explore = () => {
//   const router = useRouter();
//   const { user } = useUser();
//   const { signOut } = useAuth();
//   const [categories, setCategories] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const fetchCategories = async () => {
//     try {
//       const data = await getCategoriesWithProductCount();
//       setCategories(data);
//     } catch (error) {
//       console.error("Error fetching categories", error);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchCategories();
//     }, [])
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchCategories();
//     setRefreshing(false);
//   };

//   const handleSearchByCategory = async (id) => {
//     try {
//       router.push(`/Product_Info/ProductCategory?idCategory=${id}`);
//     } catch (error) {
//       console.error("Error fetching products by category", error);
//     }
//   };

//   const handleSearch = async (query) => {
//     try {
//       const searchResults = await getCategorySearchName(query);
//       setCategories(searchResults);
//     } catch (error) {
//       console.error("Error searching products by name", error);
//     }
//   };

//   const renderHeader = () => (
//     <View>
//       <View style={styles.header}>
//         <Text style={styles.brandTitle}>Categories</Text>
//         <View style={styles.userInfo}>
//           <TouchableOpacity style={styles.notificationButton}>
//             <MaterialIcons name="notifications-none" size={22} color="black" />
//           </TouchableOpacity>
//           <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
//         </View>
//       </View>
//       <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//         <View style={styles.searchBar}>
//           <TouchableOpacity
//             onPress={() => handleSearch(searchQuery)}
//             style={styles.searchButton}
//           >
//             <AntDesign name="search1" size={24} color="black" />
//           </TouchableOpacity>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search Categories"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>
//       </TouchableWithoutFeedback>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.horizontalScroll}
//       >
//         <View style={styles.container}>
//           {categories.map((category) => (
//             <TouchableOpacity
//               key={category._id}
//               style={styles.productCard}
//               onPress={() => handleSearchByCategory(category._id)}
//             >
//               <ImageBackground
//                 source={{ uri: category.image }}
//                 style={styles.productImage}
//               >
//                 <View style={styles.textContainer}>
//                   <Text style={styles.categoryText}>{category.name}</Text>
//                   <Text style={styles.nb}>
//                     {category.productCount} Products
//                   </Text>
//                 </View>
//               </ImageBackground>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={categories}
//         keyExtractor={(item) => item._id}
//         numColumns={2}
//         columnWrapperStyle={styles.row}
//         ListHeaderComponent={renderHeader}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.contentContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // top: 0,
//     flex: 1,
//     backgroundColor: "#fff",
//     marginBottom: 40,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     elevation: 3,
//   },
//   brandTitle: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#da051d",
//     marginLeft: -15,
//     marginTop: -10,
//     padding: 5,
//     width: "70%",
//     textShadowColor: "gray",
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 5,
//   },
//   userInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   notificationButton: {
//     marginRight: 20,
//     borderRadius: 20,
//     padding: 8,
//     backgroundColor: "#F5F5F5",
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   searchBar: {
//     height: 50,
//     marginTop: 20,
//     flexDirection: "row",
//     padding: 5,
//     alignItems: "center",
//     backgroundColor: "#FAFAFAFA",
//     marginBottom: 10,
//     borderRadius: 40,
//     paddingHorizontal: 15,
//     justifyContent: "space-between",
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     marginLeft: -10,
//     marginBottom: -4,
//     paddingVertical: 12,
//   },
//   searchButton: {
//     padding: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   horizontalScroll: {
//     marginTop: 8,
//     paddingHorizontal: 8,
//   },
//   productCard: {
//     flex: 1,
//     margin: 8,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     elevation: 5,
//     overflow: "hidden",
//     width: 350,
//     height: 200,
//   },
//   productImage: {
//     width: 350,
//     height: 210,
//     resizeMode: "cover",
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   textContainer: {
//     position: "absolute",
//     bottom: 10,
//     left: 0,
//     right: 0,
//     padding: 10,
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent pour lisibilité
//     borderRadius: 10,
//   },
//   categoryText: {
//     fontSize: 22,
//     color: "#fff",
//     fontWeight: "400",
//   },
//   nb: {
//     fontSize: 16,
//     color: "#F5F5F5F5",
//   },
//   contentContainer: {
//     padding: 10,
//   },
//   row: {
//     justifyContent: "space-between",
//   },
// });

// export default explore;

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useRouter, useFocusEffect } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  getCategoriesWithProductCount,
  getCategorySearchName,
} from "../../Services/api";

const Explore = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await getCategoriesWithProductCount();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };

  const handleSearchByCategory = async (id) => {
    try {
      router.push(`/Product_Info/ProductCategory?idCategory=${id}`);
    } catch (error) {
      console.error("Error fetching products by category", error);
    }
  };

  const handleSearch = async (query) => {
    try {
      const searchResults = await getCategorySearchName(query);
      setCategories(searchResults);
    } catch (error) {
      console.error("Error searching products by name", error);
    }
  };


  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <View style={styles.header}>
            <Text style={styles.brandTitle}>Categories</Text>
            <View style={styles.userInfo}>
              <TouchableOpacity style={styles.notificationButton}>
                <MaterialIcons
                  name="notifications-none"
                  size={22}
                  color="black"
                />
              </TouchableOpacity>
              <Image
                source={{ uri: user?.imageUrl }}
                style={styles.profileImage}
              />
            </View>
          </View>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.searchBar}>
              <TouchableOpacity
                onPress={() => handleSearch(searchQuery)}
                style={styles.searchButton}
              >
                <AntDesign name="search1" size={24} color="black" />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Search Categories"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </TouchableWithoutFeedback>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            <View style={styles.container}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category._id}
                  style={styles.productCard}
                  onPress={() => handleSearchByCategory(category._id)}
                >
                  <ImageBackground
                    source={{ uri: category.image }}
                    style={styles.productImage}
                  >
                    <View style={styles.textContainer}>
                      <Text style={styles.categoryText}>{category.name}</Text>
                      <Text style={styles.nb}>
                        {category.productCount} Products
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    elevation: 3,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#da051d",
    marginLeft: -15,
    marginTop: -10,
    padding: 5,
    width: "70%",
    textShadowColor: "gray",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    marginRight: 20,
    borderRadius: 20,
    padding: 8,
    backgroundColor: "#F5F5F5",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchBar: {
    height: 50,
    marginTop: 20,
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    backgroundColor: "#FAFAFAFA",
    marginBottom: 10,
    borderRadius: 40,
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    marginLeft: -10,
    marginBottom: -4,
    paddingVertical: 12,
  },
  searchButton: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalScroll: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 5,
    overflow: "hidden",
    width: 350,
    height: 200,
  },
  productImage: {
    width: 350,
    height: 210,
    resizeMode: "cover",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  textContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "400",
  },
  nb: {
    fontSize: 16,
    color: "#F5F5F5F5",
  },
  contentContainer: {
    padding: 10,
  },
  rowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default Explore;
