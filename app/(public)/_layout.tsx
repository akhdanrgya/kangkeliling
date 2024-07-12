import { Stack } from "expo-router";
import OnBoardHeader from "@/components/onBoardHeader";

export default function AuthRoutesLayout() {

  return (
    <Stack>
      <Stack.Screen
        name="signIn"
        options={{ header: () => <OnBoardHeader />, headerTransparent: true }}
      />
      <Stack.Screen
        name="signUp"
        options={{ header: () => <OnBoardHeader />, headerTransparent: true }}
      />
    </Stack>
  );
}
