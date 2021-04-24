import React, {useEffect, useState, useCallback} from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import MediaGroup from '../components/MediaGroup';
import bookIcon from '../assets/type-icons/book.png';
import movieIcon from '../assets/type-icons/movie.png';
import songIcon from '../assets/type-icons/song.png';
import tiktokIcon from '../assets/type-icons/tiktok.png';
import articleIcon from '../assets/type-icons/article.png';
import youtubeIcon from '../assets/type-icons/youtube.png';
import {getMediaRecs } from '../API/firebaseMethods';


// Second view of homescreen displaying media types under "All Recommendations"
const ByMedia = (props) => {
    const currentUserUID = props.userId;

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
      }, []);

    // to count the number of recommendations of each media type
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

    // to count the number of people who sent recommendations of each media type
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

            {/* Show various rec types */}
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
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
