import { Link, Stack } from "expo-router";
import { View } from "react-native";

export default function Index() {
  return (
    <>
      <Stack.Screen options={{ headerTitle: "Oops! Not Found" }} />
      <View className="flex-1 items-center justify-center">
        <Link href="/index" className="underline text-blue-500 text-xl">
          Return to Home Screen
        </Link>
      </View>
    </>
  );
}
