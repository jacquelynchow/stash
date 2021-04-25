import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Tiles to display media types under "All Recommendations" view of home page
const MediaGroup = (props) => {
    const navigation = useNavigation();

    //gets the correct media type for each media tile
    function getMediaType () {
        if (props.mediaType == 'Articles') {
            return 'Article'
        }
        else if (props.mediaType == 'Books') {
            return 'Book'
        }
        else if (props.mediaType == 'Movies') {
            return 'Movie'
        }
        else if (props.mediaType == 'Songs') {
            return 'Song'
        }
        else if (props.mediaType == 'TikToks') {
            return 'TikTok'
        }
        else if (props.mediaType == 'YouTube'){
            return 'YouTube'
        }
    }

    {/*if only 1 person sent recs for a media type displays "person"
    otherwise displays "people" */}
    function recsFromPeople (numPeople) {
        if (numPeople ==1){
            return "person"
        }
        else {
            return "people"
        }
    }

    return (
        
        <View style={styles.item}>
            {/* Displays number of recs and number of senders for a specific media type */}
            <TouchableOpacity activeOpacity={.7} onPress={() => navigation.navigate('MediaType',{media_Type: getMediaType(), ...props})}>
                <Image source={props.image} style={styles.mediaImage}></Image>
                <Text style={styles.name}>{props.mediaType} ({props.numRecs})</Text>
                <Text style={styles.numRecs}>Recommendations from {props.numPeople} {recsFromPeople(props.numPeople)}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
      width: '45%', // almost half of container width
      borderColor: "black",
      borderRadius: 10,
      backgroundColor: "#ffffff",
      marginBottom: 20,
      marginTop: 0,
      marginHorizontal: '2%',
      // ios
      shadowOffset: {width: 10, height: 10},
      shadowOpacity: 0.1,
      shadowRadius: 10,
      // android
      elevation: 2,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 15,
        paddingBottom: 0,
    },
    numRecs: {
        padding: 15,
        paddingTop: 5,
    },
    mediaImage: {
        marginLeft: 15,
        width: 130,
        height: 130,
        marginTop: 20,
        borderRadius: 10,
    }
})

export default MediaGroup;
