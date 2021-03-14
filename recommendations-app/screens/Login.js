import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function LoginScreen({ navigation }) {
    return (
      <View style={ styles.container }>
        <Text style={ [styles.text, { fontSize: 30, marginBottom: 100 }] }>STASH</Text>
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
    }
});