import { Text, View } from '../components/Themed';
import { Button, TouchableHighlight, TextInput, Image } from 'react-native'
import { StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { renderNode, ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import React, { useState, useEffect } from 'react';
// import { fetchPosts } from '../components/Network';
import * as SecureStore from 'expo-secure-store';
import { Response } from '../Models/ScanResponse';
import moment from 'moment'

async function fetchScanDetails(barcode: string) {

  const token = await SecureStore.getItemAsync("secure_token")

  const jsonValue = await SecureStore.getItemAsync("brandUser")
  const brandUser = jsonValue != null ? JSON.parse(jsonValue) : null;

  const jsonValueBranch = await SecureStore.getItemAsync("branch")
  const branch = jsonValueBranch != null ? JSON.parse(jsonValueBranch) : null;
  
  // const brandUser = jsonValue != null ? JSON.parse(jsonValue) : null;

  const body = { "brandId": brandUser.id }

  const bearer = "Bearer " + token;

  let option = {
    "method": "POST",
    "headers": {
      "Authorization": bearer,
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ "BarCode": barcode, "BranchId": branch.id })
  }

  const response = await fetch('https://loyapro.com/api2/brand/scan_card', option)

  const json = await response.json()

  if (json.status != 200) {
    return Promise.reject(json.response.error);
  }

  return json.response;
}

async function RedeemDiscount(customer_id: number | undefined, branch_id: number, brand_id: number | undefined, stamps: number, rewards_ids: number[]) {

  try {

    const token = await SecureStore.getItemAsync("secure_token")

    const jsonValue = await SecureStore.getItemAsync("brandUser")
    const brandUser = jsonValue != null ? JSON.parse(jsonValue) : null;

    const jsonValueBranch = await SecureStore.getItemAsync("branch")
    const branch = jsonValueBranch != null ? JSON.parse(jsonValueBranch) : null;

    const dataRequest = {
      "CustomerId": customer_id,
      "BranchId": branch.id,
      "BrandId": brand_id,
      "Stamps": stamps,
      "RewardsIds": rewards_ids
    }

    console.log(JSON.stringify(dataRequest))

    const bearer = "Bearer " + token;

    let option = {
      "method": "POST",
      "headers": {
        "Authorization": bearer,
        "Content-Type": "application/json"
      },
      "body": JSON.stringify(dataRequest)
    }

    const response = await fetch('https://loyapro.com/api2/brand/redeem_discount', option)

    const json = await response.json()    

    return Promise.resolve(json.response);

  } catch (err) {

    console.log(err)
    return Promise.reject(err)
  }
}

async function addStamps(customer_id: number | undefined, branch_id: number, brand_id: number | undefined, stamps: number, rewards_ids: number[]) {

  try {

    const token = await SecureStore.getItemAsync("secure_token")

    const jsonValue = await SecureStore.getItemAsync("brandUser")
    const brandUser = jsonValue != null ? JSON.parse(jsonValue) : null;

    const jsonValueBranch = await SecureStore.getItemAsync("branch")
    const branch = jsonValueBranch != null ? JSON.parse(jsonValueBranch) : null;

    const dataRequest = {
      "CustomerId": customer_id,
      "BranchId": branch.id,
      "BrandId": brand_id,
      "Stamps": stamps,
      "RewardsIds": rewards_ids
    }

    const bearer = "Bearer " + token;

    let option = {
      "method": "POST",
      "headers": {
        "Authorization": bearer,
        "Content-Type": "application/json"
      },
      "body": JSON.stringify(dataRequest)
    }

    const response = await fetch('https://loyapro.com/api2/brand/add_stamps', option)

    const json = await response.json()    

    return Promise.resolve(json.response);

  } catch (err) {

    console.log(err)
    return Promise.reject(err)
  }
}

const CardControlScreen = ({route, navigation}:{route: any, navigation: any}) => {

  const { id } = route.params;

  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [scanDetailsData, setScanDetails] = useState<Response>()
  const [isLoading, setLoading] = useState(true)
  const [isSubmissionLoading, setSubmissionLoading] = useState(false)
  const [stamps, setStamps] = useState(0)
  const [rewards, setRewards] = useState(0)

  useEffect(() => {
    (async () => {
      try {

        const data = await fetchScanDetails(id)

        setScanDetails(data)
        
        setLoading(false)

      } catch (error) {

        alert(error)
        navigation.goBack()
      }
      
    })()
  }, [])

  function formatDate(date: any) {
    return moment(date).utcOffset('+0300').format('YYYY-MM-DD HH:mm')
  }

  async function Redeem() {

    setSubmissionLoading(true)

    var _rewardIds: number[] = []
    if (rewards > 0) {
      for (let index = 0; index < rewards; index++) {
        _rewardIds.push(1)
      }
    }

    console.log(rewards)
    

    RedeemDiscount(
      scanDetailsData?.id,
      17,
      scanDetailsData?.brandId,
      stamps,
      _rewardIds
      )
      .then(res => {

        if (!res.success) {
          alert(res.error)
        }else{
          alert("Success")
        }

      }).catch(err => {
        console.log(err)
        alert(err.message)
      }).finally(() => {
        navigation.goBack()
        setSubmissionLoading(false)
      })
  }

  async function SubmitStamps() {

    setSubmissionLoading(true)

    var _rewardIds: number[] = []
    if (rewards > 0) {
      _rewardIds = [1]
    }

    addStamps(
      scanDetailsData?.id,
      17,
      scanDetailsData?.brandId,
      stamps,
      _rewardIds
      )
      .then(res => {

        if (!res.success) {
          alert(res.error)
        }else{
          alert("Success")
        }

      }).catch(err => {
        console.log(err)
        alert(err.message)
      }).finally(() => {
        navigation.goBack()
        setSubmissionLoading(false)
      })
  }

  function _setStamps(add: boolean) {
    if (!add && stamps != 0) {
      setStamps(stamps - 1)
    }else if (add) {
      setStamps(stamps + 1)
    }
  }

  function _setRewards(add: boolean) {

    var earned: Number = scanDetailsData?.rewardEarned ?? 0

    if (scanDetailsData?.type != 0) {
      earned = scanDetailsData?.campaign.maxUsages ?? 1000
    }
    
    if (add && rewards < earned) {
      setRewards(rewards + 1)
    }else if (!add && rewards != 0) {
      setRewards(rewards - 1)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator/>
      </View>
    )
  }

  const DiscountCard = () => {
    return (
      <View>
        {/* Section Head */}
        <View style={styles.section_head}>
          <Image
          style={{ flex: 1, resizeMode: 'center' }}
          source={{ uri: scanDetailsData?.stripeImage }}></Image>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Campaign Details</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Name</Text>
          </View>
          <View style={[styles.rows, styles.rows_value, { backgroundColor: '#A79350'}]}>
            <Text style={styles.text_value}>{scanDetailsData?.campaign.name}</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Discount Type</Text>
          </View>
          <View style={[styles.rows, styles.rows_value, { backgroundColor: '#A79350'}]}>
            <Text style={styles.text_value}>
              { scanDetailsData?.campaign.discountType == 0 ? 'Fixed' : 'Percentage' }
            </Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Amount</Text>
          </View>
          <View style={[styles.rows, styles.rows_value, { backgroundColor: '#A79350'}]}>
            <Text style={styles.text_value}>{scanDetailsData?.campaign.discountAmount}{scanDetailsData?.campaign.discountType == 0 ? ' SAR' : '%'}</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Max Usages</Text>
          </View>
          <View style={[styles.rows, styles.rows_value, { backgroundColor: '#A79350'}]}>
            <Text style={styles.text_value}>{scanDetailsData?.campaign.maxUsages}</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>End Date</Text>
          </View>
          <View style={[styles.rows, styles.rows_value, { backgroundColor: '#A79350'}]}>
            <Text style={styles.text_value}>{formatDate(scanDetailsData?.campaign.endDate)}</Text>
          </View>
        </View>
        
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Details</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>ID</Text>
          </View>
          <View style={[styles.rows, styles.rows_value]}>
            <Text style={styles.text_value}>{scanDetailsData?.id}</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Name</Text>
          </View>
          <View style={[styles.rows, styles.rows_value]}>
            <Text style={styles.text_value}>{scanDetailsData?.name}</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Rewards Redeemed</Text>
          </View>
          <View style={[styles.rows, styles.rows_value]}>
            <Text style={styles.text_value}>{scanDetailsData?.balance}</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Available Usages</Text>
          </View>
          <View style={[styles.rows, styles.rows_value]}>
            <Text style={styles.text_value}>{scanDetailsData?.availableUsages}</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>End Date</Text>
          </View>
          <View style={[styles.rows, styles.rows_value]}>
            <Text style={styles.text_value}>{ formatDate(scanDetailsData?.expiryDate)}</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Discount Code</Text>
          </View>
          <View style={[styles.rows, styles.rows_value]}>
            <Text style={styles.text_value}>{scanDetailsData?.discountCode}</Text>
          </View>
        </View>

        {/* Redeems */}
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Redeem Rewards</Text>
          </View>
        </View>
        <View style={styles.section_footer}>
          <TouchableHighlight style={[styles.scanButton, styles.add_button]} onPress={() => {
            _setRewards(false)
              // navigationn.push('ControlScreen')
              // navigation.push('Camera')
            }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
              <Text style={{ fontSize: 36, fontWeight: '500', color: 'white', textAlign: 'center' }}>-</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={[styles.scanButton, styles.remove_button]} onPress={() => {
              _setRewards(true)
              // navigationn.push('ControlScreen')
              // navigation.push('Camera')
            }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
              <Text style={{ fontSize: 36, fontWeight: '500', color: 'white', textAlign: 'center' }}>+</Text>
            </View>
          </TouchableHighlight>
          <View style={styles.section_counter}>
            <Text style={{ fontSize: 32, fontWeight: '500', color: 'black'}}>{rewards}</Text>
          </View>
        </View>
        <View style={ styles.section_footer }>
          <TouchableHighlight disabled={isSubmissionLoading} style={[styles.scanButton, { backgroundColor: !isSubmissionLoading ? '#5546A1' : 'black' }]} onPress={() => {
              Redeem()
              // navigationn.push('ControlScreen')
              // navigation.push('Camera')
            }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
              <Text style={{ fontSize: 26, fontWeight: '500', color: 'white', textAlign: 'center' }}>Submit</Text>
            </View>
          </TouchableHighlight>
        </View>

      </View>
    )
  }

  const StampsCard = () => {
    return (
      <View>
        
        {/* Section Head */}
        <View style={styles.section_head}>
          <Image
          style={{ flex: 1, resizeMode: 'center' }}
          source={{ uri: scanDetailsData?.stripeImage }}></Image>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Details</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>ID</Text>
          </View>
          <View style={[styles.rows, styles.rows_value]}>
            <Text style={styles.text_value}>{scanDetailsData?.id}</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Name</Text>
          </View>
          <View style={[styles.rows, styles.rows_value]}>
            <Text style={styles.text_value}>{scanDetailsData?.name}</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Current Balance</Text>
          </View>
          <View style={[styles.rows, styles.rows_value]}>
            <Text style={styles.text_value}>{scanDetailsData?.balance}</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Life Time Balance</Text>
          </View>
          <View style={[styles.rows, styles.rows_value]}>
            <Text style={styles.text_value}>{scanDetailsData?.lifeTimeBalance}</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>ٌRewards Available</Text>
          </View>
          <View style={[styles.rows, styles.rows_value]}>
            <Text style={styles.text_value}>{scanDetailsData?.rewardEarned}</Text>
          </View>
        </View>
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>ٌRewards Redeemed</Text>
          </View>
          <View style={[styles.rows, styles.rows_value]}>
            <Text style={styles.text_value}>{scanDetailsData?.rewardIssued}</Text>
          </View>
        </View>

        {/* Stamps Control */}
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Add Stamps</Text>
          </View>
        </View>
        <View style={styles.section_footer}>
          <TouchableHighlight style={[styles.scanButton, styles.add_button]} onPress={() => {
            _setStamps(false)
              // navigationn.push('ControlScreen')
              // navigation.push('Camera')
            }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
              <Text style={{ fontSize: 36, fontWeight: '500', color: 'white', textAlign: 'center' }}>-</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={[styles.scanButton, styles.remove_button]} onPress={() => {
              _setStamps(true)
              // navigationn.push('ControlScreen')
              // navigation.push('Camera')
            }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
              <Text style={{ fontSize: 36, fontWeight: '500', color: 'white', textAlign: 'center' }}>+</Text>
            </View>
          </TouchableHighlight>
          <View style={styles.section_counter}>
            <Text style={{ fontSize: 32, fontWeight: '500', color: 'black'}}>{stamps}</Text>
          </View>
        </View>

        {/* Redeems */}
        <View style={styles.sections}>
          <View style={styles.rows}>
            <Text style={styles.text_title}>Redeem Rewards</Text>
          </View>
        </View>
        <View style={styles.section_footer}>
          <TouchableHighlight style={[styles.scanButton, styles.add_button]} onPress={() => {
            _setRewards(false)
              // navigationn.push('ControlScreen')
              // navigation.push('Camera')
            }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
              <Text style={{ fontSize: 36, fontWeight: '500', color: 'white', textAlign: 'center' }}>-</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={[styles.scanButton, styles.remove_button]} onPress={() => {
              _setRewards(true)
              // navigationn.push('ControlScreen')
              // navigation.push('Camera')
            }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
              <Text style={{ fontSize: 36, fontWeight: '500', color: 'white', textAlign: 'center' }}>+</Text>
            </View>
          </TouchableHighlight>
          <View style={styles.section_counter}>
            <Text style={{ fontSize: 32, fontWeight: '500', color: 'black'}}>{rewards}</Text>
          </View>
        </View>
        <View style={ styles.section_footer }>
          <TouchableHighlight disabled={isSubmissionLoading} style={[styles.scanButton, { backgroundColor: !isSubmissionLoading ? '#5546A1' : 'black' }]} onPress={() => {
              SubmitStamps()
              // navigationn.push('ControlScreen')
              // navigation.push('Camera')
            }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
              <Text style={{ fontSize: 26, fontWeight: '500', color: 'white', textAlign: 'center' }}>Submit</Text>
            </View>
          </TouchableHighlight>
        </View>

      </View>
    )
  }

  const renderControlView = () => {

    switch (scanDetailsData?.type) {
      case 0:
        return (
          StampsCard()
        )
      case 1:
        return (
          DiscountCard()
        )
      case 2:
        return (
          DiscountCard()
        )
      default:
        return (
          StampsCard()
        )
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        {renderControlView()}
      </ScrollView>
    </View>
  )
}

export default CardControlScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  section_head: {
    flex: 1,
    height: 200,
    backgroundColor: '#fff',
    borderColor: 'white',
    borderWidth: 2,
    flexDirection: 'row'
  },
  sections: {
    flex: 1,
    height: 40,
    borderColor: 'black',
    flexDirection: 'row'
  },
  rows: {
    flex: 1,
    backgroundColor: '#E1E1E1',
    borderColor: 'white',
    borderWidth: 3,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    borderRadius: 10
  },
  rows_value: {
    backgroundColor: '#0EAA7B',
    color: 'white'
  },
  text_title: {
    textAlign: 'left',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 15
  },
  text_value: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    color: 'white'
  },
  scanButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    margin: 12,
  },
  section_buttons: {
    flex: 1,
    height: 85,
    flexDirection: 'row'
  },
  section_footer: {
    flex: 1,
    height: 85,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 0,
    flexDirection: 'row'
  },
  section_counter: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    margin: 12
  },
  add_button: {
    backgroundColor: '#DC4B49'
  },
  remove_button: {
    backgroundColor: '#0684FE'
  }
})
