import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from 'react-native';

const RecTile = (props) => {

    return (
        <View style={styles.item}>
                <Image source={{uri: "https://www.jaipuriaschoolpatna.in/wp-content/uploads/2016/11/blank-img.jpg"}} style={styles.recImage}></Image>
                <Text style={styles.name}>{props.recName}</Text>
                <Text style={styles.media}>{props.mediaType}</Text>

            {/* Rec Details PopUp */}
             {/* TODO: Name of group, pod image upload, show current members */}
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
    media: {
        padding: 15,
        paddingTop: 5,
    },
    recImage: {
        marginLeft: 15,
        width: 90,
        height: 90,
        marginTop: 20,
        borderRadius: 10,
    }
})

export default RecTile;