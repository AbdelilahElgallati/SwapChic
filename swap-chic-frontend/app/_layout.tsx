import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
        <Stack screenOptions={{ headerShown: false }}>
          <StatusBar style="light" />
          <Stack.Screen name="index" />
        </Stack>
  );
}
