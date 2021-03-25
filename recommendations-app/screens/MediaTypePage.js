import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Pressable, Text, Button, Alert} from 'react-native';
import RecTile from '../components/RecTile';

export default function MediaTypePage() {

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <RecTile recName={"Rec 1"} mediaType={"Book"}/>
        <RecTile recName={"Rec 2"} mediaType={"Book"}/>
        <RecTile recName={"Rec 3"} mediaType={"Book"}/>
      </ScrollView>
    </View>

  )
}



const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 30,
    flexGrow:1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: "#f2f2f2"
  },
  text: {
      color: "#fcfbfb"
  }
});
