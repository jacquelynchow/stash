import {React,useEffect} from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import MediaGroup from '../components/MediaGroup';
import bookIcon from '../assets/type-icons/book.png';
import movieIcon from '../assets/type-icons/movie.png';
import songIcon from '../assets/type-icons/song.png';
import tiktokIcon from '../assets/type-icons/tiktok.png';
import articleIcon from '../assets/type-icons/article.png';
import youtubeIcon from '../assets/type-icons/youtube.png';
import {getNumRecsForUser, getNumRecsForMedia } from '../API/firebaseMethods';


const ByMedia = (props) => {
    // TODO: If No Recs, show message screen, else show recs by type
        //if recList for all recs for the user is empty then show message screen
        //else show mediaType tiles with num of recommendations in each
    // TODO: For loop and showing Tiles with real data
        // search for recs with certain media_type for USERID & get # of recs for that media
        // able to show the # of ppl?
    //TODO: need an "other" category since that is one of the options when sending a rec?
    //      and maybe an "images" category too? or group these together and make 7 options on screen?

//TODO: fix getNumRecsForMedia and put in for numRecs

    return (
        
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.container}>
                <MediaGroup mediaType={"Articles"} numRecs={10} numPeople={2} image={articleIcon}/>
                {/*<MediaGroup mediaType={"Books"} numRecs={showRecs("Books")} numPeople={2} image={bookIcon} />
                <MediaGroup mediaType={"Movies"} numRecs={getNumRecsForMedia("Movies")} numPeople={2} image={movieIcon} />
                <MediaGroup mediaType={"Songs"} numRecs={getNumRecsForMedia("Songs")} numPeople={2} image={songIcon} />
                <MediaGroup mediaType={"TikToks"} numRecs={getNumRecsForMedia("TikToks")} numPeople={2} image={tiktokIcon} />
                <MediaGroup mediaType={"Youtube"} numRecs={getNumRecsForMedia("Youtube")} numPeople={2} image={youtubeIcon} />*/}
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
