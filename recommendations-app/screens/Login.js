import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import logo from '../assets/stash-transparent.png';

export default function LoginScreen({ navigation }) {
    return (
      <View style={ styles.container }>
        <Image source={logo} style={styles.logo} />
        <Text style={ styles.text }>Screen 1: Login & Onboarding</Text>
        <Button title="Go to Homepage" onPress={() => navigation.navigate('Home')} />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "#d68c45",
    },
    text: {
        color: "#fcfbfb"
    },
    logo: {
      marginTop: 0,
      paddingTop: 0,
      width: 250,
      height: 150,
    }
});