import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MediaGroup = (props) => {
    const navigation = useNavigation();
    return (
        <View style={styles.item}>
            <TouchableOpacity activeOpacity={.7} onPress={() => navigation.navigate('MediaType')}>
                <Image source={props.image} style={styles.mediaImage}></Image>
                <Text style={styles.name}>{props.mediaType} ({props.numRecs})</Text>
                <Text style={styles.numRecs}>Recommendations from {props.numPeople} people</Text>
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
      marginVertical: 15,
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