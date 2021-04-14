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
import { MenuProvider } from 'react-native-popup-menu';

const Stack = createStackNavigator();

export default function App() {
  // init firebase app with config keys
  if (!firebase.apps.length) {
    console.log('Connected with Firebase')
    firebase.initializeApp(apiKeys.firebaseConfig);
  }

  return (
    <MenuProvider>
      <NavigationContainer>
      {/* set initial route upon app opening to loading - redirects to home page if logged in already*/}
      <Stack.Navigator initialRouteName="Loading">
        {/* set up routes for each screen */}
        <Stack.Screen name="Login" component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} 
          options= {{headerRight: () => (
            <Logout/>), headerTintColor: '#6f1d1b', headerLeft: ()=> null, // remove back button, must logout
            gestureEnabled: false // don't let user accidentally swipe back to login screen
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
          options= {{ headerLeft: ()=> null
          }}/>
      </Stack.Navigator>
    </NavigationContainer>
    </MenuProvider>
  );
}
