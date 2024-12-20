import React from 'react';
import { Tabs } from 'expo-router';
import {FontAwesome, FontAwesome6, MaterialIcons} from '@expo/vector-icons'

const Layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          headerShown: false,
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="travel-explore" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addProduct"
        options={{
          headerShown: false,
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