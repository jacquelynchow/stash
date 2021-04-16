import React, {useEffect, useState, useCallback} from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import MediaGroup from '../components/MediaGroup';
import bookIcon from '../assets/type-icons/book.png';
import movieIcon from '../assets/type-icons/movie.png';
import songIcon from '../assets/type-icons/song.png';
import tiktokIcon from '../assets/type-icons/tiktok.png';
import articleIcon from '../assets/type-icons/article.png';
import youtubeIcon from '../assets/type-icons/youtube.png';
import {getMediaRecs } from '../API/firebaseMethods';



const ByMedia = () => {

    function numRecsForMedia(media_Type) {
        const [recs, setRecs] = useState([]);
        useEffect(() => {
        getMediaRecs(onRecsReceived,media_Type);
        }, []); 

        const onRecsReceived = (recList) => {
        setRecs(recList);
        };  
  

        const [refreshing, setRefreshing] = useState(false);
        const onRefresh = useCallback(async () => {
            setRefreshing(true);
            await getMediaRecs(onRecsReceived,media_Type) // use await to refresh until function finished
            .then(() => setRefreshing(false));
        }, []);
        const numRecs = recs.length;
        return numRecs;
    }
  

    return (
        <View style={{flex: 1}}>


            {/* Show various rec types */}
            <ScrollView contentContainerStyle={styles.container}>
                <MediaGroup mediaType={"Articles"} numRecs={numRecsForMedia('Article')} numPeople={2} image={articleIcon}/>
                <MediaGroup mediaType={"Books"} numRecs={numRecsForMedia('Book')} numPeople={2} image={bookIcon} />
                <MediaGroup mediaType={"Movies"} numRecs={numRecsForMedia('Movie')} numPeople={2} image={movieIcon} />
                <MediaGroup mediaType={"Songs"} numRecs={numRecsForMedia('Song')} numPeople={2} image={songIcon} />
                <MediaGroup mediaType={"TikToks"} numRecs={numRecsForMedia('TikTok')} numPeople={2} image={tiktokIcon} />
                <MediaGroup mediaType={"Youtube"} numRecs={numRecsForMedia('Youtube')} numPeople={2} image={youtubeIcon} />
                {/* is having the number of people neccessary for showing by media? */}
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
