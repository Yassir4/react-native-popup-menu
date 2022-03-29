import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
  Animated,
} from "react-native";
import { Portal } from "@gorhom/portal";
import useKeyboardHeight from "./useKeyboardHeight";

const { width: layoutWidth, height: layoutHeight } = Dimensions.get("window");

const isIOS = Platform.OS === "ios";
const Menu = ({ trigger, children }) => {
  const triggerWrapperRef = useRef(null);
  const itemsWrapperRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const [triggerDimensions, setTriggerDimensions] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [modalDimensions, setModalDimensions] = useState({
    width: 0,
    height: 0,
  });

  const { keyboardHeight } = useKeyboardHeight();

  const styles = StyleSheet.create({
    modalWrapper: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 10,
    },

    button: {
      width: "auto",
      alignSelf: "center",
    },
    activeSection: {
      backgroundColor: "white",
      alignSelf: "flex-start",
      ...Platform.select({
        ios: {
          alignSelf: "flex-start",
          width: layoutWidth * 0.5,

          borderRadius: 13,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.35,
          shadowRadius: 100,
        },
        android: {
          maxWidth: layoutWidth * 0.7,
          alignSelf: "flex-start",
          elevation: 8,
        },
      }),
      opacity:
        modalDimensions.width !== 0 && triggerDimensions.left !== 0 ? 1 : 0,
      zIndex: 99,
    },
    overlay: {
      ...Platform.select({
        ios: {
          borderRadius: 13,
        },
      }),
    },
  });
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  const calculateDimensions = () => {
    triggerWrapperRef?.current?.measureInWindow((x, y, width, height) => {
      setTriggerDimensions({
        top: Math.max(y, 0),
        left: x,
        width,
        height,
      });
    });

    setTimeout(() => {
      itemsWrapperRef?.current?.measureInWindow((x, y, width, height) => {
        setModalDimensions({ width, height });
      });
    }, 100);
  };

  useEffect(() => {
    if (menuVisible) {
      if (triggerWrapperRef?.current) calculateDimensions();
    }
  }, [menuVisible, itemsWrapperRef, setModalDimensions]);

  const closeModal = () => {
    setMenuVisible(false);
    setModalDimensions({ width: 0, height: 0 });
    setTriggerDimensions({ top: 0, left: 0, width: 0, height: 0 });
  };

  const { top, left } = useMemo(() => {
    let left = 0;
    let top = 0;

    left =
      triggerDimensions.left - modalDimensions.width + triggerDimensions.width;
    // if the popup is outside the screen from the left
    if (triggerDimensions.left - modalDimensions.width < 0)
      left = triggerDimensions.left;

    if (isIOS) {
      const initialTriggerTop =
        triggerDimensions.top + triggerDimensions.height + 10;
      if (
        modalDimensions.height + initialTriggerTop >
        layoutHeight - keyboardHeight
      )
        top = triggerDimensions.top - modalDimensions.height - 10;
      else top = initialTriggerTop;
    } else {
      const initialTriggerTop =
        triggerDimensions.top +
        triggerDimensions.height +
        StatusBar.currentHeight;

      top =
        initialTriggerTop + modalDimensions.height >
        layoutHeight - keyboardHeight
          ? initialTriggerTop -
            triggerDimensions.height -
            modalDimensions.height
          : initialTriggerTop;
    }

    return { top, left };
  }, [modalDimensions, triggerDimensions, keyboardHeight]);

  const menuPositionStyles = { left, top };

  return (
    <>
      <Pressable
        onPress={() => {
          setMenuVisible(true);
        }}
        ref={triggerWrapperRef}
      >
        {trigger}
      </Pressable>
      <Portal hostName="menu">
        {menuVisible && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={styles.modalWrapper}
          >
            <Animated.View
              style={[styles.activeSection, menuPositionStyles]}
              collapsable={false}
              ref={itemsWrapperRef}
            >
              {/* pass the closeModal to children prop  */}
              {Array.isArray(children)
                ? children.map((childrenItem) => {
                    return React.cloneElement(childrenItem, {
                      closeModal,
                    });
                  })
                : React.cloneElement(children, {
                    closeModal,
                  })}
            </Animated.View>
          </TouchableOpacity>
        )}
      </Portal>
    </>
  );
};

export const MenuItem = ({ text, onPress, closeModal }) => {
  const styles = StyleSheet.create({
    body: {
      padding: 10,
    },
  });

  const handleOnPress = () => {
    onPress();
    closeModal();
  };

  return (
    <>
      <Pressable onPress={handleOnPress} style={styles.body}>
        <Text numberOfLines={1}>{text}</Text>
      </Pressable>
    </>
  );
};

export default Menu;
