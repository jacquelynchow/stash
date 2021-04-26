import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Alert,
    Pressable, SafeAreaView, TextInput, Keyboard} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import Modal from 'react-native-modal';
import KeyboardSpacer from 'react-native-keyboard-spacer';
// Components
import closePopUpButton from '../assets/closePopUpButton.png';
// Server related
import { changePodNameInDB } from '../API/firebaseMethods';

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
                { text: "OK", onPress: () => deletePod(props) }
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
                { text: "OK", onPress: () => deletePod(props) }
            ],
            { cancelable: false }
            );
        }
    }

    const deletePod = async (props) => {
        if (props.numMembers == 1) {
            await props.deletePod(props) // delete from db, calling function passed in from parent
            .then(() => props.refresh()); // refresh pods displayed in ByPod
        } else {
            await props.leavePod(props)
            .then(() => props.refresh());
        }
    };

    // display 1 "Member" or multiple "Members"
    function numMembers (numMembers) {
        if (numMembers ==1){
            return "Member"
        }
        else {
            return "Members"
        }
    }

    // display 1 "Rec" or multiple "Recs"
    function numRecs (numRecs) {
        if (numRecs ==1){
            return "Rec"
        }
        else {
            return "Recs"
        }
    }

    // init modal visibility vars
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // init error message for changing pod name
    const [errors, setErrors] = useState("");
    // init group name for changing pod name
    const [groupName, setGroupName] = useState("");
    // checks if new pod name is not empty and if < 20 chars, then it calls changePodName()
    const checkAllFieldsOnSubmit = () => {
        let allValid = true;
        // check if group name empty or only has whitespace
        if (groupName === "" || !groupName.replace(/\s/g, '').length) {
            setErrors({nameError: "*Pod name is empty"});
            allValid = false;
        } else if (groupName.length > 20) {
            setErrors({nameError: "*Maximum 20 characters"});
            allValid = false;
        }
        // if everything checks out, add to pods list
        if (allValid) {
            changePodName();
        }
    }
    // closes change pod name modal, calls firebase function to update pod name with new name, then resets fields
    const changePodName = async () => {
        toggleModal();
        await changePodNameInDB(groupName, props.podId)
            .then(() => {
                props.refresh();
                setGroupName("");
                setErrors("");
            } );
    }

    return (
        <>
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
                        {/* delete or leave pod option */}
                        <MenuOption onSelect={confirmDeletePod} >
                            {props.numMembers == 1 ?
                            <Text style={{ color: '#6f1d1b', fontWeight: 'bold', padding: 6 }}>Delete Pod</Text> :
                            <Text style={{ color: '#6f1d1b', fontWeight: 'bold', padding: 6 }}>Leave Pod</Text>}
                        </MenuOption>
                        {/* change pod name option */}
                        <MenuOption onSelect={toggleModal} >
                            <Text style={{ color: '#6f1d1b', fontWeight: 'bold', padding: 6 }}>Change Pod Name</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
                <Image source={{uri: props.uri}} style={styles.groupImage}></Image>
                <Text style={styles.name}>{props.groupName}</Text>
                <Text style={styles.members}>{props.numMembers} {numMembers(props.numMembers)}</Text>
                <Text style={styles.recommendations}>{props.numRecs} {numRecs(props.numRecs)}</Text>
            </TouchableOpacity>
        </View>
        {/* Change Pod Name Modal */}
        <Modal isVisible={isModalVisible}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Pressable style={[styles.button, styles.buttonClose]}
                        // close modal popup
                        onPress={toggleModal} >
                        <Image source={closePopUpButton} style={{width: 30, height: 30}}/>
                    </Pressable>
                    <Text style={styles.modalTitle}>Change Pod Name</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.modalText}>New name: </Text>
                        <SafeAreaView>
                            <TextInput
                            onChangeText={groupName => setGroupName(groupName)}
                            style={styles.userInput}
                            defaultValue={groupName}
                            placeholder={"Enter a pod name"}
                            value={groupName}
                            />
                        </SafeAreaView>
                    </View>
                    <View style={{ display: 'flex', marginTop: 10}}>
                        <Text style={styles.errorMessage}>{errors.nameError}</Text>
                    </View>

                    {/* Confirm Pod Name change button */}
                    <View>
                        <TouchableOpacity style={styles.changeButton} onPress={checkAllFieldsOnSubmit}>
                            <Text style={styles.changeButtonText}>Confirm Change</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <KeyboardSpacer />
            </View>
        </Modal>
        </>
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
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "#6F1D1B",
        borderRadius: 20,
        padding: 35,
        // ios
        shadowOffset: {width: 10, height: 10},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // android
        elevation: 2
    },
    button: {
        padding: 10
    },
    buttonClose: {
        position: 'absolute',
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    modalTitle: {
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 10,
        color: "white",
    },
    modalText: {
        fontSize: 16,
        color: 'white',
        marginTop: 20,
        marginRight: 10,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    userInput: {
        height: 30,
        width: windowWidth/2.5,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        paddingHorizontal: 10,
        marginLeft: 0,
        marginTop: 15,
    },
    changeButtonText: {
        color: "#D68C45",
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 18,
        textAlign: 'center'
    },
    changeButton: {
        backgroundColor: "white",
        borderRadius: 20,
        marginTop: 40,
        paddingVertical: 10,
        // ios
        shadowOffset: {width: 10, height: 10},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // android
        elevation: 2,
    },
    errorMessage: {
        color: '#ffc9b9',
    },
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
