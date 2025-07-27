import { Entypo, Fontisto, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Animated,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ACTIVE_TAB_GREEN_COLOR,
  ANSWER_BACKGROUND_COLOR,
  CHAT_BACKROUND_COLOR,
  EMOJI_BACKGROUND_COLOR,
  TAB_PRESS_ACTIVE_WHITE_COLOR,
  TITLE_COLOR,
} from "./Variables";
// TODO: import { ACTIONS } from "./MessagesReducer";
// TODO: import { useNavigation } from "@react-navigation/native";
import { MakeAnimation } from "./Helpers";

// Ripple button for emoji, camera, and attachment actions
const MessagesRippleButton = ({ children, onPress, ...rest }) => {
  return (
    <View style={{ padding: 10, borderRadius: 100 }} {...rest}>
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(
          TAB_PRESS_ACTIVE_WHITE_COLOR,
          true,
          30
        )}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {children}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

// Main input component for sending messages in chat
const ChatInput = React.forwardRef(function MessageInput(
  {
    value,
    setvalue,
    paddingRight,
    ClipandCameraAnimation,
    setIsOpen,
    sendButtonAnimation,
    dispatch,
    setMenuVisible,
    setpaddingRight,
    replyMessage,
    setshowingReplyMessage,
    ReplyContainerAnimation,
    messages,
    item,
  },
  { inputRef, MessageContainerRef }
) {
  // State for dynamic height of the message input box
  const [HeightOfMessageBox, setHeightOfMessageBox] = useState(45);
  // Ensure the height is at least 45px
  const computedHeight = HeightOfMessageBox < 45 ? 45 : HeightOfMessageBox;

  //TODO Navigation object for navigating to camera screen
  // const navigation = useNavigation();

  // Used to trim long reply messages for display
  const replyLength =
    "talha shiekh is always the best in the world Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero quod quaerat sunt nostrum temporibus veritatis. Lorem ipsum dolor sit ";

  // Format replied message for display
  let repliedMessage =
    replyMessage.message.length > replyLength.length
      ? replyMessage.message.slice(0, replyLength.length) + " ..."
      : replyMessage.message;

  // Check if reply container should be shown
  let showReplyCheck =
    replyMessage.status !== "" && replyMessage.message !== "";

  // Animation for reply container position
  let translateReply = {
    transform: [{ translateY: ReplyContainerAnimation }, { translateX: -5 }],
  };

  // Show 'You' or contact name in reply
  let repliedName = replyMessage.status % 2 == 0 ? "You" : item.name;

  // Function to close reply container and reset reply state
  function CloseReplyContianer() {
    MakeAnimation(ReplyContainerAnimation, 45, 500);
    setshowingReplyMessage({
      message: "",
      status: "",
    });
  }

  // Function to send message via WhatsApp app (external)
  const sendWhatsAppMessage = (sndmsg) => {
    let msg = sndmsg;
    let phoneWithCountryCode = item.number;

    let mobile =
      Platform.OS == "ios" ? phoneWithCountryCode : "+" + phoneWithCountryCode;
    if (mobile) {
      if (msg) {
        let url = "whatsapp://send?text=" + msg + "&phone=" + mobile;
        Linking.openURL(url)
          .then((data) => {
            alert(data);
          })
          .catch(() => {
            alert("Make sure WhatsApp installed on your device");
          });
      } else {
        alert("Please insert message to send");
      }
    } else {
      alert("Please insert mobile no");
    }
  };

  // Reply container UI for showing replied message above input
  const ReplyContainer = ({ HeightOfMessageBox }) => {
    return (
      <Animated.View
        style={[
          styles.containerOfReply,
          translateReply,
          {
            bottom:
              HeightOfMessageBox > 45 ? HeightOfMessageBox - 45 : undefined,
          },
        ]}
      >
        {showReplyCheck && (
          <>
            <View style={styles.textandCross}>
              <Text style={styles.RepliednameOrYou}>{repliedName}</Text>
              <TouchableOpacity onPress={CloseReplyContianer}>
                <Text style={styles.replyCross}>&times;</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.repliedMessage}>{repliedMessage}</Text>
          </>
        )}
      </Animated.View>
    );
  };

  // Used to determine message layout direction (row/column)
  const messageLenght = "Gzjzgidgkskfhdhahflhflh";

  // Regex for emoji detection
  const withEmojis = /\p{Extended_Pictographic}/u;

  return (
    <>
      {/* Reply container above input if replying to a message */}
      <ReplyContainer HeightOfMessageBox={HeightOfMessageBox} />
      {/* Main input container for typing messages */}
      <View
        // style={[
        //   styles.inputContainer,
        //   {
        //     overflow: "hidden",
        //     marginBottom: 10,
        //     position: "absolute",
        //     bottom: 0,
        //     left: 0,
        //     right: 50,
        //     height: HeightOfMessageBox < 45 ? 45 : HeightOfMessageBox,
        //   },
        // ]}
        className={` flex-[8] flex-row bg-[${ANSWER_BACKGROUND_COLOR}] rounded-[10px] mx-[10px] mt-[5px] h-[45px] max-h-[130px] overflow-hidden mb-[10px] absolute bottom-0 left-0 right-[50px]`}
      >
        {/* Emoji picker button */}
        <View style={[styles.emoji, { alignSelf: "flex-end" }]}>
          <MessagesRippleButton
            onPress={() => {
              setIsOpen((o) => !o);
            }}
          >
            <Fontisto name="smiley" size={20} color={EMOJI_BACKGROUND_COLOR} />
          </MessagesRippleButton>
        </View>
        {/* Text input for typing messages */}
        <View>
          <TextInput
            ref={inputRef}
            placeholderTextColor={EMOJI_BACKGROUND_COLOR}
            placeholder="Messages"
            className={` flex-[5] text-[${TITLE_COLOR}] text-[18px] pl-[50px] pr-[${paddingRight}px] `}
            multiline
            value={value}
            onContentSizeChange={(e) => {
              setHeightOfMessageBox(e.nativeEvent.contentSize.height);
            }}
            onChangeText={(value) => {
              setvalue(value);
              // Animate camera/clip and send button based on input
              if (value !== "") {
                MakeAnimation(ClipandCameraAnimation, 50, 300);
                MakeAnimation(sendButtonAnimation, 1, 300);
                setpaddingRight(50);
              } else {
                MakeAnimation(ClipandCameraAnimation, 0, 300);
                MakeAnimation(sendButtonAnimation, 0, 300);
                setpaddingRight(100);
              }
            }}
          />
        </View>
        {/* Camera and attachment buttons, animated */}
        <Animated.View
          style={[
            styles.camera_and_clip,
            { transform: [{ translateX: ClipandCameraAnimation }] },
          ]}
        >
          <MessagesRippleButton onPress={() => setMenuVisible((v) => !v)}>
            <Entypo
              name="attachment"
              size={20}
              color={EMOJI_BACKGROUND_COLOR}
            />
          </MessagesRippleButton>
          {/* // TODO: Camera button to navigate to camera screen */}
          {/* <MessagesRippleButton onPress={() => navigation.navigate("Camera")}>
            <Feather name="camera" size={20} color={EMOJI_BACKGROUND_COLOR} />
          </MessagesRippleButton> */}
        </Animated.View>
      </View>
      {/* Send button (voice or send icon, animated) */}
      <View style={{ marginLeft: "86%", marginBottom: 5 }}>
        <TouchableOpacity
          onPress={() => {
            // Build message object for sending
            let messagesObject = {
              message: value,
              key: Date.now().toString(),
              time: Date.now(),
              messageStatus: "single",
              selected: false,
              deleteForEveryone: false,
              starred: false,
              readedTime: Date.now(),
              delivered: Date.now(),
              repliedMessage: "",
              reactions: [],
              direction: "",
              backgroundColor: "transparent",
              fontSize: 15,
            };

            if (value == "") return;

            // const isEmojiPresent = value.split("").every(s => withEmojis.test(s));

            // for (let i = 0; i < value.length; i++) {
            //   const element = value[i];
            //   if(withEmojis.test(element)){
            //     alert()
            //   }
            // }
            // alert(isEmojiPresent)

            // if(isEmojiPresent){
            //   messagesObject.fontSize = 20;
            // }
            // if(withEmojis.test(value))

            const { message, status } = replyMessage;
            // Determine message direction based on length
            let ColumnOrRow =
              messagesObject.message?.length > messageLenght.length
                ? "column"
                : "row";
            messagesObject.direction = ColumnOrRow;

            if (replyMessage.message !== "") {
              messagesObject.repliedMessage = { message, status };
              messagesObject.direction = "column";
            }

            // TODO: Dispatch send message action
            // dispatch({
            //   type: ACTIONS.SEND_MESSAGES,
            //   payload: {
            //     messagesObject,
            //   },
            // });

            // TODO:Simulate message status updates (double/triple tick)
            setTimeout(() => {
              // dispatch({
              //   type: ACTIONS.UPDATE_MESSAGE_STATUS_TO_DOUBLE,
              //   payload: {
              //     key: messagesObject.key,
              //     readedTime: Date.now(),
              //     delivered: Date.now(),
              //   },
              // });
            }, 60 * 1000);

            setTimeout(
              () => {
                // dispatch({
                //   type: ACTIONS.UPDATE_MESSAGE_STATUS_TO_TRIPLE,
                //   payload: {
                //     key: messagesObject.key,
                //     readedTime: Date.now(),
                //     delivered: Date.now(),
                //   },
                // });
              },
              3 * 60 * 1000
            );

            setvalue("");

            // Reset animations and reply state
            MakeAnimation(ClipandCameraAnimation, 0, 300);
            MakeAnimation(sendButtonAnimation, 0, 300);
            setpaddingRight(100);

            setshowingReplyMessage({
              message: "",
              status: "",
            });

            MakeAnimation(ReplyContainerAnimation, 45, 500);

            // Scroll to bottom after sending
            if (messages.length > 1) {
              MessageContainerRef.current.scrollToIndex({
                animated: true,
                index: messages.length - 1,
              });
            }

            // Optionally send via WhatsApp app
            // sendWhatsAppMessage(messagesObject.message)
          }}
        >
          <View style={[styles.sendButton]}>
            {/* Voice icon (hidden when typing) */}
            <Animated.View
              style={{
                position: "absolute",
                zIndex: 99999,
                transform: [
                  {
                    scale: sendButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0],
                    }),
                  },
                ],
              }}
            >
              <MaterialIcons
                name="keyboard-voice"
                size={25}
                color={TITLE_COLOR}
              />
            </Animated.View>
            {/* Send icon (shown when typing) */}
            <Animated.View
              style={{
                position: "absolute",
                zIndex: -1,
                transform: [
                  {
                    scale: sendButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ],
              }}
            >
              <Ionicons name="send" size={24} color={TITLE_COLOR} />
            </Animated.View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
});

