import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const MediaGroup = () => {
    return (
        <View style={styles.item}>
            <Image source={{uri: "https://www.jaipuriaschoolpatna.in/wp-content/uploads/2016/11/blank-img.jpg"}} style={styles.mediaImage}></Image>
            <Text style={styles.name}>Media Type</Text>
            <Text style={styles.numRecs}># Recommendations</Text>
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
        width: 90,
        height: 90,
        marginTop: 20,
        borderRadius: 10,
    }
})

export default MediaGroup