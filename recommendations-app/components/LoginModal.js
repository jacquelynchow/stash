import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, SafeAreaView, Dimensions, Image, Alert } from 'react-native';
import Modal from 'react-native-modal';
import closePopUpButton from '../assets/closePopUpButton.png';
import { useNavigation } from '@react-navigation/native';
import {signIn} from '../API/firebaseMethods';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as firebase from "firebase";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;

const LoginModal = ({ isModalVisible, setModalVisible, setModalSelected }) => {
  
    const navigation = useNavigation();

    // function to show/hide modal
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        // reset selected modal name
        setModalSelected("");
        // reset fields if close button pressed
        resetFields();
    };

    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");

    // init error state for various form fields
    const [errors, setErrors] = useState({
      emailError: '', pwError: ''
    });

    // check on submit login that all fields are filled in & filled in correctly
    const checkAllFieldsOnSubmit = () => {
        let allValid = true;
        // check if email empty or only has whitespace
        if (email === "" || !email.replace(/\s/g, '').length) {
            setErrors({emailError: "Email is required"});
            allValid = false;
        }
        // check if password is empty
        if (pw === "") {
            setErrors({pwError: "Password is required"});
            allValid = false;
        }
        // if everything checks out, proceed to login
        if (allValid) {
            authenticateUser();
        }
    };

    // when user presses login
    const authenticateUser = () => {
      // call firebase signin function
      signIn(email, pw);

      resetFields();
      toggleModal();
      
      // go to loading page to redirect
      navigation.navigate('Loading');
    };

    // reset all fields on submit or closing modal
    const resetFields = () => {
      setEmail("");
      setPw("");
      setErrors({emailError: '', pwError: ''});
      setEmailActive(false);
      setPwActive(false);
    };

    // for styling text input when user clicks in
    const [emailActive, setEmailActive] = useState(false);
    const [pwActive, setPwActive] = useState(false);

    // reset password button
    const resetPassword = () => {
      const auth = firebase.auth();

      // get user's email from form 
      if (email === "" || !email.replace(/\s/g, '').length) {
        setErrors({emailError: "Email is required"});
      } else {
        toggleModal();
        auth.sendPasswordResetEmail(email).then(function() {
          Alert.alert("Password reset!", "Please check your email.");
        }).catch(function(error) {
          if (error.message === '') {
            Alert.alert("Password reset failed!", 'Please enter a valid email address and try again.');
          } else {
            Alert.alert("Password reset failed!", error.message);
          }
        });
      }
    }

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
                
                {/* user input: email, password */}
                <Text style={styles.userDetailsText}>
                      Email Address
                </Text>
                <View style={{ flexDirection: 'row'}}>
                  <MaterialCommunityIcons name="email-outline" size={28} color="white" style={{ marginTop: 8 }} />
                  <SafeAreaView>
                      <TextInput 
                      onChangeText={email => setEmail(email)}
                      style={ emailActive ? styles.userInputActive : styles.userInput }
                      defaultValue={email} 
                      placeholder={"Enter your email"}
                      value={email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setEmailActive(true)}
                      onBlur={() => setEmailActive(false)}
                      />
                  </SafeAreaView>
                </View>
                {/* error message - email */}
                <View style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Text style={styles.errorMessage}>{errors.emailError}</Text>
                </View>

                <Text style={styles.userDetailsText}>
                    Password
                </Text>
                <View style={{ flexDirection: 'row'}}>
                    <FontAwesome name="lock" size={30} color="white" style={{ marginTop: 8 }} />
                    <SafeAreaView>
                        <TextInput 
                            onChangeText={pw => setPw(pw)}
                            style={ pwActive ? styles.userInputActive : styles.userInput }
                            defaultValue={pw} 
                            placeholder={"Enter your password"}
                            secureTextEntry={true}
                            onFocus={() => setPwActive(true)}
                            onBlur={() => setPwActive(false)}
                        />
                    </SafeAreaView>
                </View>
                {/* error message - password */}
                <View style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Text style={styles.errorMessage}>{errors.pwError}</Text>
                </View>

                {/* Button to submit signup */}
                <TouchableOpacity style={styles.signUpButton} onPress={checkAllFieldsOnSubmit}>
                    <Text style={styles.signUpText}>Login</Text>
                </TouchableOpacity>

                {/* forgot your password button */}
                <TouchableOpacity style={styles.verificationButton} onPress={resetPassword}>
                  <Text style={styles.verificationText}>Forgot your password?</Text>
                </TouchableOpacity>

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
        marginTop: 20,
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
        fontSize: 15,
        color: 'white',
        marginRight: 'auto',
        marginLeft: (windowWidth - windowWidth/1.75)/4
      },
      userInput: {
        height: 35,
        width: windowWidth/2,
        fontSize: 17,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        paddingHorizontal: 10,
        marginLeft: 12,
        marginTop: 5,
      },
      userInputActive: {
        height: 35,
        width: windowWidth/2,
        fontSize: 17,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        paddingHorizontal: 10,
        marginLeft: 12,
        marginTop: 5,
        backgroundColor: '#FEFEE3'
      },
      modalText: {
        marginTop: 10,
        textAlign: "center",
        fontSize: 15,
        color: "white",
        marginBottom: 30
    },
    errorMessage: {
      color: '#FEFEE3',
      paddingTop: 3,
      fontSize: 12
    },
    verificationText: {
      color: "#6f1d1b",
      fontWeight: 'bold',
      fontSize: 12,
      textAlign: 'center',
    },
    verificationButton: {
      backgroundColor: '#FEFEE3',
      borderRadius: 10,
      marginTop: 50,
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: windowWidth/2,
      // ios
      shadowOffset: {width: 10, height: 10},
      shadowOpacity: 0.1,
      shadowRadius: 10,
      // android
      elevation: 2,
    },
});

export default LoginModal;