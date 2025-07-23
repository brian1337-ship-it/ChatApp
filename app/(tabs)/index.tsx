import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-red-300">
      <Text className="font-roboto-regular">Tribe Single-Room Chat App</Text>
    </SafeAreaView>
  );
}
