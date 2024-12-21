import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";
import { SignedOut, SignedIn } from "@clerk/clerk-react";

export default function RootLayout() {
  return (
    // <ClerkProvider publishableKey="pk_test_YWJsZS1kb25rZXktMjMuY2xlcmsuYWNjb3VudHMuZGV2JA">
    //   <Stack screenOptions={{ headerShown: false }}>
    //     <StatusBar style="light" />
    //     {/* <Stack.Screen name="index" /> */}
    //     <SignedIn>
    //       <Stack.Screen name="(tabs)" />
    //     </SignedIn>

    //     <SignedOut>
    //       <Stack.Screen name="index" />
    //     </SignedOut>
    //   </Stack>
    // </ClerkProvider>

    <ClerkProvider publishableKey="pk_test_YWJsZS1kb25rZXktMjMuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <Stack screenOptions={{ headerShown: false }}>
        <StatusBar style="light" />
        <SignedIn>
          <Stack.Screen name="(tabs)" />
        </SignedIn>
        <SignedOut>
          <Stack.Screen name="(auth)/signIn" />
        </SignedOut>
      </Stack>
    </ClerkProvider>
  );
}
