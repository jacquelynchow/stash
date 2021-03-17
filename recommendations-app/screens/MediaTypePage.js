import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MediaTypePage() {
    return (
      <View style={ styles.container }>
        <Text style={ styles.text }>Screen 4: Media Type Page</Text>
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