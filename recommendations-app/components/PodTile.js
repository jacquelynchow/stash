import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

const windowWidth = Dimensions.get('window').width;

const PodTile = (props) => {
    const navigation = useNavigation();

    // ask user to confirm if they want to delete/leave a pod
    const confirmDeletePod = () => {
        // if 1 member remaining, show delete pod option
        if (props.numMembers == 1) {
            Alert.alert("Delete Pod", "Are you sure you want to delete " + props.groupName + "?",
            [   {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => deletePod() } 
            ],
            { cancelable: false }
            );
        } else {
            Alert.alert("Leave Pod", "Are you sure you want to leave " + props.groupName + "?",
            [   {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => deletePod() } 
            ],
            { cancelable: false }
            );
        }
    }

    const deletePod = () => {
        if (props.numMembers == 1) {
            props.deletePod(props); // delete from db, calling function passed in from parent
        } else {
            props.leavePod(props); 
        }
        
        props.refresh(); // refresh pods displayed in ByPod
    }

    return (
        <View style={styles.item}>
            <TouchableOpacity activeOpacity={.7} onPress={() => navigation.navigate('Pod',
                    { name: props.groupName, numMembers: props.numMembers, members: props.members,
                        uri: props.uri, userId: props.userId, username: props.username })}>
                <Menu>
                    {/* 3 dots icon triggers menu to open*/}
                    <MenuTrigger customStyles={triggerStyles}>
                        <MaterialCommunityIcons name="dots-horizontal" size={36} color="#ccc" />
                    </MenuTrigger>
                    <MenuOptions customStyles={optionsStyles} >
                    <MenuOption onSelect={confirmDeletePod} >
                        {/* conditionally render delete pod or leave pod option */}
                        { props.numMembers == 1 ?
                        <Text style={styles.deletePod}>Delete Pod</Text>
                        : <Text style={styles.deletePod}>Leave Pod</Text> }
                    </MenuOption>
                    </MenuOptions>
                </Menu> 
                
                <Image source={{uri: props.uri}} style={styles.groupImage}></Image>
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
        width: 130,
        height: 130,
        marginTop: 20,
        borderRadius: 10,
    },
    deletePod: { 
        color: '#6f1d1b', 
        fontWeight: 'bold', 
        padding: 6 
    }
})

const triggerStyles = {
    triggerTouchable: {
        underlayColor: '#e3e3e3',
        style : {
            width: 36,
            borderRadius: 15,
            marginLeft: 'auto',
            alignItems: 'center',
            marginRight: 15,
            marginBottom: -20,
        },
    }
};

const optionsStyles = {
    optionsContainer: {
        borderRadius: 10,
        width: 100,
        marginTop: 30,
        marginLeft: windowWidth/6
    },
    optionTouchable: {
        underlayColor: '#ccc',
        style : {
            borderRadius: 10,
            width: 100,
            opacity: 50
        },
    },
};

export default PodTile;
