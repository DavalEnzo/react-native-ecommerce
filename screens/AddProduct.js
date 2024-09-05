import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const AddProduct = ({ navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // Fonction pour ajouter un produit via l'API
  const handleSubmit = async () => {
    if (name && price && description) {
      try {
        await axios.post('http://10.0.2.2:5000/products', {
          name,
          price: parseFloat(price),
          description,
        });
        navigation.goBack(); // Retourne à la liste des produits après l'ajout
      } catch (error) {
        console.error('Erreur lors de l\'ajout du produit', error);
      }
    } else {
      alert('Veuillez remplir tous les champs.');
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
        placeholder="Prix"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title="Ajouter le produit" onPress={handleSubmit} />
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

export default AddProduct;
