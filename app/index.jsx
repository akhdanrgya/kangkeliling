import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Link } from 'expo-router'

const App = () => {
  return (
    <View style={style.container}>
      <Text>KangKeliling!</Text>
      <Link href='/profile' style={{color : 'blue'}}>
        Go To Profile
      </Link>
    </View>
  )
}

const style = StyleSheet.create({
  container : {
    justifyContent : 'center',
    alignItems : 'center',
    display : 'flex',
    flex : 1
  }
})

export default App