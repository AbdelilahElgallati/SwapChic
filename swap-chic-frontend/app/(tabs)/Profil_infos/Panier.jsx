import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
const products = [
    { id: '1', name: 'Product 1', description: 'Description of Product 1' },
    { id: '2', name: 'Product 2', description: 'Description of Product 2' },
    { id: '3', name: 'Product 3', description: 'Description of Product 3' },
];

const Panier = () => {
    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Title title={item.name} />
            <Card.Content>
                <Text>{item.description}</Text>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    card: {
        marginVertical: 8,
    },
});

export default Panier;