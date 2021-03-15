import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ByPod from './ByPod';
import MediaGroup from '../components/MediaGroup';
import ByMedia from './ByMedia';

// set up tab navigation
const Tab = createMaterialTopTabNavigator();

function PodsTab() {
    return (
      <View style={ styles.container }>
        <ByPod/>
      </View>
    );
}
  
  function RecsTab() {
    return (
      <View style={ styles.container }>
        {/* <Text>Tab 2: Your Recs</Text> */}
        <ByMedia/>
      </View>
    );
}

export default function HomeScreen() {
    return (
        <Tab.Navigator>
            {/* set up routes for toggling between tabs  */}
            <Tab.Screen name="Your Pods" component={PodsTab} />
            <Tab.Screen name="All Recommendations" component={RecsTab} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
});