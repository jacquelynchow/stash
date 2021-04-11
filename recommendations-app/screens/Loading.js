import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import * as firebase from 'firebase';

export default function LoadingScreen({ navigation }) {
  // check if a user is logged in, redirects to appropriate page
  useEffect(
     () => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // logged in
          console.log(user.uid);
          navigation.navigate('Home', {userId: user.uid});
        } else {
          // signed out
          navigation.navigate('Login');
        }
      });
    }
  );

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fcfbfb',
    alignItems: 'center',
    justifyContent: 'center',
  },
});