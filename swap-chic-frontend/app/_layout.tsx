// import React from "react";
// import { Slot, Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// // import { NavigationContainer } from "@react-navigation/native";
// // import TabNavigation from "../Navigation/TabNavigation";
// import * as SecureStore from "expo-secure-store";
// import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";

// export default function RootLayout() {
//   return (
//     <ClerkProvider publishableKey="pk_test_YWJsZS1kb25rZXktMjMuY2xlcmsuYWNjb3VudHMuZGV2JA">
//       {/* <StatusBar style="auto" /> */}

//       <SignedIn>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen
//             name="(tabs)"
//             options={{
//               animation: "none",
//             }}
//           />
//         </Stack>
//       </SignedIn>

//       <SignedOut>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen
//             name="index"
//             options={{
//               animation: "none",
//             }}
//           />
//         </Stack>
//       </SignedOut>
//     </ClerkProvider>
//   );
// }

import React from "react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ClerkProvider } from "@clerk/clerk-expo";

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  return (
    <ClerkProvider 
      publishableKey="pk_test_YWJsZS1kb25rZXktMjMuY2xlcmsuYWNjb3VudHMuZGV2JA"
      tokenCache={tokenCache}
    >
      <Stack initialRouteName="index">
        <Stack.Screen 
          name="index"
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack>
    </ClerkProvider>
  );
}