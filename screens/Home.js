import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import axios from 'axios';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Home({ navigation }) {
  const [products, setProducts] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0); // État pour le nombre d'articles dans le panier
  const [searchQuery, setSearchQuery] = useState(''); // État pour la recherche
  const [searchType, setSearchType] = useState('produit'); // Type de recherche : produit ou catégorie
  const isFocused = useIsFocused();

  useEffect(() => {
    // Charger le nombre d'articles dans le panier depuis AsyncStorage
    const loadCart = async () => {
      try {
        const panier = await AsyncStorage.getItem('panier');
        const panierItems = panier ? JSON.parse(panier) : [];
        const totalItems = panierItems.reduce((total, item) => total + item.quantite, 0);
        setCartItemsCount(totalItems); // Met à jour le compteur du panier
      } catch (e) {
        console.log(e);
      }
    };

    loadCart();
  }, [isFocused]);

  // Fonction pour ajouter un produit au panier et le stocker dans AsyncStorage
  const addToPanier = async (product) => {
    try {
      const panier = await AsyncStorage.getItem('panier');
      let panierItems = panier ? JSON.parse(panier) : [];

      // Vérifier si le produit existe déjà dans le panier
      const existingProduct = panierItems.find((item) => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantite += 1; // Incrémente la quantité si le produit est déjà dans le panier
      } else {
        product.quantite = 1; // Ajoute le produit au panier avec une quantité de 1
        panierItems.push(product);
      }

      await AsyncStorage.setItem('panier', JSON.stringify(panierItems)); // Enregistre le panier mis à jour
      const totalItems = panierItems.reduce((total, item) => total + item.quantite, 0);
      setCartItemsCount(totalItems); // Met à jour le nombre d'articles dans le panier

      // Affiche un message de succès
      Toast.show({
        type: 'success',
        text1: `${product.name} a été ajouté au panier !`,
        visibilityTime: 2000,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Fonction pour effectuer une recherche par nom ou catégorie
  const fetchProducts = async () => {
    try {
      let url = `http://10.0.2.2:5000/products`;
      if (searchQuery) {
        url = `http://10.0.2.2:5000/products/${searchType}/${searchQuery}`;
      }
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isFocused) fetchProducts();
  }, [isFocused]);

  const renderProduct = ({ item }) => {
    return (
      <View style={{ justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: 'lightgray', borderRadius: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 30 }}>{item.name}</Text>
        <Image source={{ uri: item.image }} style={{ width: 200, height: 200, borderRadius: 10, marginVertical: 10 }} />
        <View style={styles.buttonContainer}>
          {/* Ajouter au panier */}
          <TouchableOpacity style={{ backgroundColor: 'limegreen', padding: 12, borderRadius: 10 }} onPress={() => addToPanier(item)}>
            <MaterialCommunityIcons name={"cart-plus"} size={20} color={"white"} />
            <Text style={styles.buttonText}>Ajouter au panier</Text>
          </TouchableOpacity>
  
          {/* Détails du produit */}
          <TouchableOpacity style={styles.modifyButton} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
            <Text style={styles.buttonText}>Détails</Text>
          </TouchableOpacity>
  
          {/* Modifier le produit */}
          <TouchableOpacity style={styles.modifyButton} onPress={() => navigation.navigate('UpdateProduct', { product: item })}>
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Bienvenue chez Easy Shop</Text>

        {/* Affichage du panier dans l'en-tête */}
        <TouchableOpacity style={styles.cartIconContainer} onPress={() => navigation.navigate('Panier')}>
          <MaterialCommunityIcons name={"cart"} size={30} color={"dodgerblue"} />
          {cartItemsCount > 0 && (
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>{cartItemsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Champ de recherche */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchProducts}>
          <Text style={styles.buttonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      {products.length > 0 ? (
        <FlatList data={products} renderItem={renderProduct} keyExtractor={(item) => item.id.toString()} />
      ) : (
        <View style={styles.noProductContainer}>
          <Text style={styles.noProductText}>Aucun produit trouvé pour "{searchQuery}"</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddProduct', { name: searchQuery })}>
            <Text style={styles.buttonText}>Ajouter "{searchQuery}" comme nouveau produit</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{flex: 0, justifyContent: 'flex-end', alignItems: 'center', marginVertical: 20}}>
        <TouchableOpacity style={{backgroundColor: 'limegreen', padding: 12, borderRadius: 10}} onPress={() => navigation.navigate('AddProduct')}>
          <Text style={styles.buttonText}>Ajouter un produit</Text>
        </TouchableOpacity>
        {/* Boutons pour accéder aux statistiques de vente et aux alertes de réapprovisionnement */}
        <TouchableOpacity style={{backgroundColor: 'dodgerblue', padding: 12, borderRadius: 10, marginTop: 10}} onPress={() => navigation.navigate('SalesStatistics')}>
          <Text style={styles.buttonText}>Statistiques de Vente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: 'orange', padding: 12, borderRadius: 10, marginTop: 10}} onPress={() => navigation.navigate('RestockAlerts')}>
          <Text style={styles.buttonText}>Alertes de Réapprovisionnement</Text>
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
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  cartIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  cartCountBadge: {
    position: 'absolute',
    right: -5,
    top: -10,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: 'white',
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: 'dodgerblue',
    padding: 12,
    borderRadius: 10,
  },
  noProductContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noProductText: {
    fontSize: 20,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'limegreen',
    padding: 12,
    borderRadius: 10,
  },
});
