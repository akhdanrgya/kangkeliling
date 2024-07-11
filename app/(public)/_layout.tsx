import React, {useState, useEffect} from "react"
import { Stack, Slot } from "expo-router"

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name="signIn"/>
        <Stack.Screen name="signUp"/>
    </Stack>
  )
}

export default _layout