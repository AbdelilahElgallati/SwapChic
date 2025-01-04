import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BASE_URL } from "@/Services/api";

// Palette de couleurs
const COLORS = {
  primary: "#E63946", // Rouge vif
  secondary: "#1A1A1A", // Noir profond
  white: "#FFFFFF", // Blanc
  lightGray: "#F8F8F8", // Gris très clair
  darkGray: "#333333", // Gris foncé
  error: "#FF0000", // Rouge erreur
};

const Connection = () => {
  const router = useRouter();
  const { user } = useUser();
  const [productOwners, setProductOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const ownersResponse = await axios.get(
        `${BASE_URL}/message/client/${user.id}`
      );
      setProductOwners(ownersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setProductOwners([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const handleProductPress = (product, productOwnerId) => {
    router.push(
      `/Profil_infos/Chat?productId=${product._id}&productOwnerId=${productOwnerId}&clientId=${user?.id}`
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  const ConversationCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="person" size={24} color={COLORS.primary} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.senderName || item.receiverName}
          </Text>
          <Text style={styles.userEmail}>
            {item.senderEmail || item.receiverEmail}
          </Text>
        </View>
      </View>
      <View style={styles.productsContainer}>
        {item.products.map((product) => (
          <View key={product._id} style={styles.productItem}>
            <View style={styles.productInfo}>
              <Icon name="shopping-bag" size={20} color={COLORS.primary} />
              <TouchableOpacity
                onPress={() => handleProductPress(product, item.receiverId)}
                style={styles.productNameContainer}
              >
                <Text style={styles.productName}>{product.name}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading your conversations...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#3498db"]}
        />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Icon name="chat" size={28} color={COLORS.primary} />
          <Text style={styles.headerTitle}>Mes Conversations</Text>
        </View>
      </View>

      {productOwners.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="forum" size={64} color="#bdc3c7" />
          <Text style={styles.emptyStateText}>No conversations yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Start chatting with product owners to see them here
          </Text>
        </View>
      ) : (
        productOwners.map((item, index) => (
          <ConversationCard key={index} item={item} />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.secondary,
    marginLeft: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    margin: 10,
    padding: 15,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingBottom: 10,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.secondary,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  productsContainer: {
    marginTop: 10,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  productNameContainer: {
    marginLeft: 10,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: "500",
  },
  transactionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.darkGray,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.secondary,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 8,
    textAlign: "center",
  },
});

export default Connection;
