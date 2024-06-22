
import React from 'react'
import { Tabs } from 'expo-router'
import {Stack, Slot} from 'expo-router'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
      name='index' options={{headerShown : false}}
      />
    </Stack>
  )
}

export default _layout