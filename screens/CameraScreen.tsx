import { Text, View } from '../components/Themed';
import { Button, TouchableHighlight, TextInput, Image } from 'react-native'
import { StyleSheet } from 'react-native';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';

const CameraScreen = ({route, navigation}:{route: any, navigation: any}) => {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted')
    })()
  }, [])

  const handleBarCodeScanned = (data: any) => {
    setScanned(true)

    navigation.goBack()

    route.params.onPlaceChosen(data.data)
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      </View>
      <TouchableHighlight style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }} onPress={() => {
          // handleBarCodeScanned({data: "00000002X00000017X00197656"})
          navigation.goBack()
        }}>
        <Text style={{ textAlign: 'center', color: '#06c', fontSize: 22, textDecorationLine: 'underline' }}>Back</Text>
      </TouchableHighlight>
    </View>
  )
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  brand_details_container: {
    flex: 1,
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tinyLogo: {
    height: 110,
    width: 190,
    marginVertical: 30,
    resizeMode: 'contain'
  },
  scanButton: {
    backgroundColor: '#7A61E4',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    width: '95%',
    marginVertical: 20,
    marginBottom: 50
  },
  input: {
    height:40,
    width: 370,
    borderRadius: 4,
    margin: 12,
    borderWidth: 1,
    borderColor: '#919191',
    fontSize: 18,
    paddingVertical: 0,
    padding: 10
  }
})