import { View, Text } from 'react-native'
import React, {useState} from 'react'
import SplashScreen from './splashScreen'

const index = () => {
    const [loading, setLoadign] = useState(true)

  return (
    <View>
      <SplashScreen/>
    </View>
  )
}

export default index