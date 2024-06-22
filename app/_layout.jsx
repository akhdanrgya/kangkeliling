import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '../components/tabBar'

const _layout = () => {
  return (
    <Tabs
    tabBar={props => <TabBar {...props} />}
    >
        <Tabs.Screen
        name='home'
        options={{
            title : "Home"
        }}
        />
        <Tabs.Screen
        name='explore'
        options={{
            title : "Explore"
        }}
        />
        <Tabs.Screen
        name='profile'
        options={{
            title : "Profile"
        }}
        />
    </Tabs>
  )
}

export default _layout