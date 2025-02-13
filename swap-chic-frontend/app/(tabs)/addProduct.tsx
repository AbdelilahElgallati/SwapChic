import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useFocusEffect } from "expo-router";
import { useUser } from "@clerk/clerk-react";
import { Picker } from "@react-native-picker/picker";
import { getCategory } from "../../Services/api";
import { BASE_URL } from "../../Services/api";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from "react-native/Libraries/NewAppScreen";

const COLORS = {
  primary: '#E63946',     // Rouge vif
  secondary: '#1A1A1A',   // Noir profond
  white: '#FFFFFF',       // Blanc
  lightGray: '#F8F8F8',   // Gris très clair
  darkGray: '#333333',    // Gris foncé
  border: '#DDDDDD',      // Couleur de bordure
};

const addProduct = () => {
  const router = useRouter();
  const { user } = useUser();

  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("New");
  const [type, setType] = useState("Sale");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("Published");
  const [categories, setCategories] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await getCategory(); // Récupère les catégories depuis l'API
      setCategories(data); // Mettre à jour l'état des catégories
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      setName("");
      setDescription("");
      setCondition("New");
      setPrice("");
      setCategoryId("");
      setType("Sale");
      setPhoto(null);
      setStatus("Published");
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setName("");
    setDescription("");
    setCondition("New");
    setPrice("");
    setCategoryId("");
    setPhoto(null);
    setType("Sale");
    setStatus("Published");
    setRefreshing(false);
  };

  const validateFields = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Le nom est requis.";
    if (!description.trim()) errors.description = "L'description est requis.";
    if (!condition.trim()) errors.condition = "La condition est requis.";
    if (!price.trim()) errors.price = "Le prix est requis.";
    if (!categoryId.trim()) errors.categoryId = "La catégorie est requis.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission requise",
        "Autorisez l'accès à votre galerie pour ajouter une photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateFields()) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("userId", user?.id);
    formData.append("categoryId", categoryId);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("condition", condition);
    formData.append("price", price);
    formData.append("type", type);

    if (photo) {
      const filename = photo.split("/").pop();
      const type = `image/${filename.split(".").pop()}`;
      formData.append("photo", {
        uri: photo,
        name: filename,
        type,
      });
    }

    try {
      const response = await fetch(
        `${BASE_URL}/product/add`,

        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Succès", "Produit ajouté avec succès.");

        // Réinitialiser les champs après l'ajout
        setName("");
        setDescription("");
        setCondition("New");
        setPrice("");
        setCategoryId("");
        setPhoto(null);
        setType("Sale");
        setStatus("Published");
        router.replace("/(tabs)");
      } else {
        Alert.alert("Erreur", data.message || "Échec de l'ajoute de produit.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      Alert.alert("Erreur", "Un problème est survenu lors de l'inscription.");
    } finally {
      setIsSubmitting(false); // Réactiver le bouton après la soumission
    }
  };

  return (
    <View style={styles.container}>
      {/* Improved Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
        <Ionicons name="add-circle" size={30} color={COLORS.primary} />
          <Text style={styles.headerTitle}>Ajoute de produit</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.containerForum}>

          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Condition :</Text>
          <Picker
            selectedValue={condition}
            onValueChange={(itemValue) => setCondition(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="New" value="New" />
            <Picker.Item label="Used" value="Used" />
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Category :</Text>
          <Picker
            selectedValue={categoryId}
            onValueChange={(itemValue) => setCategoryId(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a Category" value="" />
            {categories.map((category) => (
              <Picker.Item
                key={category._id}
                label={category.name}
                value={category._id}
              />
            ))}
          </Picker>

          <Text style={styles.label}>Type :</Text>
          <Picker
            selectedValue={type}
            onValueChange={(itemValue) => setType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Gift" value="Gift" />
            <Picker.Item label="Sale" value="Sale" />
            <Picker.Item label="Exchange" value="Exchange" />
          </Picker>

          <Text style={styles.label}>Statut :</Text>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Published" value="Published" />
            <Picker.Item label="Sold" value="Sold" />
          </Picker>

          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Text style={styles.photoButtonText}>
              {photo ? "Change photo" : "Add photo"}
            </Text>
          </TouchableOpacity>
          {photo && (
            <Image source={{ uri: photo }} style={styles.imagePreview} />
          )}

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "In Progress..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginLeft:10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  containerForum: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 90,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#da051d",
    marginLeft: -15,
    marginTop: -10,
    padding: 5,
    width: "70%",
    textShadowColor: "gray",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#4A5568",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2C3E50",
    marginBottom: 8,
  },
  picker: {
    borderColor: "#000",
    borderWidth: 1,
    color: "#000",
    fontWeight: "bold",
    backgroundColor: "#F5F5F5F5",
    borderRadius: 10,
    marginBottom: 15,
  },
  photoButton: {
    // backgroundColor: "lightgray",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  photoButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#da051d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#95a5a6",
  },
});

export default addProduct;
