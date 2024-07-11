import { View, Text, StyleSheet } from 'react-native'
import React, {useState, useEffect} from 'react'
import SplashScreen from './splashScreen'
import { useRouter } from 'expo-router'

const index = () => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => {
      clearTimeout(splashTimeout)
    }
  }, [])

  if(!loading) {
    router.replace('/signIn')
  }

  return (
    <View style = {Style.container}>
      <SplashScreen/>
    </View>
  )
}

const Style = StyleSheet.create({
  container : {
    justifyContent : "center",
    alignItems : 'center',
    display : 'flex',
    flex : 1,
    backgroundColor : '#14213D'
  }


})

export default index