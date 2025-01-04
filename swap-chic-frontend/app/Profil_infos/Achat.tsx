import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Icon from 'react-native-vector-icons/MaterialIcons';

import { BASE_URL, fetchUserById } from "@/Services/api";
import { useUser } from "@clerk/clerk-expo";

// Type definitions
interface Transaction {
  _id: string;
  senderId: string;
  receiverId: string;
  startdate: string;
  productId: {
    name: string;
    price: number;
    photo: string;
    type: string;
    categoryId: string;
  };
  sender: {
    first_name: string;
    last_name: string;
    emailAddresses: { emailAddress: string }[];
  };
}

// Palette de couleurs
const COLORS = {
  primary: '#E63946',     // Rouge vif
  secondary: '#1A1A1A',   // Noir profond
  white: '#FFFFFF',       // Blanc
  lightGray: '#F8F8F8',   // Gris très clair
  darkGray: '#333333',    // Gris foncé
  error: '#FF0000',       // Rouge erreur
};

const Achat = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!user?.id) {
      console.error("User not found!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/transaction/sender/${user?.id}`
      );

      const transactionsWithUsers = await Promise.all(
        response.data.map(async (transaction) => {
          // Fetch sender user data
          const senderResponse = await fetchUserById(transaction.senderId);
          return {
            ...transaction,
            sender: senderResponse,
          };
        })
      );
      setTransactions(transactionsWithUsers);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des transactions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.userInfoContainer}>
        <Image
          source={{ uri: item.productId.photo }}
          style={styles.productImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.sender?.first_name} {item.sender?.last_name}
          </Text>
          <Text style={styles.userEmail}>
            {item.sender?.email_addresses[0].email_address ||
              "Email non disponible"}
          </Text>
        </View>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.productId.name}</Text>
        <View style={styles.priceTypeContainer}>
          <Text style={styles.price}>{item.productId.price} €</Text>
          <View
            style={[
              styles.typeTag,
              item.productId.type === "Sale" && styles.saleTag,
              item.productId.type === "Gift" && styles.giftTag,
              item.productId.type === "Exchange" && styles.exchangeTag,
            ]}
          >
            <Text style={styles.typeText}>{item.productId.type}</Text>
          </View>
        </View>
        <Text style={styles.date}>
          {format(new Date(item.startdate), "dd MMMM yyyy", { locale: fr })}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Icon name="shopping-cart" size={28} color={COLORS.primary} />
          <Text style={styles.headerTitle}>Achat</Text>
        </View>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  transactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  userEmail: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  productInfo: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  priceTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF0000",
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  saleTag: {
    backgroundColor: "#FFE5E5",
  },
  giftTag: {
    backgroundColor: "#E5FFE5",
  },
  exchangeTag: {
    backgroundColor: "#E5E5FF",
  },
  typeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  date: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
  },
});

export default Achat;