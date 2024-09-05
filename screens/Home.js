import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native';
import axios from 'axios';
import {useIsFocused} from "@react-navigation/native";

export default function Home({ navigation }) {
  const [products, setProducts] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.1.74:5000/products').then((response) => {
          setProducts(response.data);
        });
      } catch (e) {
        console.log(e);
      }
    };

    if (isFocused) fetchProducts();
  }, [isFocused]);

  const renderProduct = ({item}) => {
    return (
      <View style={{justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: 'lightgray', borderRadius: 10, marginBottom: 10}}>
        <Text style={{fontSize: 30}}>{item.name}</Text>
        <Image source={{uri: item.image}} style={{width: 200, height: 200, borderRadius: 10, marginVertical: 10}}/>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.modifyButton} onPress={() => addToCart(item)}>
            <Text style={styles.buttonText}>Ajouter au panier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modifyButton}
                            onPress={() => navigation.navigate('UpdateProduct')}>
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}
                            onPress={() => navigation.navigate('DeleteProduct')}>
            <Text style={styles.buttonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 1, gap: 45, marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>Bienvenue chez Easy Shop</Text>
        <FlatList data={products} renderItem={(item) => renderProduct(item)} keyExtractor={(item) => item.id}/>
      </View>
      <View style={{flex: 0, justifyContent: 'flex-end', alignItems: 'center', marginVertical: 20}}>
        <TouchableOpacity style={{backgroundColor: 'limegreen', padding: 12, borderRadius: 10}}
                          onPress={() => navigation.navigate('AddProduct')}>
          <Text style={styles.buttonText}>Ajouter un produit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  modifyButton: {
    backgroundColor: 'dodgerblue',
    padding: 12,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
