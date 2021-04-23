import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import * as firebase from 'firebase';

export default function LoadingScreen({ navigation }) {
  const [username, setUsername] = useState('');

  // check if a user is logged in, redirects to appropriate page
  useEffect(
     () => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // logged in
          // get username of current user from database
          const db = firebase.firestore();
          var docRef = db.collection("users").doc(user.uid);

          docRef.get().then((doc) => {
              if (doc.exists) {
                  console.log("Username retrieved!", doc.data().username);
                  setUsername(doc.data().username);
                  navigation.navigate('Home', {userId: user.uid, username: username});
              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
              }
          }).catch((error) => {
              console.log("Error getting document:", error);
          });    
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