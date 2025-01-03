import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import io from "socket.io-client";
import axios from "axios";
import { fetchUserById } from "@/Services/api";
// import {BASE_URL} from "@env"

const SOCKET_URL = `http://192.168.167.74:3001`;

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  productId: string;
  createdAt: string;
}

const Chat = () => {
  const { productId, clientId, productOwnerId } = useLocalSearchParams();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReveiver] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    if (user?.id) {
      socketRef.current.emit("registerUser", user.id);
    }

    const chatRoom = `chat_${productId}_${[clientId, productOwnerId]
      .sort()
      .join("_")}`;
    socketRef.current.emit("joinRoom", chatRoom);

    socketRef.current.on("newMessage", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    fetchMessages();
    fetchReceiverData();

    return () => {
      socketRef.current.emit("leaveRoom", chatRoom);
      socketRef.current.disconnect();
    };
  }, [productId, clientId, productOwnerId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${SOCKET_URL}/message`, {
        params: { productId, clientId, productOwnerId },
      });
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  const fetchReceiverData = async () => {
    try {
      let data = [];
      if (user.id == clientId) {
        data = await fetchUserById(productOwnerId);
      } else if (user.id == productOwnerId) {
        data = await fetchUserById(clientId);
      }
      setReveiver(data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: user?.id,
      receiverId: user?.id === clientId ? productOwnerId : clientId,
      text: newMessage.trim(),
      productId,
    };

    socketRef.current.emit("sendMessage", messageData);
    setNewMessage("");
  };

  const groupMessagesByDay = (messages: Message[]) => {
    return messages.reduce((grouped: Record<string, Message[]>, message) => {
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(message);
      return grouped;
    }, {});
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === user?.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime,
          ]}
        >
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  const renderDateSeparator = (date: string) => (
    <View style={styles.dateSeparator}>
      <Text style={styles.dateText}>{date}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  const groupedMessages = groupMessagesByDay(messages);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>{receiver.first_name}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={Object.keys(groupedMessages)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item: date }) => (
          <>
            {renderDateSeparator(date)}
            {groupedMessages[date].map((message) => (
              <View key={message._id}>{renderMessage({ item: message })}</View>
            ))}
          </>
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Écrivez votre message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 10,
    height: "100%",
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  ownMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4A90E2",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#EDEDED",
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: "#FFF",
  },
  otherMessageText: {
    color: "#333",
  },
  messageTime: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "right",
  },
  ownMessageTime: {
    color: "#B0C4DE",
  },
  otherMessageTime: {
    color: "#888888",
  },
  dateSeparator: {
    marginVertical: 10,
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default Chat;
