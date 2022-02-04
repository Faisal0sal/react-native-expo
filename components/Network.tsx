import * as SecureStore from 'expo-secure-store';

export async function fetchPosts() {

  let token = await SecureStore.getItemAsync("secure_token")

  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdWJ1c2VyQGxveWFwcm8uY29tIiwiVXNlcklEIjoiMiIsImV4cCI6MTY0NTEzMjQ4OSwiaXNzIjoiaHR0cHM6Ly93d3cubG95YXByby5jb20iLCJhdWQiOiJodHRwczovL3d3dy5sb3lhcHJvLmNvbSJ9.toBeI_MrXvPbndFtx4zHVQ1v2Ndt7ygmjvOMxkEiYso"

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
    "body": JSON.stringify({ "BranchId": 17 })
  }

  console.log(option)

  const response = await fetch('https://loyapro.com/api2/brand/scan_card', option)
  
  const json = await response.json()

  if (json.status !== 200) {
    console.log("Request rejected")
    throw new Error("Request rejected")
  }

  return json.response.branches.value;
}