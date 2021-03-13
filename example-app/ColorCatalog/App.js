// Example Application
// Code from LinkedIn Learning Course: Learning React Native by Alex Banks 
// Link to course: https://www.linkedin.com/learning-login/share?forceAccount=false&redirect=https%3A%2F%2Fwww.linkedin.com%2Flearning%2Flearning-react-native%3Ftrk%3Dshare_ent_url%26shareId%3DbjQJNdnDQ7%252Bk1f8ffDSyyA%253D%253D&account=76206914

import React from "react";
import ColorList from "./components/ColorList";
import ColorDetails from "./components/ColorDetails";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const { Navigator, Screen } = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Navigator>
        <Screen
          name="Home"
          options={{ title: "Color List" }}
          component={ColorList}
        />
        <Screen name="Details" component={ColorDetails} />
      </Navigator>
    </NavigationContainer>
  );
}
