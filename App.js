import * as React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import Menu, { MenuItem } from "./src/components/MenuPopup";

function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="This is a text input"
        style={{ width: "100%", height: 40, borderWidth: 1 }}
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {Array(100)
          .fill("1")
          .map((item, index) => (
            <View style={{ padding: 15 }} key={index.toString()}>
              <Menu trigger={<Text>press here</Text>}>
                <MenuItem
                  text={"Title"}
                  onPress={() => alert("option pressed")}
                />
                <MenuItem
                  text={"Recently Added"}
                  onPress={() => alert("option pressed")}
                />
                <MenuItem
                  text={"Recently Played"}
                  onPress={() => alert("option pressed")}
                />
                <MenuItem
                  text={"Playlist type"}
                  onPress={() => alert("option pressed")}
                  lastItem
                />
              </Menu>
            </View>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
const Stack = createNativeStackNavigator();

function App() {
  return (
    <PortalProvider>
      <NavigationContainer>
        <View
          style={{
            flex: 1,
            backgroundColor: "red",
          }}
        >
          <PortalHost name="menu" />
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </PortalProvider>
  );
}

export default App;
