import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity, View, SafeAreaView, 
    Text, Pressable } from 'react-native';
import logoutButton from '../assets/logout-symbol.png';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import {loggingOut} from '../API/firebaseMethods';

// logout icon button
const Logout = () => {
    const navigation = useNavigation();

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const logOut = () => {
        // call firebase logout function
        loggingOut();
        // go to loading page to redirect
        navigation.navigate('Loading');
      };

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, paddingTop: 5, paddingRight: 10}}>
                <TouchableOpacity activeOpacity={0.25} onPress={toggleModal}>
                    <Image source={logoutButton} style={{width: 25, height: 25, marginRight: 10}}/>
                </TouchableOpacity>
            </View>

            <Modal isVisible={isModalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Are you sure you want to logout?</Text>
                        
                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <Pressable style={styles.logout}
                                    onPress={logOut} >
                                    <Text style={styles.logoutText}>Yes</Text>
                                </Pressable>
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Pressable style={styles.logout}
                                    onPress={toggleModal} >
                                    <Text style={styles.logoutText}>No</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
    modalText: {
        marginTop: 5,
        textAlign: "center",
        fontSize: 20,
        fontWeight: 'bold',
        color: "white"
    },
    logoutText: {
        color: "#D68C45",
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    logout: {
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

export default Logout;