import React from 'react';
import { View, Text, FlatList } from 'react-native';

const MyProducts = () => {
    const products = [
        { id: 1, name: 'Product 1', description: 'Description of Product 1' },
        { id: 2, name: 'Product 2', description: 'Description of Product 2' },
        { id: 3, name: 'Product 3', description: 'Description of Product 3' },
    ];

        <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>My Products</Text>
            <FlatList
                data={products}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 18 }}>{item.name}</Text>
                        <Text>{item.description}</Text>
                    </View>
                )}
            />
        </View>
      
   
};

export default MyProducts;