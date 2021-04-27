import React, {useEffect, useState, useCallback} from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Text, Dimensions } from 'react-native';
// Components
import MediaGroup from '../components/MediaGroup';
import bookIcon from '../assets/type-icons/book.png';
import movieIcon from '../assets/type-icons/movie.png';
import songIcon from '../assets/type-icons/song.png';
import tiktokIcon from '../assets/type-icons/tiktok.png';
import articleIcon from '../assets/type-icons/article.png';
import youtubeIcon from '../assets/type-icons/youtube.png';
// Server related
import {getNumRecsAndPeople } from '../API/firebaseMethods';

const windowHeight = Dimensions.get('window').height;

const ByMedia = (props) => {
    const currentUserUID = props.userId; //gets current user's ID
    const [dict, setDict] = useState({});
    useEffect(() => {
        getNumRecsAndPeople(mediaDict);
    }, []);

    const mediaDict = (dictForMedia) => {
        setDict(dictForMedia);
    };

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await getNumRecsAndPeople(mediaDict) // use await to refresh until function finished
        .then(() => setRefreshing(false));
    }, []);

    //display icon according to media type
    function mediaIcon(mediaType){
        if (mediaType == "Article") {
            return articleIcon
        }
        else if (mediaType == "Book") {
            return bookIcon
        }
        else if (mediaType == "Movie") {
            return movieIcon
        }
        else if (mediaType == "Song") {
            return songIcon
        }
        else if (mediaType == "TikTok") {
            return tiktokIcon
        }
        else if (mediaType == "YouTube") {
            return youtubeIcon
        }
    }

    return (
        <View style={{flex: 1}}>

            {/* Show various rec types that the user has */}
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                {dict && Object.keys(dict).length > 0 ?
                    Object.entries(dict).map(([mediaType,[numMediaRec,numSenders]]) =>
                        <MediaGroup key = {mediaType}
                        mediaType={mediaType+ 's'}
                         numRecs={numMediaRec}
                         numPeople={numSenders}
                         image={mediaIcon(mediaType)}
                         userId={currentUserUID} />) :
                    <View style={styles.centeredView}>
                        {/* If no recs exist for the user */}
                        <Text style={styles.noRecsYetTitle}>No recommendations yet!</Text>
                        <Text style={styles.noRecsYetText}>Send/receive recommendations in a pod</Text>
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
})

export default ByMedia;
