import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const UpdateProduct = ({ route, navigation }) => {
  const { product } = route.params; // Récupère les détails du produit sélectionné

  // Assurez-vous que les valeurs initiales sont toujours définies, même si le produit n'a pas de quantité ou de prix
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [quantity, setQuantity] = useState(product?.quantity ? product.quantity.toString() : '0');
  const [price, setPrice] = useState(product?.price ? product.price.toString() : '0');

  const handleUpdate = async () => {
    try {
      const updatedProduct = {
        ...product,
        name,
        description,
        quantity: parseInt(quantity),
        price: parseFloat(price),
      };

      // Appel API pour mettre à jour le produit
      await axios.put(`http://192.168.1.74:5000/products/${product.id}`, updatedProduct);

      // Retourne à la liste des produits après la modification
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la modification du produit', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nom du produit"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantité"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Prix"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Mettre à jour le produit" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default UpdateProduct;
