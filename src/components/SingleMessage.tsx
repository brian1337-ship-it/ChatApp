import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
//TODO: import { ACTIONS } from "./MessagesReducer";
import { SwipeListView } from "react-native-swipe-list-view";

import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { FormattedTime } from "react-intl";
import {
  ANSWER_BACKGROUND_COLOR,
  BLUE_TICK_BACKGROUND,
  CHAT_BACKROUND_COLOR,
  CHAT_DATA_STATUS_COLOR,
  GREEN_MESSAGE_CLICKED_BACKGROUND,
  INACTIVE_TAB_WHITE_COLOR,
  MESSAGE_BACKGROUND_COLOR,
  TITLE_COLOR,
  generateSendTick,
} from "./Variables";
// TODO import ReplyContainer from "./ReplyContainer";
import { MakeAnimation } from "./Helpers";

// SingleMessage: Renders an individual message in the chat
const SingleMessage = React.forwardRef(function SingleMessage(
  {
    isEven,
    index,
    dispatch,
    keyOfMessage,
    setemojiModalPositon,
    AnimateContainer,
    CloseContainer,
    setcheckSelection,
    handlePresentModalPress,
    ReplyContainerAnimation,
    setshowingReplyMessage,
    replieduser,
    messages,
    item,
  },
  { InputRef: ref, MessageContainerRef }
) {
  // Ref for the message container
  const messageRef = useRef(null);
  // Ref for the message corner (for styling)
  const cornerRef = useRef(null);

  // Destructure message properties from item
  const {
    selected,
    message,
    starred,
    reactions,
    deleteForEveryone,
    messageStatus,
    time,
    repliedMessage,
    direction,
    backgroundColor,
    fontSize,
  } = item;

  let messageStyles = [styles.message];
  let questionMessageCornerStyles = [styles.messageCorner];
  let answerMessageCornerStyles = [styles.answermessageCorner];

  // Ref for emoji viewer
  const EmojiViewerRef = useRef(null);

  let messageLimit =
    `[25/11, 7:47 pm] Talha: xjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxk
  [25/11, 7:48 pm] Talha: xjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxjxkxjjxjxjxkjxkxkxj talha shiekh is the best in the world and it is certified by`
      .length;

  // State for showing truncated/expanded message
  const [showingMessage, setShowingMessage] = useState(message);

  // State for toggling 'Read More' on long messages
  const [showReadMore, setshowReadMore] = useState(false);

  useEffect(() => {
    // Don't render if message is empty
    if (message == "") return;

    if (message.length > messageLimit) {
      let splittedMessage = message.slice(0, messageLimit) + "...";
      setShowingMessage(splittedMessage);
      setshowReadMore(true);
    } else {
      setShowingMessage(message);
    }
  }, [message]);

  // Change message background on interaction
  const handleChangeMessageBackground = (event) => {
    // setdraggedIndex(index);
    if (index % 2 == 0) {
      messageStyles.push(styles.green_selected_background);
      questionMessageCornerStyles.push(styles.green_selected_background);
    } else {
      messageStyles.push(styles.grey_selected_background);
      answerMessageCornerStyles.push(styles.grey_selected_background);
    }
    messageRef.current.setNativeProps({
      style: messageStyles,
    });
    cornerRef.current.setNativeProps({
      style:
        index % 2 == 0
          ? questionMessageCornerStyles
          : answerMessageCornerStyles,
    });
  };

  // Reset message background after interaction
  const handleUnChangeMessageBackground = () => {
    if (index % 2 == 0) {
      messageStyles.push(styles.message_background_color);
      questionMessageCornerStyles.push(styles.message_background_color);
    } else {
      messageStyles.push(styles.answer_background_color);
      answerMessageCornerStyles.push(styles.answer_background_color);
    }
    messageRef.current.setNativeProps({
      style: messageStyles,
    });

    cornerRef.current.setNativeProps({
      style:
        index % 2 == 0
          ? questionMessageCornerStyles
          : answerMessageCornerStyles,
    });
  };

  // Animation for starring a message
  const starScaleAnimation = useRef(new Animated.Value(0)).current;

  // Ref for overlay (used for modals)
  const overlayRef = useRef(null);

  // Ref for reply container
  const msgReplyRef = useRef(null);

  let overlayStyles = [styles.overlay];

  // State for dynamic message height
  const [heightofMessage, setheightofMessage] = useState(null);

  // Ref for message container (for scrolling)
  const messageContainerRef = useRef(null);

  // Get window dimensions for responsive layout
  const { width, height } = useWindowDimensions();

  // Modal width as percentage of screen
  const modalWidthPercentage = 80; // 80% width
  // Modal height as percentage of screen
  const modalHeightPercentage = 50; // 50% height

  // Calculate modal width
  const modalWidth = (modalWidthPercentage / 100) * width;
  // Calculate modal height
  const modalHeight = (modalHeightPercentage / 100) * height;

  const maxX = width - modalWidth;
  const maxY = height - modalHeight;

  overlayStyles?.push({
    height: heightofMessage,
    backgroundColor: selected ? "#00800094" : "transparent",
  });

  overlayRef?.current?.setNativeProps({
    style: overlayStyles,
  });

  useEffect(() => {
    if (selected) {
      AnimateContainer();
      setcheckSelection(true);
      if (messageRef.current) {
        messageRef?.current?.measure((x, y, Mwidth, Mheight, pageX, pageY) => {
          setheightofMessage(Mheight);
          // Adjust the X and Y values to stay within the screen bounds
          const adjustedX = Math.min(pageX, maxX);
          const adjustedY = Math.min(pageY, maxY);

          setemojiModalPositon({ x: adjustedX, y: adjustedY, opacity: 1 });
        });
      }
    } else {
      setcheckSelection(false);
      setheightofMessage(null);
      setemojiModalPositon({ x: 0, y: 0, opacity: 0 });
      CloseContainer();
    }
  }, [selected]);

  if (starred) {
    Animated.timing(starScaleAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      MakeAnimation(starScaleAnimation, 0, 500);
    });
  }

  let reactionContainerStyles = [styles.reactions_container];

  function changeEmojiViewerStyles(addedStyle) {
    reactionContainerStyles.push(addedStyle);
    EmojiViewerRef.current.setNativeProps({
      style: reactionContainerStyles,
    });
  }

  function handleShowReply(message, index) {
    setshowingReplyMessage({
      message: message,
      status: index,
    });

    // ! 2) limit messages lenght
    // ! 4 ) try adding the Swipeable List View as in previous one insted of the current code
    // ! 5 ) hightlight the replyMessage that is clicked

    Animated.timing(ReplyContainerAnimation, {
      toValue: 5,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      ref.current.focus();
    });
  }

  const renderLeftActions = (progressAnimatedValue) => {
    const trans = progressAnimatedValue.interpolate({
      inputRange: [0, 2],
      outputRange: [-40, 280],
    });

    return (
      <Animated.View
        style={[
          styles.messageContainer,
          {
            transform: [{ translateX: trans }],
          },
        ]}
      >
        <View style={[styles.replyImageWrapper]}>
          <Entypo name="reply" size={20} color={TITLE_COLOR} />
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (selected) {
            // dispatch({
            //   type: ACTIONS.DE_SELECT_MESSAGES,
            //   payload: {
            //     key: keyOfMessage,
            //     index,
            //   },
            // });
          }
        }}
        style={{ zIndex: 99999 }}
      >
        <Animated.View
          pointerEvents={selected ? "auto" : "none"}
          ref={overlayRef}
        />
      </TouchableOpacity>

      <SwipeListView
        data={[item]}
        disableLeftSwipe
        leftActivationValue={50}
        onLeftAction={() => {
          handleShowReply(message, index);
        }}
        keyExtractor={(item) => item.key}
        renderHiddenItem={(data, rowMap) => <View />}
        renderItem={() => {
          return (
            <Pressable
              style={{ backgroundColor }}
              onPressIn={handleChangeMessageBackground}
              onPressOut={handleUnChangeMessageBackground}
              onLongPress={() => {
                // dispatch({
                //   type: ACTIONS.SELECT_MESSAGES,
                //   payload: {
                //     key: keyOfMessage,
                //   },
                // });
              }}
            >
              <View
                style={[
                  styles.arrowIcon,
                  {
                    left: -40,
                    width: 30,
                    aspectRatio: 1,
                    borderRadius: 50,
                    backgroundColor: "rgba(0,0,0,.5)",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Entypo name="reply" size={20} color={TITLE_COLOR} />
              </View>
              <View
                style={[
                  styles.messagesContainer,
                  { alignSelf: isEven ? "flex-end" : "flex-start" },
                ]}
                ref={messageContainerRef}
              >
                <View
                  style={
                    isEven ? styles.messageCorner : styles.answermessageCorner
                  }
                  ref={cornerRef}
                />

                <View
                  ref={messageRef}
                  style={[
                    styles.message,
                    {
                      transform: [{ translateX: isEven ? -20 : 20 }],
                      flexDirection: "row",
                      backgroundColor: isEven
                        ? MESSAGE_BACKGROUND_COLOR
                        : ANSWER_BACKGROUND_COLOR,
                      position: "relative",
                      marginBottom: reactions?.length !== 0 ? 30 : 10,
                    },
                  ]}
                >
                  {reactions?.length !== 0 && (
                    <Pressable
                      onPress={() => handlePresentModalPress(reactions)}
                      onPressIn={() => changeEmojiViewerStyles(styles.black)}
                      onPressOut={() => changeEmojiViewerStyles(styles.usual)}
                    >
                      <View
                        style={[
                          styles.reactions_container,
                          { borderRadius: reactions?.length > 1 ? 10 : 100 },
                        ]}
                        ref={EmojiViewerRef}
                      >
                        {reactions?.length >= 5
                          ? reactions
                              .reverse()
                              .slice(0, 5)
                              .map((reaction) => {
                                return (
                                  <View key={reaction.key}>
                                    <Text style={[styles.reacted_emoji]}>
                                      {reaction.emoji}
                                    </Text>
                                  </View>
                                );
                              })
                          : reactions?.reverse().map((reaction) => {
                              return (
                                <View key={reaction.key}>
                                  <Text style={[styles.reacted_emoji]}>
                                    {reaction.emoji}
                                  </Text>
                                </View>
                              );
                            })}
                        {reactions?.length !== 1 && (
                          <View>
                            <Text
                              style={{
                                color: CHAT_DATA_STATUS_COLOR,
                                fontWeight: "bold",
                              }}
                            >
                              {reactions?.length}
                            </Text>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  )}
                  <View
                    style={{
                      flexDirection: direction,
                    }}
                  >
                    {!deleteForEveryone ? (
                      <View>
                        {repliedMessage &&
                          {
                            /* <ReplyContainer
                            repliedMessage={repliedMessage}
                            replieduser={replieduser}
                            index={index}
                            messages={messages}
                            ref={MessageContainerRef}
                            dispatch={dispatch}
                          /> */
                          }}
                        <View>
                          <Text
                            style={{
                              color: TITLE_COLOR,
                              fontSize,
                              marginRight: 10,
                            }}
                          >
                            {showingMessage}
                            {showReadMore && (
                              <TouchableOpacity
                                onPress={() => {
                                  setShowingMessage(message);
                                  setshowReadMore(false);
                                }}
                              >
                                <Text style={{ color: BLUE_TICK_BACKGROUND }}>
                                  Press me
                                </Text>
                              </TouchableOpacity>
                            )}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ marginRight: 5 }}>
                          <MaterialIcons
                            name="block-flipped"
                            size={20}
                            color={INACTIVE_TAB_WHITE_COLOR}
                          />
                        </Text>
                        <Text
                          style={{
                            color: INACTIVE_TAB_WHITE_COLOR,
                            fontSize: 15,
                            marginRight: 10,
                            fontStyle: "italic",
                          }}
                        >
                          You deleted this message
                        </Text>
                      </View>
                    )}
                    <View
                      style={{
                        alignSelf: "flex-end",
                        marginTop: 5,
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={{ color: TITLE_COLOR, fontSize: 10 }}>
                          {starred && (
                            <>
                              <View style={{ marginRight: 10 }}>
                                <FontAwesome
                                  name="star"
                                  size={8}
                                  color={TITLE_COLOR}
                                />
                              </View>
                              <Animated.View
                                style={{
                                  position: "absolute",
                                  transform: [
                                    { translateX: -7 },
                                    {
                                      translateY:
                                        starScaleAnimation.interpolate({
                                          inputRange: [0, 1],
                                          outputRange: [0, -50],
                                        }),
                                    },
                                    {
                                      scale: starScaleAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, 3.4],
                                      }),
                                    },
                                  ],
                                  opacity: starScaleAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 0],
                                  }),
                                }}
                              >
                                <FontAwesome
                                  name="star"
                                  size={8}
                                  color={"yellow"}
                                />
                              </Animated.View>
                            </>
                          )}
                          {"  "}
                          <FormattedTime value={new Date(time)} />
                          {"  "}
                        </Text>
                        {isEven && !deleteForEveryone && (
                          <View>
                            <Text style={{ color: TITLE_COLOR, fontSize: 10 }}>
                              {generateSendTick(messageStatus)}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </>
  );
});

export default SingleMessage;

const styles = StyleSheet.create({
  message: {
    padding: 7,
    borderRadius: 10,
  },
  messagesContainer: {
    flex: 1,
    flexWrap: "wrap",
    maxWidth: "80%",
  },
  messageCorner: {
    width: 15,
    height: 15,
    backgroundColor: MESSAGE_BACKGROUND_COLOR,
    position: "absolute",
    zIndex: -1,
    right: 12,
    borderBottomLeftRadius: 100,
    top: 0,
    transform: [{ rotate: "270deg" }],
  },
  answermessageCorner: {
    width: 15,
    height: 15,
    backgroundColor: ANSWER_BACKGROUND_COLOR,
    position: "absolute",
    zIndex: -1,
    left: 12,
    borderBottomLeftRadius: 100,
    top: 0,
  },
  singleLineOfMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  green_selected_background: {
    backgroundColor: GREEN_MESSAGE_CLICKED_BACKGROUND,
  },
  grey_selected_background: {
    backgroundColor: "black",
  },
  message_background_color: {
    backgroundColor: MESSAGE_BACKGROUND_COLOR,
  },
  answer_background_color: {
    backgroundColor: ANSWER_BACKGROUND_COLOR,
  },
  arrowIcon: {
    position: "absolute",
    top: "10%",
  },
  overlay: {
    position: "absolute",
    zIndex: 99999999999,
    width: "100%",
  },
  reactions_container: {
    height: 30,
    backgroundColor: ANSWER_BACKGROUND_COLOR,
    position: "absolute",
    bottom: -32,
    zIndex: 9999999,
    left: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 10,
    borderColor: CHAT_BACKROUND_COLOR,
    borderWidth: 1,
  },
  reacted_emoji: {
    fontSize: 17,
  },
  black: {
    backgroundColor: "black",
  },
  usual: {
    backgroundColor: ANSWER_BACKGROUND_COLOR,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  replyImageWrapper: {
    width: 30,
    height: 30,
    backgroundColor: "rgba(0,0,0,.5)",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
