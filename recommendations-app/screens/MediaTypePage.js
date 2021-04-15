import React, { useEffect, useState,useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Pressable, Text, Button, Alert, Dimensions, RefreshControl} from 'react-native';
import RecTile from '../components/RecTile';
import {getMediaRecs, getNumRecsForMedia, getRecs} from '../API/firebaseMethods';
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
const windowHeight = Dimensions.get('window').height;

export default function MediaTypePage() {
  const [recs, setRecs] = useState([]);
  useEffect(() => {
    getMediaRecs(onRecsReceived);
  }, []); 

  const onRecsReceived = (recList) => {
    setRecs(recList);
  };  

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
          setRefreshing(true);
          await getMediaRecs(onRecsReceived) // use await to refresh until function finished
          .then(() => setRefreshing(false));
      }, []);

   {/*const [recs] = useState([]);
  useEffect(() => {
    getMediaRecs(onRecsReceived);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getMediaRecs(onRecsReceived) // use await to refresh until function finished
    .then(() => setRefreshing(false));
  }, []);
  */}
  return (
    <View style={{flex: 1}}>
      <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }>

          {/* make a rec for each rec stored in the recs list */}
          {recs && recs.length > 0 ?
              recs.map(rec => <RecTile key={rec.key} recName={rec.rec_title}
                  mediaType={rec.rec_type} recSender={rec.rec_sender} groupName={rec.rec_pod}
                  recAuthor={rec.rec_author} recLink={rec.rec_link} recComment={rec.rec_comment}/>) :
              <View style={styles.centeredView}>
                  <Text>No recommendations yet</Text>
              </View>
          }

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
