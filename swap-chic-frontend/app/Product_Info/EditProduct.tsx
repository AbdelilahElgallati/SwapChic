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
  BackHandler,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useFocusEffect } from "expo-router";
import { useUser } from "@clerk/clerk-react";
import { Picker } from "@react-native-picker/picker";
import { getOneProduct, getCategory } from "../../Services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../Services/api";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";


const COLORS = {
  primary: "#E63946", // Rouge vif
  secondary: "#1A1A1A", // Noir profond
  white: "#FFFFFF", // Blanc
  lightGray: "#F8F8F8", // Gris très clair
  darkGray: "#333333", // Gris foncé
  border: "#DDDDDD", // Couleur de bordure
};

const EditProduct = () => {
  const router = useRouter();
  const { user } = useUser();

  const [productId, setProductId] = useState(null);

  const fetchProductId = async () => {
    const storedProductId = await AsyncStorage.getItem("productId");
    if (storedProductId) {
      setProductId(storedProductId);
      fetchProducts(storedProductId);
    } else {
      console.error("productId non trouvé dans AsyncStorage");
    }
  };

  useEffect(() => {
    fetchProductId();
    fetchCategories();
  }, []);

  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("New");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("Published");
  const [type, setType] = useState("Sale");
  const [categories, setCategories] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Récupérer les catégories
  const fetchCategories = async () => {
    try {
      const data = await getCategory();
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories", error);
    }
  };

  // Récupérer les informations du produit par ID
  const fetchProducts = async (productId) => {
    try {
      if (!productId) {
        console.error("ID du produit manquant.");
        return;
      }
      const data = await getOneProduct(productId);
      setName(data.name);
      setDescription(data.description);
      setCondition(data.condition || "New");
      setPrice(data.price.toString());
      setCategoryId(data.categoryId._id);
      setPhoto(data.photo);
      setType(data.type || "Sale");
      setStatus(data.status || "Published");
    } catch (error) {
      console.error("Erreur lors de la récupération du produit", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    await fetchProductId();
    setRefreshing(false);
  };

  // Validation des champs
  const validateFields = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Le nom est requis.";
    if (!description.trim()) errors.description = "La description est requise.";
    if (!condition.trim()) errors.condition = "La condition est requise.";
    if (!price.trim()) errors.price = "Le prix est requis.";
    if (!categoryId.trim()) errors.categoryId = "La catégorie est requise.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Choisir une image depuis la galerie
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

  // Soumettre le formulaire de modification
  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateFields()) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("userId", user?.id);
    formData.append("_id", productId);
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
        `${BASE_URL}/product/edit/${productId}`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Succès", "Produit modifié avec succès.");
        router.replace("/Product_Info/MyProducts");
      } else {
        Alert.alert(
          "Erreur",
          data.message || "Échec de la modification du produit."
        );
      }
    } catch (error) {
      console.error("Erreur :", error);
      Alert.alert(
        "Erreur",
        "Un problème est survenu lors de la modification du produit."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Icon name="refresh" size={28} color={COLORS.primary} />
          <Text style={styles.headerTitle}>Modification de produit</Text>
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
            placeholder="Nom du produit"
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
            onValueChange={setCondition}
            style={styles.picker}
          >
            <Picker.Item label="New" value="New" />
            <Picker.Item label="Used" value="Used" />
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Prix"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Catégorie :</Text>
          <Picker
            selectedValue={categoryId}
            onValueChange={setCategoryId}
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner une catégorie" value="" />
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
            onValueChange={setType}
            style={styles.picker}
          >
            <Picker.Item label="Gift" value="Gift" />
            <Picker.Item label="Sale" value="Sale" />
            <Picker.Item label="Exchange" value="Exchange" />
          </Picker>

          <Text style={styles.label}>Statut :</Text>
          <Picker
            selectedValue={status}
            onValueChange={setStatus}
            style={styles.picker}
          >
            <Picker.Item label="Published" value="Published" />
            <Picker.Item label="Sold" value="Sold" />
          </Picker>

          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Text style={styles.photoButtonText}>
              {photo ? "Changer de photo" : "Ajouter une photo"}
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
              {isSubmitting ? "En cours..." : "Modifier"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.secondary,
    marginLeft: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  containerForum: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#4A5568",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2C3E50",
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    marginBottom: 15,
  },
  photoButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  photoButtonText: {
    color: "#FFFFFF",
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#95a5a6",
  },
});
