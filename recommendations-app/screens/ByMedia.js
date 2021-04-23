import React, {useEffect, useState, useCallback} from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import MediaGroup from '../components/MediaGroup';
import bookIcon from '../assets/type-icons/book.png';
import movieIcon from '../assets/type-icons/movie.png';
import songIcon from '../assets/type-icons/song.png';
import tiktokIcon from '../assets/type-icons/tiktok.png';
import articleIcon from '../assets/type-icons/article.png';
import youtubeIcon from '../assets/type-icons/youtube.png';
import * as firebase from 'firebase';
import {getMediaRecs } from '../API/firebaseMethods';

//TODO uncomment code to make screen refresh start - need route.params
const ByMedia = ({navigation, route }) => {

    //console.log(route.params);

    {/*const recData = JSON.parse(JSON.stringify(route.params));
    const media_Type = recData.media_Type;
    const [recs, setRecs] = useState([]);
    useEffect(() => {
      getMediaRecs(onRecsReceived,media_Type);
    }, []);


    // refresh page function to see new recs
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
            setRefreshing(true);
            await getMediaRecs(onRecsReceived,media_Type) // use await to refresh until function finished
            .then(() => setRefreshing(false));
        }, []);*/}

      const onRecsReceived = (recList) => {
        setRecs(recList);
      };

      //gets number of recs for specific media type
      function numRecsForMedia(media_Type) {
          const [recs, setRecs] = useState([]);
          useEffect(() => {
          getMediaRecs(onRecsReceived,media_Type);
          }, []);
          const onRecsReceived = (recList) => {
            setRecs(recList);
            };

          const numRecs = recs.length;
          return numRecs;
      }

      //gets number of people who sent recs of specific media type
      function numPeopleForMedia(media_Type) {
          const [recs, setRecs] = useState([]);
          useEffect(() => {
          getMediaRecs(onRecsReceived,media_Type);
          }, []);

          const onRecsReceived = (recList) => {
          setRecs(recList);
          };
          const ppl = [];
          for(var i=0; i<recs.length;i++) {
              if (!(ppl.includes(recs[i].rec_sender))) {
                  ppl.push(recs[i].rec_sender)
              }
          }
          const numPpl = ppl.length;
          return numPpl;
      }

    return (
        <View style={{flex: 1}}>
            {/* TODO: refresh page -- not currently working*/}
            {/* Pull screen down for recommendations refresh */}
            {/*<ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }>
            </ScrollView>*/}

            {/* Show various rec types */}
            <ScrollView contentContainerStyle={styles.container}>
                <MediaGroup mediaType={"Articles"} numRecs={numRecsForMedia('Article')} numPeople={numPeopleForMedia('Article')} image={articleIcon}/>
                <MediaGroup mediaType={"Books"} numRecs={numRecsForMedia('Book')} numPeople={numPeopleForMedia('Book')} image={bookIcon} />
                <MediaGroup mediaType={"Movies"} numRecs={numRecsForMedia('Movie')} numPeople={numPeopleForMedia('Movie')} image={movieIcon} />
                <MediaGroup mediaType={"Songs"} numRecs={numRecsForMedia('Song')} numPeople={numPeopleForMedia('Song')} image={songIcon} />
                <MediaGroup mediaType={"TikToks"} numRecs={numRecsForMedia('TikTok')} numPeople={numPeopleForMedia('TikTok')} image={tiktokIcon} />
                <MediaGroup mediaType={"Youtube"} numRecs={numRecsForMedia('Youtube')} numPeople={numPeopleForMedia('Youtube')} image={youtubeIcon} />
            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        marginHorizontal: 10,
        paddingBottom: 30,
        flexGrow:1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    textBox: {
        margin: 50,
        padding: 30,
        alignContent: 'center',
        justifyContent: 'center',
    }
})

export default ByMedia;
