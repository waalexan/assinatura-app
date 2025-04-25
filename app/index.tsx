import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Ver assinatura1" onPress={() => router.push("/assinatura1")} />
      <Button title="assinar1" onPress={() => router.push("/tela1")} />

      <Text>Outro</Text>
      <Button title="Ver assinaturaw" onPress={() => router.push("/assinatura2")} />
      <Button title="assinar2" onPress={() => router.push("/tela2")} />
    </View>
  );
}
