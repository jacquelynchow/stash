import React, {useEffect, useState, useCallback} from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
// Components
import MediaGroup from '../components/MediaGroup';
import bookIcon from '../assets/type-icons/book.png';
import movieIcon from '../assets/type-icons/movie.png';
import songIcon from '../assets/type-icons/song.png';
import tiktokIcon from '../assets/type-icons/tiktok.png';
import articleIcon from '../assets/type-icons/article.png';
import youtubeIcon from '../assets/type-icons/youtube.png';
// Server related
import {getMediaRecs } from '../API/firebaseMethods';

const ByMedia = (props) => {
    const currentUserUID = props.userId;

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
      }, []);

    //create function for refresh and give media_type as argument
    // function refreshForType(media_Type){
    //     const [refreshing, setRefreshing] = useState(false);
    //     const onRefresh = useCallback(async () => {
    //         setRefreshing(true);
    //         await getMediaRecs(onRecsReceived,media_Type) // use await to refresh until function finished
    //         .then(() => setRefreshing(false));
    //     }, []);
    //     return [onRefresh, refreshing];
    // }

    //gets number of user's recs for specific media type
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
  
    //gets number of people who sent recs of specific media type to the user
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

    var recTypes = ['Article','Book','Movie','Song','TikTok','YouTube'];

    return (
        <View style={{flex: 1}}>

            {/* Displays the 6 media types and the number of recs and number of senders for each media type  */}
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                    //refresh for all media types
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }> 
                <MediaGroup mediaType={"Articles"} numRecs={numRecsForMedia('Article')} numPeople={numPeopleForMedia('Article')} image={articleIcon} userId={currentUserUID} />
                <MediaGroup mediaType={"Books"} numRecs={numRecsForMedia('Book')} numPeople={numPeopleForMedia('Book')} image={bookIcon} userId={currentUserUID} />
                <MediaGroup mediaType={"Movies"} numRecs={numRecsForMedia('Movie')} numPeople={numPeopleForMedia('Movie')} image={movieIcon} userId={currentUserUID} />
                <MediaGroup mediaType={"Songs"} numRecs={numRecsForMedia('Song')} numPeople={numPeopleForMedia('Song')} image={songIcon} userId={currentUserUID} />
                <MediaGroup mediaType={"TikToks"} numRecs={numRecsForMedia('TikTok')} numPeople={numPeopleForMedia('TikTok')} image={tiktokIcon} userId={currentUserUID} />
                <MediaGroup mediaType={"YouTube"} numRecs={numRecsForMedia('YouTube')} numPeople={numPeopleForMedia('YouTube')} image={youtubeIcon} userId={currentUserUID} />
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
        alignItems: 'flex-start' 
    },
    textBox: {
        margin: 50,
        padding: 30,
        alignContent: 'center',
        justifyContent: 'center',
    }
})

export default ByMedia;