import React, { useCallback } from 'react';
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

// Tiles to display pods under "Your Pods" view of home page
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

    const deletePod = useCallback(async () => {
        if (props.numMembers == 1) {
            await props.deletePod(props) // delete from db, calling function passed in from parent
            .then(() => props.refresh()); // refresh pods displayed in ByPod
        } else {
            await props.leavePod(props)
            .then(() => props.refresh());
        }
    }, []);

    //display 1 "Member" or multiple "Members"
    function numMembers (numMembers) {
        if (numMembers ==1){
            return "Member"
        }
        else {
            return "Members"
        }
    }

    //display 1 "Rec" or multiple "Recs"
    function numRecs (numRecs) {
        if (numRecs ==1){
            return "Rec"
        }
        else {
            return "Recs"
        }
    }



    return (
        <View style={styles.item}>
            <TouchableOpacity activeOpacity={.7} onPress={() => navigation.navigate('Pod',
                    { podId: props.podId, name: props.groupName, numMembers: props.numMembers, members: props.members,
                        uri: props.uri, userId: props.userId, username: props.username, numRecs: props.numRecs })}>

                <Menu>
                    {/* 3 dots icon triggers menu to open*/}
                    <MenuTrigger customStyles={triggerStyles}>
                        <MaterialCommunityIcons name="dots-horizontal" size={32} color="#ccc" />
                    </MenuTrigger>
                    <MenuOptions customStyles={optionsStyles} >
                        <MenuOption onSelect={confirmDeletePod} >
                            {props.numMembers == 1 ?
                            <Text style={{ color: '#6f1d1b', fontWeight: 'bold', padding: 6 }}>Delete Pod</Text> :
                            <Text style={{ color: '#6f1d1b', fontWeight: 'bold', padding: 6 }}>Leave Pod</Text>}
                        </MenuOption>
                    </MenuOptions>
                </Menu>
                <Image source={{uri: props.uri}} style={styles.groupImage}></Image>
                <Text style={styles.name}>{props.groupName}</Text>
                <Text style={styles.members}>{props.numMembers} {numMembers(props.numMembers)}</Text>
                <Text style={styles.recommendations}>{props.numRecs} {numRecs(props.numRecs)}</Text>
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
        fontSize: 13
    },
    recommendations: {
        padding: 15,
        marginTop: -30,
        fontSize: 13
    },
    groupImage: {
        marginLeft: 15,
        width: 100,
        height: 100,
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
