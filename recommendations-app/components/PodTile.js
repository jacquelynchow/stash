import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PodTile = (props) => {
    const navigation = useNavigation();

    return (
        <View style={styles.item}>
            <TouchableOpacity activeOpacity={.7} onPress={() => navigation.navigate('Pod')}>
                <Image source={{uri: props.img}} style={styles.groupImage}></Image>
                <Text style={styles.name}>{props.groupName}</Text>
                <Text style={styles.members}>{props.numMembers} Members</Text>
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
    members: {
        padding: 15,
        paddingTop: 5,
    },
    groupImage: {
        marginLeft: 15,
        width: 100,
        height: 100,
        marginTop: 20,
        borderRadius: 10,
    }
})

export default PodTile;