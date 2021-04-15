import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Pressable, Text, Button, Alert} from 'react-native';
import RecTile from '../components/RecTile';
import {getMediaRecs} from '../API/firebaseMethods';
//will create function that shows the recs from only 1 media type
//TODO: figure out how to get the mediaType that should be displaying
{/*
function showMediaType() {
  if (props.mediaType == "Article") {
    return //list of recs with rec_type == "Article"
  }
  else if (props.mediaType == "Book") {
    return //list of recs with rec_type == "Book"
  }
  else if (props.mediaType == "Movie") {
    return //list of recs with rec_type == "Movi"
  }
  else if (props.mediaType == "Song") {
    return //list of recs with rec_type == "Song"
  }
  else if (props.mediaType == "TikTok") {
    return //list of recs with rec_type == "TikTok"
  }
  else if (props.mediaType == "Video") {
    return //list of recs with rec_type == "Video"
  }
}
*/}

export default function MediaTypePage() {
  const [recs] = useState([]);
  useEffect(() => {
    getMediaRecs(onRecsReceived);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getMediaRecs(onRecsReceived) // use await to refresh until function finished
    .then(() => setRefreshing(false));
  }, []);
  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        {/*instead show the recommendations from only 1 media type*/}
        {/*Show recs with the same media_type for USERID 
          TODO: call showMediaType
        */}
        
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
