import * as SecureStore from 'expo-secure-store';

export async function RemoveStore(key:string) {

  await SecureStore.deleteItemAsync(key)

}

export async function SetStore(key:string, value: string) {

  await SecureStore.setItemAsync(key, value)

}

export async function GetStore(key:string) {

  try {
    
    const response = await SecureStore.getItemAsync(key)
 
    console.log(JSON.stringify(response))

    return response;
  } catch (err) {
    return null
  }
}