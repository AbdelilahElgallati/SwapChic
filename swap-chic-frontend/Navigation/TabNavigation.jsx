import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import HomeScreen from "../app/(tabs)/index";
import WelcomeScreen from "../app/index";
import ProfileScreen from "../app/(tabs)/profile";
import ExploreScreen from "../app/(tabs)/explore";
import AddPostScreen from "../app/(tabs)/addProduct";

const Stack = createStackNavigator();

export default function TabNavigation() {
  return (
    
      <NavigationContainer> {/* NavigationContainer ici pour encapsuler toute la navigation */}
        <Stack.Navigator
          screenOptions={{ headerShown: false, 
            
          }}
          initialRouteName="Home"
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="index" component={WelcomeScreen} />  {/* Route Welcome */}
          <Stack.Screen name="Explore" component={ExploreScreen} />
          <Stack.Screen name="AddPost" component={AddPostScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    
  );

}




