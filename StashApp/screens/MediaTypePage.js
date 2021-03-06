import React, { useEffect, useState,useCallback } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions, RefreshControl } from 'react-native';
// Components
import RecTile from '../components/RecTile';
// Server related
import {getMediaRecs} from '../API/firebaseMethods';

const windowHeight = Dimensions.get('window').height;

// view of all recommendations of a certain media type
export default function MediaTypePage({navigation, route }) {
  const recData = JSON.parse(JSON.stringify(route.params));
  const media_Type = recData.media_Type; //gets media type according to which media type was clicked
  const currentUserUID = recData.userId; //gets current user's ID

  const [recs, setRecs] = useState([]);
  useEffect(() => {
    getMediaRecs(onRecsReceived, media_Type);
  }, []);

  const onRecsReceived = (recList) => {
    setRecs(recList);
  };

  // refresh page function to see new recs
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getMediaRecs(onRecsReceived,media_Type) // use await to refresh until function finished
    .then(() => setRefreshing(false));
  }, []);

  return (
    <View style={{flex: 1}}>
      {/* Pull screen down for recommendations refresh */}
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
              recs.map((rec, index) =>
                <RecTile key={index}
                  recId={rec.id}
                  podId={rec.pod_id}
                  recName={rec.rec_title}
                  mediaType={rec.rec_type}
                  recSender={rec.rec_sender}
                  groupName={rec.rec_pod}
                  recAuthor={rec.rec_author}
                  recLink={rec.rec_link}
                  recGenre={rec.rec_genre}
                  recYear={rec.rec_year}
                  recComment={rec.rec_comment}
                  seenBy={rec.seenBy}
                  currentUserUID={currentUserUID}
                  recs={recs}
                  onRecsReceived={onRecsReceived}
                  media_Type={media_Type}
                  refresh={onRefresh}
                  fromMediaTypePage={true}
                  fromPodPage={false} />) :
              <View style={styles.centeredView}>
                {/* If no recs of certain media type exists for the user */}
                  <Text style={styles.noRecsYetTitle}>No recommendations of this type yet!</Text>
                  <Text style={styles.noRecsYetText}>Send/receive recommendations in a pod and they will appear here</Text>
              </View>
          }

        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 10,
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
  },
  noRecsYetTitle: {
      marginTop: windowHeight/4,
      textAlign: "center",
      color: "#6F1D1B",
      fontWeight: "700",
      marginLeft:25,
      marginRight:25,
      fontSize: 22,
  },
  noRecsYetText: {
      textAlign: "center",
      color: "#6F1D1B",
      fontStyle: 'italic',
      marginLeft:25,
      marginRight:25,
      marginTop: 10,
      fontSize: 14
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  }
});
