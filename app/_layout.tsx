import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="assinatura1" />
      <Stack.Screen name="assinatura2" />
      <Stack.Screen name="tela1" options={{headerShown: false}} />
      <Stack.Screen name="tela2" options={{headerShown: false}} />
    </Stack>
  );
}
