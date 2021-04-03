import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import PodPage from './screens/PodPage';
import MediaTypePage from './screens/MediaTypePage';
import Logout from './components/Logout';
import Back from './components/Back';
import * as firebase from 'firebase';
import apiKeys from './config/keys';
import LoadingScreen from './screens/Loading';

const Stack = createStackNavigator();

export default function App() {
  // init firebase app with config keys
  if (!firebase.apps.length) {
    console.log('Connected with Firebase')
    firebase.initializeApp(apiKeys.firebaseConfig);
  }

  return (
    <NavigationContainer>
      {/* set initial route upon app opening */}
      <Stack.Navigator initialRouteName="Login">
        {/* set up routes for each screen */}
        <Stack.Screen name="Login" component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} 
          options= {{headerRight: () => (
            <Logout/>), headerTintColor: '#6f1d1b'
          }}
        />
        <Stack.Screen name="Pod" component={PodPage} 
          options= {{headerLeft: () => (
            <Back/>),
          }}/>
        <Stack.Screen name="MediaType" component={MediaTypePage} 
          options= {{headerLeft: () => (
            <Back/>),
          }}/>
        <Stack.Screen name="Loading" component={LoadingScreen} 
          options= {{headerLeft: () => (
            <Back/>),
          }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
