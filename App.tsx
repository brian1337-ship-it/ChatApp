import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useRef, useState } from "react";
import { Animated, SafeAreaView, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useShallow } from "zustand/shallow";
import "./global.css";
import ChatInput from "./src/components/ChatInput";
import { useChatStore } from "./src/store/useChatStore";

// Prevent splash screen from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { messages, addMessage } = useChatStore(
    useShallow((state) => ({
      messages: state.messages,
      addMessage: state.addMessage,
    }))
  );

  // Message input value
  const [value, setvalue] = useState("");
  // Padding for input field (for animation)
  const [paddingRight, setpaddingRight] = useState(100);
  // Animations for camera/clip and send button
  const ClipandCameraAnimation = useRef(new Animated.Value(0)).current;
  const sendButtonAnimation = useRef(new Animated.Value(0)).current;

  // Emoji picker state
  const [isOpen, setIsOpen] = useState(false);
  // State for menu visibility
  const [MenuVisible, setMenuVisible] = useState(false);
  // Animation for reply container
  const replyAnimation = useRef(new Animated.Value(0)).current;
  // Reply message state
  const [showingReplyMessage, setshowingReplyMessage] = useState({
    message: "",
    status: "",
  });
  // Animation for reply container
  const ReplyContainerAnimation = useRef(new Animated.Value(40)).current;
  const item = "you";
  // Refs for input and message container
  const InputRef = useRef(null);
  const MessageContainerRef = useRef(null);

  const [messageText, setMessageText] = useState("");

  // State for dynamic height of the message input box
  const [HeightOfMessageBox, setHeightOfMessageBox] = useState(45);
  // Ensure the height is at least 45px
  const computedHeight = HeightOfMessageBox < 45 ? 45 : HeightOfMessageBox;

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
  // TODO: Explore if this can be done more efficiently using useEffect
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
    <SafeAreaProvider onLayout={onLayout} className="flex-1">
      <StatusBar style="light" />
      <SafeAreaView
        className="flex-1 flex-col bg-chatapp-dark-background"
        edges={["right", "left", "bottom"]}
      >
        <BottomSheetModalProvider>
          {/* Loading dialog */}
          {/* <LoadingModal
        showloadingDialog={showloadingDialog}
        setshowloadingDialog={setshowloadingDialog}
      /> */}

          {/* Block user modal */}
          {/* <BlockModal
        name={item.name}
        setopenBlockModal={setopenBlockModal}
        openBlockModal={openBlockModal}
        dispatch={dispatch}
        item={item}
        setshowloadingDialog={setshowloadingDialog}
      /> */}

          {/* Mute notifications dialog */}
          {/* <MuteNotificationsDialog
        item={item}
        mutedDialogOpen={mutedDialogOpen}
        setmutedDialogOpen={setmutedDialogOpen}
      /> */}

          {/* Delete message modal */}
          {/* <DeleteModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        showDeleteforeveryone={showDeleteforeveryone}
        selectedMessages={selectedMessages}
        handleShowSelectionInAlert={handleShowSelectionInAlert}
        dispatch={dispatch}
      /> */}

          {/* Emoji reaction modal */}
          {/* <ReactEmojiModal
        setIsOpen={setIsOpen}
        CloseContainer={CloseContainer}
        dispatch={dispatch}
        messages={messages}
        checkSelection={checkSelection}
        containerAnimation={EmojiContainerAnimation}
        emojiModalPositon={emojiModalPositon}
      /> */}

          {/* Main chat screen container */}
          <View className="flex-1 bg-[#121b22]">
            {/* Message options modal */}
            {/* <MessageModal
              MenuVisible={MenuVisible}
              setMenuVisible={setMenuVisible}
            /> */}

            {/* Emoji picker for input field */}
            {/* <EmojiPicker
              open={isOpen}
              onEmojiSelected={(emojiObject) => {
                setvalue((prev) => prev + emojiObject.emoji);
              }}
              onClose={() => setIsOpen(false)}
            /> */}

            {/* Bottom sheet modal for reactions */}
            {/* <BottomSheetModal
              enablePanDownToClose={true}
              handleIndicatorStyle={{ backgroundColor: CHAT_DATA_STATUS_COLOR }}
              ref={bottomSheetRef}
              index={0}
              snapPoints={snapPoints}
              backgroundStyle={{ backgroundColor: CHAT_BACKROUND_COLOR }}
              backdropComponent={() => (
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: "rgba(0,0,0,.5)",
                    ...StyleSheet.absoluteFill,
                  }}
                />
              )}
            >
              <View style={{ height: "100%", width: "100%" }}>
                <Text
                  style={{
                    color: TITLE_COLOR,
                    fontSize: 25,
                    fontWeight: "500",
                    margin: 15,
                    marginHorizontal: 25,
                  }}
                >
                  {TotalReactions} reaction{TotalReactions > 1 ? "s" : ""}
                </Text>
                <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
                  {clickedMessageReactions.map((reaction) => {
                    return (
                      <SingleReaction key={reaction.key} reaction={reaction} />
                    );
                  })}
                </ScrollView>
              </View>
            </BottomSheetModal> */}

            {/* Messages list */}
            {/* <View
              style={{
                flex: 10,
                paddingTop: 20,
              }}
            >
              <FlatList
                ref={MessageContainerRef}
                data={messages}
                onLayout={scrollToBottom}
                keyExtractor={(item) => item.key}
                onContentSizeChange={(width, height) =>
                  setContentHeight(height)
                }
                onScroll={(e) => {
                  setContentVerticalOffset(e.nativeEvent.contentOffset.y);
                  setShowScrollToBottomButton(
                    e.nativeEvent.contentOffset.y + height < contentHeight
                  );
                }}
                renderItem={({ item, index }) => {
                  const isEven = index % 2 == 0;

                  return (
                    <SingleMessage
                      key={item.key}
                      item={item}
                      isEven={isEven}
                      index={index}
                      dispatch={dispatch}
                      keyOfMessage={item.key}
                      setemojiModalPositon={setemojiModalPositon}
                      AnimateContainer={AnimateContainer}
                      CloseContainer={CloseContainer}
                      setcheckSelection={setcheckSelection}
                      handlePresentModalPress={handlePresentModalPress}
                      ReplyContainerAnimation={ReplyContainerAnimation}
                      ref={{ InputRef, MessageContainerRef }}
                      setshowingReplyMessage={setshowingReplyMessage}
                      replieduser={user}
                      messages={messages}
                    />
                  );
                }}
              />
            </View> */}

            {/* Message input field at bottom */}
            <View>
              <ChatInput
                messages={messages}
                value={value}
                setvalue={setvalue}
                paddingRight={paddingRight}
                ClipandCameraAnimation={ClipandCameraAnimation}
                setIsOpen={setIsOpen}
                sendButtonAnimation={sendButtonAnimation}
                dispatch={addMessage}
                setMenuVisible={setMenuVisible}
                replyAnimation={replyAnimation}
                setpaddingRight={setpaddingRight}
                replyMessage={showingReplyMessage}
                setshowingReplyMessage={setshowingReplyMessage}
                ReplyContainerAnimation={ReplyContainerAnimation}
                item={item}
                ref={{
                  inputRef: InputRef,
                  MessageContainerRef: MessageContainerRef,
                }}
              />
            </View>

            {/* Scroll to bottom button */}
            {/* {ShowScrollToBottomButton && <ScrollToBottomButton />} */}
          </View>
        </BottomSheetModalProvider>

        {/* <ImageBackground
          source={backgroundImage}
          className="flex-1"
          resizeMode="cover"
        > */}
        {/* <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        > */}
        {/* Chat messages will be rendered here */}
        {/* <View className="flex-[10] pt-[20px] text-white text-center"> */}
        {/* Placeholder for chat messages */}
        {/* </View> */}

        {/* Message input box */}
        {/* <View
          className={`flex flex-row py-[8px] px-[10px] overflow-hidden mb-[10px] absolute bottom-0 left-0 right-0 height-[${computedHeight}px]`}
        >
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
        </View> */}
        {/* </KeyboardAvoidingView> */}
        {/* </ImageBackground> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
