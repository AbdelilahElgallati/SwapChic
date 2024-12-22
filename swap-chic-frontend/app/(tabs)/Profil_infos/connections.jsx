import React, { useState } from 'react';
import { View, Text, FlatList, ScrollView, TextInput, Button } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
const exampleVendors = [
    { id: 1, name: 'Vendeur 1' },
    { id: 2, name: 'Vendeur 2' },
    { id: 3, name: 'Vendeur 3' },
    { id: 4, name: 'Vendeur 4' },
    { id: 5, name: 'Vendeur 5' }
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
    vendorName: {
        fontSize: 18,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    messageScroll: {
        flex: 1,
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 5,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});
const getMessagesForVendor = (vendorId) => {
    // This function should return messages for the selected vendor
    // For now, it returns all messages as a placeholder
    return messages;
};

const Connections = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [selectedVendor, setSelectedVendor] = useState(null);

    const handleVendorSelect = (vendor) => {
        setSelectedVendor(vendor);
    };

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, input]);
            setInput('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes Connections</Text>
            <Text style={styles.subtitle}>Voici la liste de vos connections avec les vendeurs des produits.</Text>
            <FlatList
                data={exampleVendors}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleVendorSelect(item)}>
                        <Text style={styles.vendorName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
            
            <View style={styles.messageContainer}>
                <ScrollView style={styles.messageScroll}>
                    {messages.map((message, index) => (
                        <Text key={index} style={styles.message}>
                            {message}
                        </Text>
                    ))}
                </ScrollView>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    placeholder="Tapez votre message..."
                />
                <Button title="Envoyer" onPress={handleSendMessage} />
            </View>
        </View>
    );
};

export default Connections;