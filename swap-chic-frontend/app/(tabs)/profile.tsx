import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import React, { useCallback, useState } from "react";
import bg from "@/assets/images/bgPrf.jpg";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useFocusEffect, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
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

  useFocusEffect(
      useCallback(() => {
        console.log("ref")
      }, [])
    );
  
    const onRefresh = async () => {
      setRefreshing(true);
      console.log("ref")
      setRefreshing(false);
    };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View>
          <Image source={bg} style={styles.C} />

          <View style={styles.emailContainer}>
            <Text style={styles.userName}>{user?.fullName}</Text>

            <Text style={styles.email}>
              {user?.primaryEmailAddress?.emailAddress}
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: user?.imageUrl }} style={styles.image} />
          </View>
        </View>
        <View style={styles.boxContainer}>
          <TouchableOpacity
            style={styles.box}
            onPress={() => router.push("/Product_Info/MyProducts")}
          >
            <MaterialIcons name="shopping-bag" size={24} color="black" />
            <Text style={styles.boxText}>My Products</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box}
            onPress={() => router.push("/Profil_infos/Favorite")}
          >
            <MaterialIcons name="favorite-outline" size={24} color="black" />
            <Text style={styles.boxText}>Favorite</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box}
            onPress={() => router.push("/Profil_infos/Connection")}
          >
            <Octicons name="comment-discussion" size={24} color="black" />
            <Text style={styles.boxText}>Discussion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box}
            onPress={() => router.push("/Profil_infos/Transaction")}
          >
            <FontAwesome name="exchange" size={24} color="black" />
            <Text style={styles.boxText}>Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box} onPress={handleLogout}>
            <AntDesign name="logout" size={24} color="black" />
            <Text style={styles.boxText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // marginBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    top: -225,
    right: 125,
    width: 130,
    height: 130,
    borderRadius: 130,
    elevation: 15,
    shadowColor: "black",
    shadowOffset: { width: 80, height: 80 },
  },
  userName: {
    top: 120,
    left: 70,
    fontSize: 24,
    fontStyle: "italic",
    // marginBottom: -20,
    color: "#fff",
    textShadowColor: "#da051d",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  emailContainer: {
    alignItems: "center",
    bottom: 140,
    // left: 90,
    backgroundColor: "rgba(0,0,0,0.5)",
    // marginBottom: 10,
    height: 200,
  },
  email: {
    fontSize: 16,
    color: "#F5F5F5F5",
    // fontWeight: "bold",
    top: 120,
    left: 70,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  boxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20,
    top: -230,
  },
  box: {
    width: "100%",
    padding: 20,
    marginBottom: 20,
    // marginTop:10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    // shadowColor: "#da051d",
    height: 100,
    justifyContent: "center",
  },
  boxIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  boxText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  C: {
    backgroundColor: "#fff",
    // borderBottomEndRadius:160,
    // borderBottomStartRadius:200,
    // borderBottomLeftRadius:60,
    // // borderTopLeftRadius:10,
    // borderBottomRightRadius:60,
    // padding:10,
    marginBottom: -60,
    // borderRightWidth:1,
    // borderLeftWidth:1,
    // borderBottomWidth:1,
    // borderColor:"#000",
    width: "100%",
    paddingBottom: 20,
    height: 200,
    elevation: 5,
  },
  img: {
    backgroundColor: "rgba(0,0,0,1)",
    // paddingVertical: 210,
    alignItems: "center",
  },
});
