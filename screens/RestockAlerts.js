import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const RestockAlerts = () => {
  const [restockData, setRestockData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestockData = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:5000/restock');
        setRestockData(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des alertes de réapprovisionnement');
        console.log(error);
      }
    };

    fetchRestockData();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alertes de Réapprovisionnement</Text>
      {restockData.length > 0 ? (
        restockData.map((item, index) => (
          <View key={index} style={styles.alertBox}>
            <Text>{item.product_name}</Text>
            <Text>Stock restant : {item.remaining_stock}</Text>
            <Text>Seuil de réapprovisionnement : {item.threshold}</Text>
          </View>
        ))
      ) : (
        <Text>Chargement des données...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  alertBox: {
    backgroundColor: 'lightyellow',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default RestockAlerts;
