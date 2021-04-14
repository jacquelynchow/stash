import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

const PodTile = (props) => {
    const navigation = useNavigation();

    // ask user to confirm if they want to delete a pod
    const confirmDeletePod = () =>
    Alert.alert(
      "Delete Pod",
      "Are you sure you want to delete " + props.groupName + "?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => deletePod() } // call function passed in from parent
      ],
      { cancelable: false }
    );

    const deletePod = () => {
        props.deletePod(props); // delete from db
        props.refresh(); // refresh pods displayed in ByPod
    }

    return (
        <View style={styles.item}>
            <TouchableOpacity activeOpacity={.7} onPress={() => navigation.navigate('Pod')}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={{uri: props.uri}} style={styles.groupImage}></Image>
                    <Menu>
                        {/* 3 dots icon triggers menu to open */}
                        <MenuTrigger customStyles={triggerStyles}>
                            <FontAwesome name="ellipsis-v" size={26} color="#d68c45" style={{ marginTop: 20, marginLeft: 12, opacity: 0.5 }} />
                        </MenuTrigger>
                        <MenuOptions customStyles={optionsStyles} >
                            <MenuOption onSelect={confirmDeletePod} >
                                <Text style={{ color: '#6f1d1b', fontWeight: 'bold', padding: 6 }}>Delete Pod</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
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
})  

const triggerStyles = {
    triggerWrapper: {
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'start',
      paddingRight: 8,
      paddingBottom: 10,
      width: 32,
    },
    triggerTouchable: {
        underlayColor: 'white',
        style : {
          flex: 1,
        },
    },
};

const optionsStyles = {
    optionsContainer: {
        borderRadius: 10,
        width: 100,
        marginTop: 20,
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