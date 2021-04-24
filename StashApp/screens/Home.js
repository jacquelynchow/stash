import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ByPod from './ByPod';
import ByMedia from './ByMedia';

const windowWidth = Dimensions.get('window').width;

// set up tab navigation
const Tab = createMaterialTopTabNavigator();

function PodsTab(props) {
    return (
      <View style={ styles.container }>
        <ByPod userId={props.userId} username={props.username} />
      </View>
    );
}
  
  function RecsTab(props) {
    return (
      <View style={ styles.container }>
        <ByMedia userId={props.userId} />
      </View>
    );
}

export default function HomeScreen({route}) { 
  const userId = route.params.userId;
  const username = route.params.username;

    return (
        <Tab.Navigator  
        // style tabs 
        tabBarOptions={{
          justifyContent: 'center',
          labelStyle: { 
            fontSize: 14, 
            marginBottom: 20, 
            fontWeight: 'bold', 
            textTransform: 'capitalize',
          },
          tabStyle: { flex: .5, height: 60 },
          activeTintColor: '#d68c45',
          inactiveTintColor: '#ffc9b9',
          indicatorStyle: { 
            backgroundColor: '#d68c45', 
            marginBottom: 10, 
            height: 15, 
            width: windowWidth/2 - 70, 
            marginLeft: 35,
            borderRadius: 12, 
            opacity: 0.5, 
          }
        }}>
            {/* set up routes for toggling between tabs  */}
            <Tab.Screen name="Your Pods" children={()=><PodsTab userId={userId} username={username}/>}/>
            <Tab.Screen name="All Recommendations" children={()=><RecsTab userId={userId} />} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});