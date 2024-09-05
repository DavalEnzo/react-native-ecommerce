import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params || {}; // S'assure que route.params n'est pas undefined

  // Si le produit n'est pas défini, affichez un message d'erreur
  if (!product || !product.name) {
    return (
      <View style={styles.container}>
        <Text>Produit non disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom du produit :</Text>
      <Text style={styles.value}>{product.name}</Text>

      <Text style={styles.label}>Description :</Text>
      <Text style={styles.value}>{product.description}</Text>

      <Text style={styles.label}>Quantité :</Text>
      <Text style={styles.value}>{product.quantity}</Text>

      <Text style={styles.label}>Prix :</Text>
      <Text style={styles.value}>{product.price} €</Text>

      <Button
        title="Modifier le produit"
        onPress={() => navigation.navigate('UpdateProduct', { product })}
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
