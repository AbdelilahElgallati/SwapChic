import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';

const Redirect = () => {
    const router = useRouter();

    useEffect(() => {
        console.log("From redirect");
        setTimeout(() => {
            router.replace("/"); 
        }, 50); 
    }, []);

    return <Stack.Screen options={{ headerShown: false }} />;
};

export default Redirect;