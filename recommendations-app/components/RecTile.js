import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from 'react-native';
import closePopUpButton from '../assets/closePopUpButton.png';
import Modal from 'react-native-modal';

const RecTile = (props) => {

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
      setModalVisible(!isModalVisible);
  };

    return (
        <View style={styles.item}>
            <TouchableOpacity activeOpacity={0.25} onPress={toggleModal}>
                <Image source={{uri: "https://www.jaipuriaschoolpatna.in/wp-content/uploads/2016/11/blank-img.jpg"}} style={styles.recImage}></Image>
                <Text style={styles.name}>{props.recName}</Text>
                <Text style={styles.media}>{props.mediaType}</Text>
            </TouchableOpacity>

            {/* Rec Details PopUp */}
            <Modal isVisible={isModalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Pressable style={[styles.button, styles.buttonClose]}
                            onPress={toggleModal} >
                            <Image source={closePopUpButton} style={{width: 30, height: 30}}/>
                        </Pressable>
                        <Image source={{uri: "https://www.jaipuriaschoolpatna.in/wp-content/uploads/2016/11/blank-img.jpg"}} style={styles.recImagePopUp}></Image>
                        <Text style={styles.modalTitle}> {props.recName} </Text>
                        <Text style={styles.modalText}> {props.mediaType} </Text>
                        <Text style={styles.modalText}>Sent by: [username] in {props.groupName} pod</Text>
                        {/* TODO: change image to be the one they uploaded, show sender instead of [username]*/}
                    </View>
                </View>
            </Modal>

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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "#D26D64", //TODO when we have conditionals change colour by type
        borderRadius: 20,
        padding: 80,
        alignItems: "center",
        // ios
        shadowOffset: {width: 10, height: 10},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // android
        elevation: 2,
    },
    buttonClose: {
        position: 'absolute',
        alignSelf: 'flex-start',
        marginTop: 10,
        marginLeft: 10,
    },
    modalTitle: {
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 35,
        marginTop: 10,
        marginBottom: 10,
        color: "white",
    },
    modalText: {
        marginTop: 5,
        textAlign: "center",
        fontSize: 13,
        color: "white"
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#D26D64", //TODO when we have conditionals change colour by type
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
    },
    recImagePopUp:{
      width: 150,
      height: 150,
      borderRadius: 10,
    }
})

export default RecTile;
