import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import Menu from "./src/components/MenuPopup";

function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* <Text>Home Screen</Text> */}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {Array(100)
          .fill("1")
          .map(() => (
            <View style={{ padding: 15 }}>
              <Menu trigger={<Text>press here</Text>}>
                <Text>holla amigo</Text>
                <Text>holla amigo</Text>
                <Text>holla amigo</Text>
                <Text>holla amigo</Text>
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
