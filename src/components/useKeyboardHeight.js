import { useState, useEffect } from "react";
import { Keyboard, Platform } from "react-native";

const isIOS = Platform.OS === "ios";
const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const handleKeyboardDidShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  };
  const handleKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    // keyboardWillShow is not supported on android
    const showEvent = isIOS ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = isIOS ? "keyboardWillHide" : "keyboardDidHide";
    Keyboard.addListener(showEvent, handleKeyboardDidShow);
    Keyboard.addListener(hideEvent, handleKeyboardDidHide);
    return () => {
      Keyboard.removeSubscription(showEvent, handleKeyboardDidShow);
      Keyboard.removeSubscription(hideEvent, handleKeyboardDidHide);
    };
  }, []);

  return { keyboardHeight };
};

export default useKeyboardHeight;
