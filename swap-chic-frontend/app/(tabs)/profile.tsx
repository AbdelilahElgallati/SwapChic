// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   RefreshControl,
// } from "react-native";
// import React, { useState } from "react";
// import bg from "@/assets/images/bgPrf.jpg";
// import { useUser, useAuth } from "@clerk/clerk-expo";
// import { useRouter } from "expo-router";
// import AntDesign from "@expo/vector-icons/AntDesign";
// // import Octicons from "@expo/vector-icons/Octicons";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// // import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
// import Icon from "react-native-vector-icons/MaterialIcons";
// // import FAIcon from 'react-native-vector-icons/FontAwesome';

// export default function Profil() {
//   const router = useRouter();
//   const { user } = useUser();
//   const { signOut } = useAuth();
//   const [refreshing, setRefreshing] = useState(false);

//   const handleLogout = async () => {
//     try {
//       await signOut();
//       router.replace("/index");
//     } catch (error) {
//       console.error("Failed to log out:", error);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     // console.log("ref")
//     setRefreshing(false);
//   };

//   return (
//     <ScrollView
//       style={styles.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//       showsVerticalScrollIndicator={false}
//     >
//       <View style={styles.container}>
//         <View>
//           <Image source={bg} style={styles.C} />

//           <View style={styles.emailContainer}>
//             <Text style={styles.userName}>{user?.fullName}</Text>

//             <Text style={styles.email}>
//               {user?.primaryEmailAddress?.emailAddress}
//             </Text>
//           </View>
//           <View style={styles.imageContainer}>
//             <Image source={{ uri: user?.imageUrl }} style={styles.image} />
//           </View>
//         </View>
//         <View style={styles.boxContainer}>
//           <TouchableOpacity
//             style={styles.box}
//             onPress={() => router.push("/Product_Info/MyProducts")}
//           >
//             <MaterialIcons name="shopping-bag" size={24} color="black" />
//             <Text style={styles.boxText}>My Products</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.box}
//             onPress={() => router.push("/Profil_infos/Favorite")}
//           >
//             <MaterialIcons name="favorite-outline" size={24} color="black" />
//             <Text style={styles.boxText}>Favorite</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.box}
//             onPress={() => router.push("/Profil_infos/DemandeDiscussion")}
//           >
//             <Icon name="forum" size={24} color="black" />
//             <Text style={styles.boxText}>Demande Discussion</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.box}
//             onPress={() => router.push("/Profil_infos/Connection")}
//           >
//             <Icon name="chat" size={24} color="black" />
//             <Text style={styles.boxText}>Discussion</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.box}
//             onPress={() => router.push("/Profil_infos/Transaction")}
//           >
//             <Icon name="swap-horiz" size={24} color="black" />
//             <Text style={styles.boxText}>Transaction</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.box}
//             onPress={() => router.push("/Profil_infos/Achat")}
//           >
//             <Icon name="shopping-cart" size={24} color="black" />
//             <Text style={styles.boxText}>Achat</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.box} onPress={handleLogout}>
//             <AntDesign name="logout" size={24} color="black" />
//             <Text style={styles.boxText}>Log out</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     // marginBottom: 20,
//   },
//   imageContainer: {
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   image: {
//     top: -225,
//     right: 125,
//     width: 130,
//     height: 130,
//     borderRadius: 130,
//     elevation: 15,
//     shadowColor: "black",
//     shadowOffset: { width: 80, height: 80 },
//   },
//   userName: {
//     top: 120,
//     left: 70,
//     fontSize: 24,
//     fontStyle: "italic",
//     // marginBottom: -20,
//     color: "#fff",
//     textShadowColor: "#da051d",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 5,
//   },
//   emailContainer: {
//     alignItems: "center",
//     bottom: 140,
//     // left: 90,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     // marginBottom: 10,
//     height: 200,
//   },
//   email: {
//     fontSize: 16,
//     color: "#F5F5F5F5",
//     // fontWeight: "bold",
//     top: 120,
//     left: 70,
//     textShadowColor: "#000",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 5,
//   },
//   boxContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     padding: 20,
//     top: -230,
//   },
//   box: {
//     width: "100%",
//     padding: 20,
//     marginBottom: 20,
//     // marginTop:10,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     alignItems: "center",
//     elevation: 5,
//     // shadowColor: "#da051d",
//     height: 100,
//     justifyContent: "center",
//   },
//   boxIcon: {
//     fontSize: 24,
//     marginBottom: 10,
//   },
//   boxText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   C: {
//     backgroundColor: "#fff",
//     marginBottom: -60,
//     width: "100%",
//     paddingBottom: 20,
//     height: 200,
//     elevation: 5,
//   },
//   img: {
//     backgroundColor: "rgba(0,0,0,1)",
//     // paddingVertical: 210,
//     alignItems: "center",
//   },
// });

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import bg from "@/assets/images/bgPrf.jpg";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Profil() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/index");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Image source={bg} style={styles.headerImage} />
        <View style={styles.profileSection}>
          <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>
        <View style={styles.boxContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.box} onPress={() => router.push(item.route)}>
              <Icon name={item.icon} size={24} color="#1a1a1a" />
              <Text style={styles.boxText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <AntDesign name="logout" size={24} color="#1a1a1a" />
            <Text style={styles.boxText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const menuItems = [
  { label: "My Products", route: "/Product_Info/MyProducts", icon: "shopping-bag" },
  { label: "Favorite", route: "/Profil_infos/Favorite", icon: "favorite-outline" },
  { label: "Demande Discussion", route: "/Profil_infos/DemandeDiscussion", icon: "forum" },
  { label: "Discussion", route: "/Profil_infos/Connection", icon: "chat" },
  { label: "Transaction", route: "/Profil_infos/Transaction", icon: "swap-horiz" },
  { label: "Achat", route: "/Profil_infos/Achat", icon: "shopping-cart" },
];

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
    bottom:0,
  },
  container: {
    flex: 1,
    // backgroundColor: "#1a1a1a",
    backgroundColor: "#fff",
    marginBottom: 80,
  },
  headerImage: {
    width: "100%",
    height: 200,
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#da051d",
  },
  userName: {
    fontSize: 24,
    color: "#1a1a1a",
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: "#bbb",
  },
  boxContainer: {
    padding: 20,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#da051d",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  boxText: {
    color: "#1a1a1a",
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff0000",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: "center",
  },
});

