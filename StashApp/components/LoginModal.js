import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, SafeAreaView, Dimensions, Image, Alert, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import closePopUpButton from '../assets/closePopUpButton.png';
import { useNavigation } from '@react-navigation/native';
import {signIn} from '../API/firebaseMethods';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as firebase from "firebase";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';

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

    const [phoneNum, setPhoneNum] = useState("");

    // init error state for various form fields
    const [errors, setErrors] = useState({
      phoneError: '', codeError: ''
    });

    const checkFieldsOnSendCode = () => {
      if (phoneNum === "") {
        setErrors({phoneError: "*Phone number is required"});
      } else if (phoneNum[0] != "+" || phoneNum.length != 12) {
        setErrors({phoneError: "*Please use the format +1 999 999 9999"});
      } else {
        sendCode();
        setErrors({phoneError: '', codeError: ''});
      }
    };

    const checkFieldsOnLogin = () => {
      // check if confirmation code is empty
      if (verificationCode === "") {
        setErrors({codeError: "*Verification code is required"});
      } else if (verificationCode.length != 6) {
        setErrors({codeError: "*Please enter 6 digits"});
      } else {
        completeLogin();
      }
    }

    async function sendCode() {
      try {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verificationId = await phoneProvider.verifyPhoneNumber(
          phoneNum,
          recaptchaVerifier.current
        );
        setVerificationId(verificationId);
        Alert.alert("Success!", "Verification code has been sent to your phone.")
        setCodeVisible(true);
        setErrors({codeError: ''});
      } catch (err) {
        Alert.alert("Authentication failed!", err.message)
      }
    }

    async function completeLogin() {
      try {
        const credential = firebase.auth.PhoneAuthProvider.credential(
          verificationId,
          verificationCode
        );
        await firebase.auth().signInWithCredential(credential);
        toggleModal();
      } catch (err) {
        Alert.alert("Authentication failed!", "Please double check the code you entered and try again.")
      }
    }

    // reset all fields on submit or closing modal
    const resetFields = () => {
      setPhoneNum("");
      setErrors({phoneError: '', codeError: ''});
      setInputActive({phoneActive: false, codeActive: false});
      setCodeVisible(false);
      setVerificationCode("");
    };

    // for styling text input when user clicks in
    const [inputActive, setInputActive] = useState({
      phoneActive: false, codeActive: false
    });

    // init variables for firebase phone authentication-------------------------------
    const recaptchaVerifier = React.useRef(null);
    const [verificationId, setVerificationId] = React.useState();
    const [verificationCode, setVerificationCode] = useState("");
    const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
    const attemptInvisibleVerification = false;

    const [codeVisible, setCodeVisible] = useState(false);

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

                {/* recaptcha modal (will pop up when user clicks 'send verification code') */}
                <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
                attemptInvisibleVerification={attemptInvisibleVerification}
                />

                {/* conditional rendering of phone verification fields */}
                {/* show input to enter 6 digit code and confirmation button after the code has been sent */}
                {codeVisible ?
                [<Text style={styles.userDetailsText}>
                    6-Digit Code
                </Text>] :
                [<Text style={styles.userDetailsText}>
                    Phone Number
                </Text>]}

                {codeVisible ?
                [<View style={{ flexDirection: 'row'}}>
                  <MaterialCommunityIcons name="cellphone-iphone" size={28} color="white" style={{ marginTop: 8 }} />
                  <SafeAreaView>
                      <TextInput
                          onChangeText={verificationCode => setVerificationCode(verificationCode)}
                          style={ inputActive.codeActive ? styles.userInputActive : styles.userInput }
                          placeholder={"123456"}
                          editable={!!verificationId}
                          onFocus={() => setInputActive({ codeActive: true })}
                          onBlur={() => setInputActive({ codeActive: false })}
                          keyboardType='number-pad'
                          returnKeyType='done'
                          defaultValue={verificationCode}
                      />
                  </SafeAreaView>
                </View>] :
                [<View style={{ flexDirection: 'row'}}>
                <FontAwesome name="phone" size={28} color="white" style={{ marginTop: 8 }} />
                <SafeAreaView>
                    <TextInput
                        onChangeText={phoneNum => setPhoneNum(phoneNum)}
                        style={ inputActive.phoneActive ? styles.userInputActive : styles.userInput }
                        defaultValue={phoneNum}
                        placeholder={"+1 999 999 9999"}
                        autoCompleteType="tel"
                        keyboardType="phone-pad"
                        returnKeyType='done'
                        textContentType="telephoneNumber"
                        onFocus={() => setInputActive({ phoneActive: true })}
                        onBlur={() => setInputActive({ phoneActive: false })}
                    />
                </SafeAreaView>
                </View>]}

                <View style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Text style={styles.errorMessage}>{errors.codeError}</Text>
                  <Text style={styles.errorMessage}>{errors.phoneError}</Text>
                </View>

                {/* confirm verification code button ----------------------------------------------- */}
                {codeVisible ?
                [<TouchableOpacity style={styles.signUpButton} onPress={checkFieldsOnLogin}>
                  <Text style={styles.signUpText}>Login</Text>
                </TouchableOpacity>] :
                [<TouchableOpacity style={styles.verificationButton} onPress={checkFieldsOnSendCode}>
                  <Text style={styles.verificationText}>Send Verification Code</Text>
                </TouchableOpacity>]}

            {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}

                <KeyboardSpacer />
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
        fontWeight: '600',
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
      color: "#D68C45",
      fontWeight: 'bold',
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    verificationButton: {
      backgroundColor: 'white',
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
    },
});

export default LoginModal;
