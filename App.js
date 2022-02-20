import * as React from "react";
import { View, Text, TextInput } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import Menu, { MenuItem } from "./src/components/MenuPopup";

function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <TextInput style={{ width: 100, height: 20, backgroundColor: "red" }} />
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {Array(100)
          .fill("1")
          .map(() => (
            <View style={{ padding: 15 }}>
              <Menu trigger={<Text>press here</Text>}>
                <MenuItem
                  text={"Title"}
                  onPress={() => console.log("option pressed")}
                />
                <MenuItem
                  text={"Recently Added"}
                  onPress={() => console.log("option pressed")}
                />
                <MenuItem
                  text={"Recently Played"}
                  onPress={() => console.log("option pressed")}
                />
                <MenuItem
                  text={"Playlist type"}
                  onPress={() => console.log("option pressed")}
                  lastItem
                />
              </Menu>
            </View>
          ))}
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <PortalProvider>
        <PortalHost name="menu" />
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </PortalProvider>
    </NavigationContainer>
  );
}

export default App;
