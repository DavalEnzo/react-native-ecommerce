import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Panier({ navigation, decrementCartItems, clearCartItems }) {
  const [panierItems, setPanierItems] = useState([]);

  useEffect(() => {
    const fetchPanierItems = async () => {
      try {
        const panier = await AsyncStorage.getItem('panier');
        if (panier) {
          setPanierItems(JSON.parse(panier));
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchPanierItems();
  }, []);

  const reduceQuantity = (item) => {
    const newPanierItems = panierItems.map((panierItem) => {
      if (panierItem.id === item.id) {
        panierItem.quantite -= 1;
        decrementCartItems(1);
      }

      return panierItem;
    });

    AsyncStorage.setItem('panier', JSON.stringify(newPanierItems)).then(() => {
      setPanierItems(newPanierItems);
    });
  };

  const addQuantity = (item) => {
    const newPanierItems = panierItems.map((panierItem) => {
      if (panierItem.id === item.id) {
        panierItem.quantite += 1;
      }

      return panierItem;
    });

    AsyncStorage.setItem('panier', JSON.stringify(newPanierItems)).then(() => {
      setPanierItems(newPanierItems);
    });
  }

  function deleteProduct(item) {
    const newPanierItems = panierItems.filter((panierItem) => panierItem.id !== item.id);

    if (item.quantite > 1) {
      decrementCartItems(item.quantite - 1);
    }

    if (newPanierItems.length === 0) {
      AsyncStorage.removeItem('panier').then(() => {
        setPanierItems([]);
        clearCartItems();
        Alert.alert('Panier vidé');
        navigation.navigate('Home');
      });
      return;
    }

    AsyncStorage.setItem('panier', JSON.stringify(newPanierItems)).then(() => {
      setPanierItems(newPanierItems);
    });
  }

  const renderPanierItem = ({ item }) => {
    return (
      <View style={{flex:1, gap:20, justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: 'lightgray', borderRadius: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 30 }}>{item.name}</Text>
        <Image source={{ uri: item.image }} style={{ width: 200, height: 200, borderRadius: 10, marginVertical: 10 }} />
        <View style={{flex: 1, gap: 10, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={{backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, alignItems: 'center'}} onPress={() => reduceQuantity(item)}>
            <Text style={{color: 'white', fontSize: 20}}>-</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20 }}>Quantité: {item.quantite}</Text>
          <TouchableOpacity style={{backgroundColor: 'green', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, alignItems: 'center'}} onPress={() => addQuantity(item)}>
            <Text style={{color: 'white', fontSize: 20}}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteProduct(item)}>
            <Text style={styles.buttonText}>Supprimer du panier</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {panierItems.length > 0 ? (
      <FlatList
        data={panierItems}
        renderItem={renderPanierItem}
        keyExtractor={(item, index) => index}
        contentContainerStyle={{ padding: 10 }}
      /> ) : (
        <View style={{flex:0, alignItems: 'center', gap: 25}}>
          <Text style={{ fontSize: 30 }}>Votre panier est vide</Text>
          <MaterialCommunityIcons name="cart-off" size={70} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});
