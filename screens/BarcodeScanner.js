import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

const BarcodeScanner = ({ onBarcodeDetected }) => {
  const [barcode, setBarcode] = useState(null);

  const handleBarCodeRead = (event) => {
    if (event.data !== barcode) {
      setBarcode(event.data);
      onBarcodeDetected(event.data); // Passer les données à la fonction de gestion
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        onBarCodeRead={handleBarCodeRead}
        captureAudio={false}
        type={RNCamera.Constants.Type.back}
        barCodeTypes={[RNCamera.Constants.BarCodeType.ean13, RNCamera.Constants.BarCodeType.upc]}
      >
        <View style={styles.overlay}>
          <Text style={styles.barcodeText}>{barcode ? `Code-barres : ${barcode}` : 'Scannez un code-barres'}</Text>
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeText: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
});

export default BarcodeScanner;
