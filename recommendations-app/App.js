import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import PodPage from './screens/PodPage';
import Logout from './components/Logout';
import Back from './components/Back';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* set initial route upon app opening */}
      <Stack.Navigator initialRouteName="Login">
        {/* set up routes for each screen */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} 
          options= {{headerRight: () => (
            <Logout/>),
          }}
        />
        <Stack.Screen name="Pod" component={PodPage} 
          options= {{headerLeft: () => (
            <Back/>),
          }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
