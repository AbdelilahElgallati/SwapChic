import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
// import { ClerkProvider } from "@clerk/clerk-expo";
// import { SignedOut, SignedIn } from "@clerk/clerk-react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "../Navigation/TabNavigation";
import * as SecureStore from "expo-secure-store";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function RootLayout() {

  return (
    <ClerkProvider publishableKey="pk_test_YWJsZS1kb25rZXktMjMuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <Stack screenOptions={{ headerShown: false }}>
        <StatusBar style="light" />
        <SignedIn>
          {/* <Stack.Screen name="(tabs)" /> */}
          <NavigationContainer>
            <TabNavigation />
          </NavigationContainer>
        </SignedIn>
        <SignedOut>
          <Stack.Screen name="index" />
        </SignedOut>
      </Stack>
    </ClerkProvider>
  );
}
