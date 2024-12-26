import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../app/(tabs)/index";
import WelcomeScreen from "../app/index";
import ProfileScreen from "../app/(tabs)/profile";
import ExploreScreen from "../app/(tabs)/explore";
import AddPostScreen from "../app/(tabs)/addProduct";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBarActiveTintColor="#000"
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <View>
              <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>
                Home
              </Text>
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <View>
              <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>
                Explore
              </Text>
            </View>
          ),
          tabBarIcon: ({ color, size }) => {
            return <AntDesign name="search1" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="AddPost"
        component={AddPostScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <View>
              <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>
                AddPost
              </Text>
            </View>
          ),
          tabBarIcon: ({ color, size }) => {
            return <AntDesign name="pluscircleo" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <View>
              <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>
                Profile
              </Text>
            </View>
          ),
          tabBarIcon: ({ color, size }) => {
            return <AntDesign name="user" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
