import { View, Text, StyleSheet } from 'react-native';
import TabNavigation from '../Navigation/TabNavigation';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider } from '@clerk/clerk-expo';
import { SignedOut, SignedIn } from '@clerk/clerk-react';
import Index from '../app/(tabs)/index'; 
import { NavigationContainer } from '@react-navigation/native';



export default function _layout() {
  return (
    <ClerkProvider publishableKey='pk_test_YWJsZS1kb25rZXktMjMuY2xlcmsuYWNjb3VudHMuZGV2JA'>
      <View style={styles.container}>
        <StatusBar style="auto" />
        
        <SignedIn>
          <NavigationContainer>
            <TabNavigation/>
          </NavigationContainer>
        </SignedIn>

        <SignedOut>
        <Index />
        </SignedOut>
      </View>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});