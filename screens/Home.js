import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert, TextInput} from 'react-native';
import axios from 'axios';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-toast-message";
import RNPickerSelect from 'react-native-picker-select';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Home({ navigation, incrementCartItems }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('produit');
  const categories = [{
    label: 'Produit',
    value: 'produit',
  }, {
    label: 'Catégorie',
    value: 'categorie',
  }];

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await axios.get('http://192.168.1.74:5000/products').then((response) => {
          setProducts(response.data);
        });
      } catch (e) {
        console.log(e);
      }
    };

    setSearch('');

    if (isFocused) fetchProducts().then(r => r);
  }, [isFocused]);

  const addToPanier = async (product) => {
    try {
      const panier = await AsyncStorage.getItem('panier');
      if (panier) {
        const panierItems = JSON.parse(panier);

        const existingProduct = panierItems.find((item) => item.id === product.id);
        if (existingProduct) {
          existingProduct.quantite += 1;
          await AsyncStorage.setItem('panier', JSON.stringify(panierItems));
          return incrementCartItems();
        }

        product.quantite = 1;

        panierItems.push(product);
        await AsyncStorage.setItem('panier', JSON.stringify(panierItems));
      } else {
        product.quantite = 1;
        await AsyncStorage.setItem('panier', JSON.stringify([product]));
      }

      incrementCartItems();
    } catch (e) {
      console.log(e);
    }
  }

  const alerteSuppression = (item) => {
    Alert.alert(
      'Suppression',
      `Voulez-vous vraiment supprimer le produit ${item.name} ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: () => deleteProduct(item),
        },
      ],
    );
  }

  const deleteToast = (item) => {
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: `Produit ${item.name} supprimé`,
      text1Style: { fontSize: 15 },
      visibilityTime: 3000,
      autoHide: true,
    });
  }

  const deleteProduct = async (product) => {
    try {
      await axios.delete(`http://192.168.1.74:5000/products/${product.id}`);
      const newProducts = products.filter((item) => item.id !== product.id);
      setProducts(newProducts);
      deleteToast(product);
    } catch (e) {
      console.log(e);
    }
  }

  const renderProduct = ({ item }) => {
    return (
      <View style={{ justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: 'lightgray', borderRadius: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 30 }}>{item.name}</Text>
        <Image source={{ uri: item.image }} style={{ width: 200, height: 200, borderRadius: 10, marginVertical: 10 }} />
        <Text style={{ fontSize: 20, marginVertical: 10 }}>{item.categorie}</Text>
        <Text style={{ fontSize: 20 }}>Prix: {item.price} €</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={{ backgroundColor: 'limegreen', padding: 12, borderRadius: 10 }} onPress={() => addToPanier(item)}>
            <MaterialCommunityIcons name={"cart-plus"} size={20} color={"white"} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.modifyButton} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
            <Text style={styles.buttonText}>Détails</Text>
          </TouchableOpacity>
          
          {/* Modifier le produit */}
          <TouchableOpacity style={styles.modifyButton} onPress={() => navigation.navigate('UpdateProduct', { product: item })}>
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
          
          {/* Supprimer le produit */}
          <TouchableOpacity style={styles.deleteButton} onPress={() => alerteSuppression(item)}>
            <Text style={styles.buttonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  useEffect(() => {
    const searchProducts = async () => {
      try {

        if(search === '') {
          await axios.get('http://192.168.1.74:5000/products').then((response) => {
            setProducts(response.data);
          });
          return;
        }

        await axios.get(`http://192.168.1.74:5000/products/${selectedType}/${search}`).then((response) => {
          setProducts(response.data);
        });
      } catch (e) {
        console.log(e);
      }
    }

    searchProducts()
  }, [search]);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, gap: 45, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>Bienvenue chez Easy Shop</Text>
        <View style={{ flex: 0, flexDirection:'row', gap:5, justifyContent: 'center', alignItems: 'flex-end' }}>
          <View style={{ flex: 0, gap: 5, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{ fontSize: 18 }}>Filtrer par:</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedType(value)}
            useNativeAndroidPickerStyle={false}
            fixAndroidTouchableBug
            placeholder={{ label: 'Choisir un filtre', value: null }}
            value={selectedType}
            style={{ inputAndroid: { minWidth: '20%', height: 40, borderColor: 'gray', borderWidth: 1, borderStyle: 'solid', borderRadius: 10, padding: 10 }, inputIOS: { minWidth: '20%', height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 } }}
            items={categories}
          />
          </View>
        <TextInput style={{ width: '70%', height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                    placeholder="Rechercher un produit" value={search} onChangeText={(text) => setSearch(text)} />
        </View>

        <FlatList data={products} renderItem={(item) => renderProduct(item)} keyExtractor={(item) => item.id} />
      </View>
      <View style={{ flex: 0, justifyContent: 'flex-end', alignItems: 'center', marginVertical: 20 }}>
        <TouchableOpacity style={{ backgroundColor: 'limegreen', padding: 12, borderRadius: 10 }}
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
