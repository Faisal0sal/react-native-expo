import { Text, View } from '../components/Themed';
import { Button, TouchableHighlight, TextInput, Image } from 'react-native'
import { StyleSheet } from 'react-native';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import { GetStore, RemoveStore, SetStore } from '../components/Store';

const DetailsScreen = ({navigation }: {navigation: any}) => {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [branchName, setBranchName] = useState(null);
  const [brandName, setBrandName] = useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => {

          RemoveStore('brandUser')
          RemoveStore('secure_token')
          RemoveStore('branch')

          navigation.replace('Login')
        }} title="Sign Out" />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted')
    })()
  }, [])

  GetStore('branch').then(_branch => {
    let branch = JSON.parse(_branch)
    setBranchName(branch.name)
  })

  GetStore('brandUser').then(_brand => {
    let brand = JSON.parse(_brand)
    setBrandName(brand.name)
  })

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  const onPlaceChosen = (params: any) => {
    navigation.push('CardControl', {id: params})
  }

  return (
    <View style={styles.container}>
      <View style={styles.brand_details_container}>
        <View>
          <Image
            style={styles.tinyLogo}
            source={require('../assets/images/white_background.png')}
          />
        </View>
        <View style={{ alignContent: 'center' }}>
          <Text>Logged in as: </Text>
          <Text style={{ color: '#7A61E4', fontWeight: 'bold' }}>{brandName}</Text>
          <Text style={{ color: '#000', fontWeight: 'bold' }}>{branchName}</Text>
        </View>
      </View>
      <TouchableHighlight style={styles.scanButton} onPress={() => {
          navigation.push('Camera', { onPlaceChosen })
        }}>
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.0)' }}>
          <Icon
              style={{ width: 100, height: 100, fontSize: 26 }}
              size={55}
              name='qr-code-scanner'
              type='material'
              color='#fff'
            />
          <Text style={{ fontSize: 30, fontWeight: '500', color: 'white', textAlign: 'center' }}>Scan</Text>
        </View>
      </TouchableHighlight>
    </View>
  )
}

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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