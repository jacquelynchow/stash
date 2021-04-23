import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebase from 'firebase';
import { MenuProvider } from 'react-native-popup-menu';
// Screens
import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import PodPage from './screens/PodPage';
import MediaTypePage from './screens/MediaTypePage';
import LoadingScreen from './screens/Loading';
// Components
import Logout from './components/Logout';
import Back from './components/Back';
import StashLogo from './assets/stash-transparent.png';
// Config File
import apiKeys from './config/keys';

const Stack = createStackNavigator();

// icon header that shows image on top right corner
function IconHeader(props) {
  return (
    <Image
    source={{ uri: props.uri }}
    style={{ width: 40, height: 40, borderRadius: 40/2, marginRight : 15, marginBottom: 5 }} />
  );
}
// stash logo header that shows image on top left corner
function StashIconHeader() {
  return (
    <Image
    source={StashLogo}
    style={{ width: 80, height: 60, resizeMode: "contain", marginLeft: 22, marginBottom: 10 }} />
  );
}

export default function App() {
  const headerTitleStyles = { color: "#6F1D1B", fontWeight: "600", fontSize: 18 }

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
            options= {{
              headerTitle: null,
              headerRight: () => <Logout/>,
              headerTitleContainerStyle: { marginBottom: 10 },
              headerLeft: ()=> <StashIconHeader />,
              gestureEnabled: false // don't let user accidentally swipe back to login screen
            }}
          />
          <Stack.Screen name="Pod" component={PodPage}
            options= {
              ({ route }) => ({ title: route.params.name,
                headerLeft: () => <Back/>,
                headerTitleContainerStyle: { marginBottom: 5 },
                headerTitleStyle: headerTitleStyles,
                headerRight: () => (
                  <IconHeader uri={route.params.uri} />
                )
              })
            }/>
          <Stack.Screen name="MediaType" component={MediaTypePage}
            options= {
              ({ route }) => ({ title: route.params.media_Type,
              headerLeft: () => <Back/>,
              headerTitleContainerStyle: { marginBottom: 5 },
              headerTitleStyle: headerTitleStyles
            })
          }/>
          <Stack.Screen name="Loading" component={LoadingScreen}
            options= {{
              headerLeft: ()=> null,
              headerTitleContainerStyle: { marginBottom: 5 },
              headerTitleStyle: headerTitleStyles
            }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}
