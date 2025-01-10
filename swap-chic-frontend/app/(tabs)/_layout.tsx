import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome, FontAwesome6, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-react";
import { BlurView } from "expo-blur";

const Layout = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();

  return (
    <Tabs
      screenOptions={{
      headerShown: false,
      
      tabBarActiveTintColor: "#da051d", 
        tabBarInactiveTintColor: "#fff",
      tabBarStyle: {
        // margin: 10,
        paddingTop: 8,
        backgroundColor: "#000", 
        borderRadius: 35, 
        marginHorizontal: 15, 
        marginVertical: 15, 
        height: 70, 
        position: "absolute", 
        bottom: 10, 
        marginTop:10, 
      },
      
      // tabBarBackground: () => (
      //   <BlurView tint="light" intensity={100} style={{backgroundColor:"#fff"}} />
      // ),
      }}
    >
      <Tabs.Screen
      name="index"
      options={{
        title: "Home",
        tabBarIcon: ({ color }) => (
        <FontAwesome size={28} name="home" color={color} style={{ alignSelf: 'center' }} />
        ),
      }}
      />
      <Tabs.Screen
      name="explore"
      options={{
        title: "Explore",
        tabBarIcon: ({ color }) => (
        <AntDesign name="search1" size={28} color={color} style={{ alignSelf: 'center' }} />
        ),
      }}
      />
      <Tabs.Screen
      name="addProduct"
      options={{
        title: "Add",
        tabBarIcon: ({ color }) => (
        <FontAwesome6 name="add" size={28} color={color} style={{ alignSelf: 'center' }} />
        ),
      }}
      />
      <Tabs.Screen
      name="profile"
      options={{
        title: "Profile",
        tabBarIcon: ({ color }) => (
        <AntDesign name="user" size={28} color={color} style={{ alignSelf: 'center' }} />
        ),
      }}
      />
    </Tabs>
  );
};

export default Layout;
