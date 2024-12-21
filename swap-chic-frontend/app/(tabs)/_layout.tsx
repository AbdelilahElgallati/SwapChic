import React from 'react';
import { Tabs } from 'expo-router';
import {FontAwesome, FontAwesome6, MaterialIcons} from '@expo/vector-icons'

const Layout = () => {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="travel-explore" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addProduct"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="add" size={28} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
};

export default Layout;