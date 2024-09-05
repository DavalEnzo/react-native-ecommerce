import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  // Réduction de la quantité
  const reduceQuantity = (item) => {
    const newPanierItems = panierItems.map((panierItem) => {
      if (panierItem.id === item.id) {
        if (panierItem.quantite > 1) {
          panierItem.quantite -= 1;
          decrementCartItems(1);
        }
      }
      return panierItem;
    });

    AsyncStorage.setItem('panier', JSON.stringify(newPanierItems)).then(() => {
      setPanierItems(newPanierItems);
    });
  };

  // Augmentation de la quantité
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
  };

  // Suppression d'un produit
  const deleteProduct = (item) => {
    const newPanierItems = panierItems.filter((panierItem) => panierItem.id !== item.id);

    if (item.quantite > 0) {
      decrementCartItems(item.quantite);
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
  };

  const renderPanierItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.reduceButton} onPress={() => reduceQuantity(item)}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>Quantité: {item.quantite}</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => addQuantity(item)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteProduct(item)}>
          <Text style={styles.buttonText}>Supprimer du panier</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {panierItems.length > 0 ? (
        <FlatList
          data={panierItems}
          renderItem={renderPanierItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 10 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Votre panier est vide</Text>
          <MaterialCommunityIcons name="cart-off" size={70} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 30,
  },
  itemImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reduceButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: 'green',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
  },
  emptyText: {
    fontSize: 30,
  },
});
