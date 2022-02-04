import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { TextInput, Image, Alert, TouchableHighlight, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { SetStore } from '../components/Store';

async function fetchBranches() {
  
  const token = await SecureStore.getItemAsync("secure_token")

  const jsonValue = await SecureStore.getItemAsync("brandUser")
  const brandUser = jsonValue != null ? JSON.parse(jsonValue) : null;

  const body = { "brandId": brandUser.id }

  const bearer = "Bearer " + token;

  let option = {
    "method": "POST",
    "headers": {
      "Authorization": bearer,
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ "brandId": brandUser.id })
  }

  const response = await fetch('https://loyapro.com/api2/brand/branches', option)

  const json = await response.json()

  return json.response.branches.value;
}

export default function BranchesList({navigation}: {navigation: any}) {

  const [key, onChangeKey] = useState<string>('')
  const [value, onChangeValue] = useState<string>('')

  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [token, setToken] = useState<string | null>("")
  const [brandUser, setBrandUser] = useState<any[]>([])

  const getBranches = async () => {
    const branches = await fetchBranches()
    setData(branches)
    setLoading(false)
 }

  useEffect(() => {
    getBranches();
  }, [])

  const ItemRender = ({id, name, navigation}: {id: number, name: any, navigation: any}) => (
    <TouchableOpacity
      onPress={() => {
        SetStore('branch', JSON.stringify({ id: id, name: name }))
        navigation.replace('Scan') 
      }}
    >
      <View style={styles.item}>
        <Text style={styles.itemText}>{name}</Text>
      </View>
    </TouchableOpacity>
  )
 
  const ItemDivider = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#D6D6D6",
        }}
      />
    );
  }

  return (
      <View style={styles.container}>
        {isLoading ? <ActivityIndicator/> : (
          <FlatList
            data={data}
            renderItem={({ item }) => <ItemRender id={item.id} name={item.name} navigation={navigation} />}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={ItemDivider}
          />
        )}
      </View>
  )
}

const styles = StyleSheet.create({
  safeAreaView:{
    backgroundColor:"#ffffff",
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: 0,
    backgroundColor: '#fff'
  },
  item: {
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10
  },
  itemText:{
    fontSize: 20,
    fontWeight: '500',
    color: 'black'
  }
})