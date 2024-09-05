import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params;
  const [productDetails, setProductDetails] = useState(product);

  // Fonction pour rafraîchir les données du produit
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:5000/products/${product.id}`);
      setProductDetails(response.data);
    } catch (error) {
      console.log("Erreur lors de la récupération des détails du produit", error);
    }
  };

  // Utiliser useEffect pour actualiser les détails du produit après modification
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProductDetails(); // Rafraîchir les données du produit quand la page est en focus
    });

    return unsubscribe; // Nettoie l'écouteur lorsque le composant est démonté
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom du produit :</Text>
      <Text style={styles.value}>{productDetails.name}</Text>

      <Text style={styles.label}>Description :</Text>
      <Text style={styles.value}>{productDetails.description}</Text>

      <Text style={styles.label}>Quantité :</Text>
      <Text style={styles.value}>{productDetails.quantity}</Text>

      <Text style={styles.label}>Prix :</Text>
      <Text style={styles.value}>{productDetails.price} €</Text>

      {/* Affichage de l'image */}
      <Image
        source={{ uri: productDetails.image }}
        style={{ width: 200, height: 200, marginTop: 20 }}
      />

      <Button
        title="Modifier le produit"
        onPress={() => navigation.navigate('UpdateProduct', { product: productDetails })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProductDetails;
