import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Pressable, Text, Button, Alert} from 'react-native';
import RecTile from '../components/RecTile';

//will create function that shows the recs from only 1 media type
{/*
function showMediaType() {
  if (props.mediaType == "Article") {
    return 
  }
  else if (props.mediaType == "Book") {
    return 
  }
  else if (props.mediaType == "Movie") {
    return 
  }
  else if (props.mediaType == "Song") {
    return 
  }
  else if (props.mediaType == "TikTok") {
    return 
  }
  else if (props.mediaType == "Video") {
    return 
  }
}
*/}

export default function MediaTypePage() {

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        {/*instead show the recommendations from only 1 media type*/}
        {/*Show recs with the same media_type for USERID */}
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