export default ChatInput;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 8,
    flexDirection: "row",
    backgroundColor: ANSWER_BACKGROUND_COLOR,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 5,
    height: 45,
    maxHeight: 130,
  },
  sendButton: {
    // flex:1,
    backgroundColor: ACTIVE_TAB_GREEN_COLOR,
    borderRadius: 100,
    width: 50,
    height: 50,
    // marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    justifyContent: "center",
    alignItems: "center",
    // marginLeft: 10,
    flex: 1,
    position: "absolute",
    left: 0,
    alignSelf: "center",
    zIndex: 999999,
  },
  input: {
    flex: 5,
    color: TITLE_COLOR,
    fontSize: 18,
    paddingLeft: 50,
  },
  camera_and_clip: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "row",
    paddingRight: 10,
    gap: 10,
    position: "absolute",
    right: 0,
    top: 2,
    bottom: 0,
  },
  containerOfReply: {
    width: "83%",
    backgroundColor: CHAT_BACKROUND_COLOR,
    marginLeft: 15,
    borderTopLeftRadius: 10,
    borderWidth: 7,
    borderColor: ANSWER_BACKGROUND_COLOR,
    borderTopEndRadius: 10,
  },
  textandCross: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  RepliednameOrYou: {
    marginLeft: 10,
    color: ACTIVE_TAB_GREEN_COLOR,
    fontWeight: "bold",
    marginTop: 5,
  },
  replyCross: {
    marginRight: 10,
    color: EMOJI_BACKGROUND_COLOR,
    fontWeight: "bold",
    fontSize: 15,
  },
  repliedMessage: {
    marginLeft: 10,
    color: EMOJI_BACKGROUND_COLOR,
    marginBottom: 5,
  },
});
