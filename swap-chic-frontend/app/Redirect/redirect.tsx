import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Redirect = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Redirection explicite vers la page 'HomePage'
    navigation.navigate("HomePage");
  }, [navigation]);

  return null; 
};

export default Redirect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
