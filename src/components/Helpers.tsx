import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import {
  ACTIVE_TAB_GREEN_COLOR,
  TAB_BACKGROUND_COLOR,
  TAB_PRESS_ACTIVE_WHITE_COLOR,
  TITLE_COLOR,
} from "./Variables";

// Common style for centering content
// Common style for centering elements
export const center = {
  justifyContent: "center",
  alignItems: "center",
};

// RippleButton: button with ripple effect for actions
// RippleButton: Button with ripple effect for touch feedback
export const RippleButton = ({
  children,
  onPress,
  borderRadius = 50,
  padding = 15,
}) => {
  return (
    <View style={{ padding, borderRadius }}>
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(
          TAB_PRESS_ACTIVE_WHITE_COLOR,
          true,
          40
        )}
      >
        <View>{children}</View>
      </TouchableNativeFeedback>
    </View>
  );
};

// showToast: displays a toast message
// showToast: Display a toast message
export const showToast = (message) => {
  ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
};

// ModelComponent: modal for profile, call, and message actions
// ModelComponent: Modal for displaying user info and actions
export const ModelComponent = ({ name, photo, onPress, item }) => {
  // Navigation object for modal actions
  const navigation = useNavigation();

  // State for current item in modal
  const [currentItem, setCurrentItem] = useState({
    ...item,
  });

  // Navigates to call screen (audio)
  // Handler to open call screen
  const handleOpenCallScreen = () => {
    setCurrentItem({
      ...item,
      video: true,
    });
    navigation.navigate("CallScreen", { item: currentItem });
    onPress();
  };

  // Navigates to call screen (video)
  // Handler to open video call screen
  const handleOpenVideoScreen = () => {
    setCurrentItem({
      ...item,
      video: false,
    });
    navigation.navigate("CallScreen", { item: currentItem });
    onPress();
  };

  // Navigates to messages screen
  // Handler to open messages screen
  const handleOpenMessagesScreen = () => {
    navigation.navigate("MessagesScreen", { item: currentItem });
    onPress();
  };

  // Modal UI rendering
  return (
    <Pressable style={styles.centeredView} onPress={onPress}>
      <View style={[styles.modalView]}>
        <View style={styles.imageContainer}>
          <Text
            style={{
              zIndex: 111,
              backgroundColor: "rgba(0,0,0,.4)",
              color: TITLE_COLOR,
              padding: 8,
              position: "absolute",
              width: "100%",
              fontSize: 18,
            }}
          >
            {name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ProfileImage", { photo, name });
              onPress();
            }}
          >
            <View>
              <Image
                source={
                  photo
                    ? { uri: photo }
                    : require("../../assets/images/profile.png")
                }
                resizeMode="cover"
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.iconsContainer,
            { backgroundColor: TAB_BACKGROUND_COLOR },
          ]}
        >
          <RippleButton
            onPress={handleOpenCallScreen}
            borderRadius={200}
            padding={10}
          >
            <Ionicons name="call" color={ACTIVE_TAB_GREEN_COLOR} size={23} />
          </RippleButton>
          <RippleButton
            onPress={handleOpenMessagesScreen}
            borderRadius={200}
            padding={10}
          >
            <MaterialCommunityIcons
              name="message-text-outline"
              color={ACTIVE_TAB_GREEN_COLOR}
              size={23}
            />
          </RippleButton>
          <RippleButton borderRadius={200} padding={10}>
            <Feather name="info" color={ACTIVE_TAB_GREEN_COLOR} size={23} />
          </RippleButton>
          <RippleButton
            onPress={handleOpenVideoScreen}
            borderRadius={200}
            padding={10}
          >
            <Ionicons
              name="videocam"
              color={ACTIVE_TAB_GREEN_COLOR}
              size={23}
            />
          </RippleButton>
        </View>
      </View>
    </Pressable>
  );
};

// MakeAnimation: animates a value for transitions
// MakeAnimation: Utility for running animations
export const MakeAnimation = (animation, toValue, duration) => {
  // Start animation with timing
  return Animated.timing(animation, {
    toValue,
    duration,
    useNativeDriver: true,
  }).start();
};

// ChatGreenLeftComponent: green circle for call/chat UI
// ChatGreenLeftComponent: UI for left-aligned green chat bubble
export const ChatGreenLeftComponent = ({ children }) => {
  // Render left-aligned chat bubble
  return (
    <View style={{ ...center }}>
      <View
        style={[
          styles.callLeftPlaceImage,
          {
            backgroundColor: ACTIVE_TAB_GREEN_COLOR,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

// Button: styled button for actions
export const Button = ({ color, onPress, children, width }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color, width: width }]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

// CallReusableComponent: reusable UI for call actions
export const CallReusableComponent = ({ Children, text, onPress }) => {
  return (
    <TouchableNativeFeedback
      onPress={onPress}
      background={TouchableNativeFeedback.Ripple(
        TAB_PRESS_ACTIVE_WHITE_COLOR,
        false
      )}
    >
      <View
        style={{
          height: 60,
          flexDirection: "row",
          gap: 20,
          paddingLeft: 30,
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <View style={center}>
          <Children />
        </View>
        <View>
          <Text
            style={{
              color: TITLE_COLOR,
              fontSize: 18,
              marginLeft: 20,
            }}
          >
            {text}
          </Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flexDirection: "row",
    flex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    width: 300,
    height: 300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    top: 100,
    left: 40,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 2 / 1.9,
    position: "relative",
  },
  iconsContainer: {
    width: "100%",
    height: "17%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  callLeftPlaceImage: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 50,
    marginTop: 10,
    ...center,
  },
  callComponentContainer: {
    width: "80%",
    height: 50,
    backgroundColor: "blue",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
