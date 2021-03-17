import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import MediaGroup from '../components/MediaGroup';
import bookIcon from '../assets/type-icons/book.png';
import movieIcon from '../assets/type-icons/movie.png';
import songIcon from '../assets/type-icons/song.png';
import tiktokIcon from '../assets/type-icons/tiktok.png';
import articleIcon from '../assets/type-icons/article.png';
import youtubeIcon from '../assets/type-icons/youtube.png';

const ByMedia = () => {
    // TODO: If No Recs, show message screen, else show recs by type
    // TODO: For loop and showing Tiles with real data

    return (
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.container}>
                <MediaGroup mediaType={"Books"} numRecs={10} numPeople={2} image={bookIcon} />
                <MediaGroup mediaType={"Movies"} numRecs={10} numPeople={2} image={movieIcon} />
                <MediaGroup mediaType={"Songs"} numRecs={10} numPeople={2} image={songIcon} />
                <MediaGroup mediaType={"TikToks"} numRecs={10} numPeople={2} image={tiktokIcon} />
                <MediaGroup mediaType={"Articles"} numRecs={10} numPeople={2} image={articleIcon}/>
                <MediaGroup mediaType={"Youtube"} numRecs={10} numPeople={2} image={youtubeIcon} />
            </ScrollView>
        </View>
    )
}
// if have no recommendations 

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginHorizontal: 10,
        paddingBottom: 30,
        flexGrow:1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    item: {
        width: '50%' // is 50% of container width
    }, 
    textBox: {
        margin: 50,
        padding: 30,
        alignContent: 'center',
        justifyContent: 'center',
    }
})

export default ByMedia;