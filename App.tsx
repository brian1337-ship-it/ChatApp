import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import backgroundImage from "./assets/images/chat-bg.png";
import "./global.css";
import colors from "./src/constants/colors";

// Prevent splash screen from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [messageText, setMessageText] = useState("");

  // Send message handler
  const sendMessage = useCallback(() => {
    // Clear the message input after sending
    setMessageText("");
  }, [messageText]);

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
    // TODO: For the feather buttons, create reusable mediabutton component
    <SafeAreaProvider onLayout={onLayout}>
      <StatusBar style="light" />
      <SafeAreaView
        className="flex-1 flex-col bg-black"
        edges={["right", "left", "bottom"]}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={100}
        >
          <ImageBackground
            source={backgroundImage}
            className="flex-1"
          ></ImageBackground>

          <View className=" flex flex-row py-[8px] px-[10px] h-[50px]">
            <TouchableOpacity
              className="items-center justify-center w-35"
              onPress={() => console.log("Add button Pressed!")}
            >
              <Feather name="plus" size={24} color={colors.blue} />
            </TouchableOpacity>
            <TextInput
              className="flex-1 border  rounded-[50px] border-chatapp-lightGrey mx-[15px] px-[12px]"
              value={messageText}
              onChangeText={(text) => setMessageText(text)}
              onSubmitEditing={sendMessage}
            />
            {messageText === "" && (
              <TouchableOpacity
                className="items-center justify-center w-[35px]"
                onPress={() => console.log("Camera Pressed!")}
              >
                <Feather name="camera" size={24} color={colors.blue} />
              </TouchableOpacity>
            )}
            {messageText !== "" && (
              <TouchableOpacity
                className="items-center justify-center w-[35px] bg-chatapp-blue rounded-[50px] p-[8px]"
                onPress={sendMessage}
              >
                <Feather name="send" size={20} color={"white"} />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
