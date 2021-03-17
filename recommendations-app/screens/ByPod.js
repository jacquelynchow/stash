import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Image, Pressable, Text, Button } from 'react-native';
import PodTile from '../components/PodTile';
import addPodButton from '../assets/addPodButton.png';
import closePopUpButton from '../assets/closePopUpButton.png';
import Modal from 'react-native-modal';

const ByPod = (props) => {
    // TODO: If No Pods, show message screen, else show pods
    // TODO: For loop and showing Pod Tiles with real data

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    return (
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.container}>
                <PodTile groupName={"Group Name 1"} numMembers={2} />
                <PodTile groupName={"Group Name 2"} numMembers={5} />
                <PodTile groupName={"Group Name 3"} numMembers={10} />
                <PodTile groupName={"Group Name 3"} numMembers={10} />
                <PodTile groupName={"Group Name 3"} numMembers={10} />
                <PodTile groupName={"Group Name 3"} numMembers={10} />
                <PodTile groupName={"Group Name 3"} numMembers={10} />
                <PodTile groupName={"Group Name 3"} numMembers={10} />
                <PodTile groupName={"Group Name 3"} numMembers={10} />
                <PodTile groupName={"Group Name 3"} numMembers={10} />
                <PodTile groupName={"Group Name 3"} numMembers={10} />
                <PodTile groupName={"Group Name 3"} numMembers={10} />
            </ScrollView>

            {/* Create A Pod PopUp */}
            <Modal isVisible={isModalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Pressable style={[styles.button, styles.buttonClose]}
                            onPress={toggleModal} >
                            <Image source={closePopUpButton} style={{width: 30, height: 30}}/>
                        </Pressable>
                        <Text style={styles.modalTitle}>Create a Pod</Text>
                        <Text style={styles.modalText}>Search for their name or send them an invite!</Text>
                        {/* TODO: Name of group, pod image upload, show current members */}
                        <Pressable style={styles.createPodButton}>
                            <Text style={styles.createPodText}>Create Pod</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            
            {/* Add Pod Button */}
            <View style={{marginRight: 17}}>
                <Image source={addPodButton} style={styles.floatingAddButton}></Image>
            </View>
            <TouchableOpacity activeOpacity={0.25} 
                onPress={toggleModal}
                style={styles.floatingAddButton}>
            </TouchableOpacity>

        </View>
        
    )
}

const styles = StyleSheet.create({
    floatingAddButton: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 25,
        height: 60,
        width: 60,
    },
    container: {
        marginVertical: 20,
        marginHorizontal: 10,
        paddingBottom: 30,
        flexGrow:1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start' // fill rows left to right
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
        alignItems: "center",
        // ios
        shadowOffset: {width: 10, height: 10}, 
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // android 
        elevation: 2,
    },
    button: {
        padding: 10
    },
    buttonClose: {
        position: 'absolute',
        alignSelf: 'flex-start',
        marginBottom: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalTitle: {
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 35,
        color: "white",
    },
    modalText: {
        marginTop: 5,
        textAlign: "center",
        fontSize: 13,
        color: "white"
    },
    createPodText: {
        color: "#D68C45",
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    createPodButton: {
        backgroundColor: "white",
        borderRadius: 20,
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        // ios
        shadowOffset: {width: 10, height: 10}, 
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // android 
        elevation: 2,
    }
})

export default ByPod;