import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Portal } from "@gorhom/portal";

const { width: layoutWidth, height: layoutHeight } = Dimensions.get("window");

const isIOS = Platform.OS === "ios";
const MenuWrapper = ({ trigger, children }) => {
  const viewRef = useRef(null);
  const activeSectionRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [activeSectionPosition, setActiveSectionPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  // const { keyboardHeight } = useKeyboardHeight();
  const keyboardHeight = 0;
  const [modalDimensions, setModalDimensions] = useState({
    width: 0,
    height: 0,
  });
  const styles = StyleSheet.create({
    modalWrapper: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 10,
      // backgroundColor: "red",
    },
    button: {
      width: "auto",
      alignSelf: "center",
    },
    activeSection: {
      ...Platform.select({
        ios: {
          backgroundColor: "green",
          alignSelf: "flex-start",
          maxWidth: layoutWidth * 0.7,

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
        modalDimensions.width !== 0 && activeSectionPosition.left !== 0 ? 1 : 0,
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

  const savePosition = (ref) => {
    ref?.current?.measureInWindow((x, y, width, height) => {
      const left = x;

      setActiveSectionPosition({
        top: Math.max(y, 0),
        left,
        width,
        height,
      });
    });
  };

  const isVisible = modalVisible;

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        if (viewRef?.current) savePosition(viewRef);
      }, 200);
    }
  }, [isVisible]);

  useEffect(() => {
    if (activeSectionRef && modalDimensions.width === 0)
      setTimeout(() => {
        activeSectionRef.current?.measureInWindow((x, y, width, height) => {
          setModalDimensions({ width, height });
        });
      }, 200);
  }, [isVisible, activeSectionRef, setModalDimensions, modalDimensions]);

  const closeModal = () => {
    setModalVisible(false);
    setModalDimensions({ width: 0, height: 0 });
    setActiveSectionPosition({ top: 0, left: 0, width: 0, height: 0 });
  };

  let left = 0;

  let top = null;

  if (isIOS) {
    const initialTriggerTop =
      activeSectionPosition.top + activeSectionPosition.height;
    if (modalDimensions.height + initialTriggerTop > layoutHeight)
      top = activeSectionPosition.top - modalDimensions.height;
    else top = activeSectionPosition.top + activeSectionPosition.height;
  }

  const activeStyles =
    top !== null ? { left, top } : { left, bottom: 0, marginBottom: 5 };
  console.log({
    top,
    left,
  });
  return (
    <>
      {!!trigger && (
        <Pressable
          style={[styles.button]}
          onPress={() => {
            setModalVisible(true);
          }}
          ref={viewRef}
        >
          {trigger}
        </Pressable>
      )}
      {modalVisible && (
        <Portal hostName="menu">
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={styles.modalWrapper}
          >
            <View
              style={[
                activeStyles,
                {
                  padding: 10,
                  backgroundColor: "white",
                  alignSelf: "flex-start",
                },
              ]}
              collapsable={false}
              ref={activeSectionRef}
            >
              <View style={styles.overlay}>
                {/* <MenuContext.Provider value={{ closeModal }}> */}
                {children}

                {/* </MenuContext.Provider> */}
              </View>
            </View>
          </TouchableOpacity>
        </Portal>
      )}
    </>
  );
};

export default MenuWrapper;
