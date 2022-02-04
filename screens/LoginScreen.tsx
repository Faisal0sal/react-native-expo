import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert, Image, KeyboardAvoidingView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';

export default function LoginScreen({navigation}: {navigation: any}) {

  const [isLoading, setLoading] = useState(false)
  
  const { register, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  function save(value: any) {

    SecureStore.setItemAsync('secure_token', value.token)
    SecureStore.setItemAsync('brandUser', JSON.stringify(value.brandUser))
  }

  const onSubmit = (data: any) => {

    setLoading(true)

    fetch("https://loyapro.com/api2/authentication/Login", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify(data)
    })
    .then(r =>  r.json()
    .then(data => ({status: r.status, body: data})))
    .then(obj => {

      if (obj.status != 200) {
        throw new Error("Wrong email or password, try again")
      }

      let response = obj.body.response;
      save(response)

      navigation.replace('Branches')
    })
    .catch(err => {
      console.error(err);
      alert(err.message)
    }).finally(() => {
      setLoading(false)
    })
  }

  const onChange = (arg: any) => {
    return {
      value: arg.nativeEvent.text,
    }
  }

  console.log('errors', errors)

  const keyboardVerticalOffset = Platform.OS === 'ios' ? -100 : 0

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <Image
          style={styles.tinyLogo}
          source={require('../assets/images/white_background.png')}
        />
      <Controller
        control={control}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            placeholder="Email"
          />
        )}
        name="email"
        rules={{ required: true }}
      />
      <Controller
        control={control}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            placeholder="Password"
            secureTextEntry={true}
          />
        )}
        name="password"
        rules={{ required: true }}
      />

      <View style={styles.button}>
        <Button
          color="#fff"
          title="Login"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  label: {
    color: 'black',
    margin: 20,
    marginLeft: 0,
  },
  button: {
    marginTop: 20,
    color: '#fff',
    height: 40,
    backgroundColor: '#7A61E4',
    borderRadius: 4,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    backgroundColor: '#fff',
    alignContent: 'center'
  },
  input: {
    backgroundColor: '#fff',
    borderColor: 'rgba(30, 30, 30, 0.5)',
    borderWidth: 1,
    height: 40,
    padding: 10,
    borderRadius: 4,
    marginTop: 20
  },
  buttonInner: {
  },
  tinyLogo: {
    height: 110,
    width: '100%',
    marginVertical: 30,
    resizeMode: 'contain'
  }
})