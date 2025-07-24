import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { ImageBackground, SafeAreaView, StatusBar, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import backgroundImage from "./assets/images/chat-bg.png";
import "./global.css";

// Prevent splash screen from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    //       black: require("./assets/fonts//Roboto-Black.ttf"),
    //       blackItalic: require("./assets/fonts/Roboto-BlackItalic.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    //       boldItalic: require("./assets/fonts/Roboto-BoldItalic.ttf"),
    "Roboto-Italic": require("./assets/fonts/Roboto-Italic.ttf"),
    //       light: require("./assets/fonts/Roboto-Light.ttf"),
    //       lightItalic: require("./assets/fonts/Roboto-LightItalic.ttf"),
    //       medium: require("./assets/fonts/Roboto-Medium.ttf"),
    //       mediumItalic: require("./assets/fonts/Roboto-MediumItalic.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    //       thin: require("./assets/fonts/Roboto-Thin.ttf"),
    //       thinItalic: require("./assets/fonts/Roboto-ThinItalic.ttf"),
  });

  // Hide splash screen once the layout changes
  const onLayout = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Render nothing until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayout}>
      <StatusBar style="light" />
      <SafeAreaView
        className="flex-1 flex-col bg-black"
        edges={["right", "left", "bottom"]}
      >
        <ImageBackground
          source={backgroundImage}
          className="flex-1"
        ></ImageBackground>
        <Text className="font-roboto-italic text-amber-300">
          Tribe Single-Room Chat App
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
