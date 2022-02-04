import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import BranchesListScreen from './screens/BranchesListScreen';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import ScanScreen from './screens/ScanScreen';
import CameraScreen from './screens/CameraScreen';
import Navigation from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Button, Text, Alert } from 'react-native';
import CardControlScreen from './screens/CardControlScreen';
import { GetStore } from './components/Store';

export default function App() {
  
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [token, setToken] = useState<string | null>("");
  const [branchId, setBranchId] = useState<string | null>("");

  GetStore('token').then(token => {
    setToken(token)
  })

  GetStore('branch').then(_branch => {
    let branch = JSON.parse(_branch)
    setBranchId(branch.id)
  })

  const Stack = createNativeStackNavigator();

  let initialRouteName = "Login"

  if (token) {
    initialRouteName = "Branches"
  }

  if (branchId) {
    initialRouteName = "Scan"
  }

  // initialRouteName = "CardControl"

  if (!isLoadingComplete) {
    return null;
  }else{
    return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
        initialRouteName={initialRouteName}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Branches" component={BranchesListScreen} />
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="CardControl" component={CardControlScreen} />
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Camera" component={CameraScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar />
    </SafeAreaProvider>
    )
  }
}
