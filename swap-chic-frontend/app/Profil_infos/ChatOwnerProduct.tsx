// import { useUser } from "@clerk/clerk-react";
// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
// import io from "socket.io-client";
// import { useLocalSearchParams } from "expo-router";
// import { formatDistanceToNow } from "date-fns";

// const ChatOwnerProduct = () => {
//   const { user } = useUser();
//   const { productId, receiverId } = useLocalSearchParams();
//   const [allMessages, setAllMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const socket = React.useMemo(
//     () => io("http://192.168.1.5:3001", { transports: ["websocket"] }),
//     []
//   );

//   useEffect(() => {
//     if (productId && receiverId) {
//       fetchMessages();

//       // Rejoindre la salle
//       socket.emit("joinRoom", { productId, senderId: user?.id, receiverId });

//       // Charger les messages existants
//       socket.on("loadMessages", (existingMessages) => {
//         setAllMessages(existingMessages);
//       });

//       // Écouter les nouveaux messages
//       socket.on("newMessage", (newMessage) => {
//         setAllMessages((prevMessages) => [...prevMessages, newMessage]);
//       });
//     }

//     // Nettoyer les écouteurs
//     return () => {
//       socket.off("newMessage");
//       socket.off("loadMessages");
//       socket.disconnect();
//     };
//   }, [productId, receiverId, user?.id, socket]);

//   const fetchMessages = async () => {
//     if (!productId || !receiverId) return;

//     setLoading(true);
//     try {
//       const response = await fetch(
//         `http://192.168.1.5:3001/message/${productId}/${user?.id}/${receiverId}`
//       );
//       const data = await response.json();
//       if (data && data.messages) {
//         setAllMessages(data.messages);
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendMessage = () => {
//     if (!newMessage.trim()) return;
//     if (!user) {
//       console.error("User not authenticated");
//       return;
//     }

//     const message = {
//       productId,
//       senderId: user?.id,
//       receiverId,
//       content: newMessage.trim(),
//       createdAt: new Date().toISOString(),
//     };

//     // Envoyer via le socket
//     socket.emit("sendMessage", message);

//     // Ajouter localement pour une meilleure réactivité
//     setAllMessages((prevMessages) => [...prevMessages, message]);
//     setNewMessage("");
//   };

//   const renderItem = ({ item }) => {
//     const timeAgo = formatDistanceToNow(new Date(item.createdAt), {
//       addSuffix: true,
//     });
//     const isSender = item.sender === user?.id;

//     return (
//       <View
//         style={[
//           styles.messageContainer,
//           isSender ? styles.senderContainer : styles.receiverContainer,
//         ]}
//       >
//         <Text style={styles.messageContent}>{item.content}</Text>
//         <Text style={styles.messageTime}>{timeAgo}</Text>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <FlatList
//           data={allMessages}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={renderItem}
//         />
//       )}
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           value={newMessage}
//           onChangeText={setNewMessage}
//           placeholder="Type your message..."
//           placeholderTextColor="#888"
//         />
//         <TouchableOpacity
//           style={[
//             styles.sendButton,
//             newMessage.trim() ? styles.activeButton : styles.disabledButton,
//           ]}
//           onPress={sendMessage}
//           disabled={!newMessage.trim()}
//         >
//           <Text style={styles.sendButtonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import io from "socket.io-client";
import { useLocalSearchParams } from "expo-router";
import { useUser } from "@clerk/clerk-react";
import { formatDistanceToNow } from "date-fns";

const ChatOwnerProduct = () => {
  const { user } = useUser();
  const { productId, receiverId } = useLocalSearchParams();
  const [allMessages, setAllMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const socket = React.useMemo(
    () => io("http://192.168.1.5:3001", { transports: ["websocket"] }),
    []
  );

  useEffect(() => {
    if (!productId || !receiverId) {
      console.error("Missing parameters");
      return;
    }

    const joinRoom = () => {
      socket.emit("joinRoom", { productId, senderId: user?.id, receiverId });
      socket.on("loadMessages", setAllMessages);
      socket.on("newMessage", (message) =>
        setAllMessages((prev) => [...prev, message])
      );
    };

    joinRoom();

    return () => {
      socket.off("loadMessages");
      socket.off("newMessage");
      socket.disconnect();
    };
  }, [productId, receiverId, user?.id, socket]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      productId,
      senderId: user?.id,
      receiverId,
      content: newMessage,
      createdAt: new Date(),
    };

    socket.emit("sendMessage", message);
    setAllMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={allMessages}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            <View>
              <Text>{item.content}</Text>
            </View>
          )}
        />
      )}
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type your message"
      />
      <TouchableOpacity onPress={sendMessage}>
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f8f8f8",
  },
  messageContainer: {
    marginVertical: 10,
    padding: 12,
    borderRadius: 15,
    maxWidth: "75%",
  },
  senderContainer: {
    backgroundColor: "#4CAF50",
    alignSelf: "flex-end",
  },
  receiverContainer: {
    backgroundColor: "#2196F3",
    alignSelf: "flex-start",
  },
  messageContent: {
    color: "white",
    fontSize: 16,
  },
  messageTime: {
    color: "#e0e0e0",
    fontSize: 12,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingLeft: 15,
    height: 45,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#4CAF50",
  },
  disabledButton: {
    backgroundColor: "#bdbdbd",
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ChatOwnerProduct;

