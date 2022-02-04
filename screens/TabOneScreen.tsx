import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { TextInput, Image, Alert, TouchableHighlight, ActivityIndicator, FlatList } from "react-native";
import { Button } from 'react-native-elements';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  const getMovies = async () => {
    try {
     const response = await fetch('https://reactnative.dev/movies.json');
     const json = await response.json();
     setData(json.movies);
   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
 }

  useEffect(() => {
    getMovies();
  }, [])

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, padding: 24 }}>
        {isLoading ? <ActivityIndicator/> : (
          <FlatList
            data={data}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (
              <Text>{item.title}, {item.releaseYear}</Text>
            )}
          />
        )}
      </View>
    </View>
  )
}

const text = "Test";
const number = "Test";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
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
  },
  tinyLogo: {
    height: 110,
    width: 190,
    marginVertical: 30,
    resizeMode: 'contain'
  },
  formView: {
    flex:1,
    top: -100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttons: {
    top: 20,
    height: 70,
    width: 370
  }
});
