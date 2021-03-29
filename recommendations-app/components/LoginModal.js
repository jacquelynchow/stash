import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, SafeAreaView, Dimensions, Image } from 'react-native';
import Modal from 'react-native-modal';
import closePopUpButton from '../assets/closePopUpButton.png';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const LoginModal = ({ isModalVisible, setModalVisible, setModalSelected }) => {
  
    const navigation = useNavigation();

    // function to show/hide modal
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        // reset selected modal name
        setModalSelected("");
    };

    const [username, setUsername] = useState("");
    const [pw, setPw] = useState("");

    const authenticateUser = () => {
      console.log("Username: ", username);

      // reset input fields to blank
      setUsername("");
      setPw("");
    
      toggleModal();
      // go to home page
      navigation.navigate('Home');
    };

    return (
      <Modal visible={isModalVisible}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Pressable style={[styles.button, styles.buttonClose]}
                    onPress={toggleModal}>
                    <Image source={closePopUpButton} style={{width: 30, height: 30}}/>
                </Pressable>
                <Text style={styles.modalTitle}>Login</Text>
                <Text style={styles.modalText}>Login to view your pods and start sending recommendations!</Text>
                
                {/* user input: username, password */}
                <View style={{ flexDirection: 'row'}}>
                <Text style={styles.userDetailsText}>
                    Username:
                </Text>
                <SafeAreaView>
                    <TextInput 
                    onChangeText={username => setUsername(username)}
                    style={styles.userInput}
                    defaultValue={username} 
                    placeholder={"Enter a username"}
                    value={username}
                    />
                </SafeAreaView>
                </View>
                <View style={{ flexDirection: 'row'}}>
                    <Text style={styles.userDetailsText}>
                        Password:
                    </Text>
                    <SafeAreaView>
                        <TextInput 
                            onChangeText={pw => setPw(pw)}
                            style={styles.userInput}
                            defaultValue={pw} 
                            placeholder={"Enter a password"}
                        />
                    </SafeAreaView>
                </View>

                {/* Button to submit signup */}
                <Pressable style={styles.signUpButton} onPress={authenticateUser}>
                    <Text style={styles.signUpText}>Login</Text>
                </Pressable>
                </View>
            </View>
        </Modal>
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
        fontSize: 30,
        marginTop: 10,
        color: "white"
      },
      signUpText: {
        color: "#D68C45",
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 18,
        textAlign: 'center'
      },
      signUpButton: {
        backgroundColor: "white",
        borderRadius: 20,
        marginTop: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: 150,
        // ios
        shadowOffset: {width: 10, height: 10},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // android
        elevation: 2,
      },
      userDetailsText: {
        fontSize: 18,
        color: 'white',
        marginTop: 17,
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
      },
      userInput: {
        height: 30,
        width: windowWidth/3,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        paddingHorizontal: 10,
        marginLeft: 10,
        marginTop: 15,
      },
      modalText: {
        marginTop: 10,
        textAlign: "center",
        fontSize: 13,
        color: "white",
        marginBottom: 30
    },
});

export default LoginModal;