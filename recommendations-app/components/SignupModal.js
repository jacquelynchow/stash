import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, SafeAreaView, Dimensions, Image, Button, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import closePopUpButton from '../assets/closePopUpButton.png';
import { registration, updateUsername } from '../API/firebaseMethods';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const SignupModal = ({ isModalVisible, setModalVisible, setModalSelected }) => {
  
    // function to show/hide modal
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        // reset selected modal
        setModalSelected("");
    };

    const [username, setUsername] = useState("");
    const [pw, setPw] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [email, setEmail] = useState("");

    const navigation = useNavigation();

    // when user clicks signup-------------------------------------------------------
    const addNewUser = () => {
      // call firebase registration function
      registration(
        email,
        pw,
        username
      );

      // reset input fields to blank
      setUsername("");
      setPw("");
      setPhoneNum("");
      setEmail("");

      toggleModal();
      // go to loading page to redirect
      navigation.navigate('Loading');
    };

    // init variables for firebase phone authentication-------------------------------
    const recaptchaVerifier = React.useRef(null);
    const [verificationId, setVerificationId] = React.useState();
    const [verificationCode, setVerificationCode] = React.useState();
    const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
    const [message, showMessage] = React.useState(
      !firebaseConfig || Platform.OS === 'web'
        ? {
            text:
              'To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.',
          }
        : undefined
    );
    const attemptInvisibleVerification = false;

    return (
      <Modal visible={isModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable style={[styles.button, styles.buttonClose]}
              onPress={toggleModal}>
              <Image source={closePopUpButton} style={{width: 30, height: 30}}/>
            </Pressable>
            <Text style={styles.modalTitle}>Signup</Text>
            <Text style={styles.modalText}>Create an account to start joining pods and share recommendations with your friends!</Text>
            
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
                      secureTextEntry={true}
                  />
              </SafeAreaView>
            </View>

            <View style={{ flexDirection: 'row'}}>
              <Text style={styles.userDetailsText}>
                  Email:
              </Text>
              <SafeAreaView>
                  <TextInput 
                  onChangeText={email => setEmail(email)}
                  style={styles.userInput}
                  defaultValue={email} 
                  placeholder={"Enter your email"}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  />
              </SafeAreaView>
            </View>

            {/* recaptcha modal (will pop up when user clicks 'send verification code') */}
            <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
            attemptInvisibleVerification={attemptInvisibleVerification}
            />

            <View style={{ flexDirection: 'row'}}>
              <Text style={styles.userDetailsText}>
                  Phone #:
              </Text>
              <SafeAreaView>
                  <TextInput 
                      onChangeText={phoneNum => setPhoneNum(phoneNum)}
                      style={styles.userInput}
                      defaultValue={phoneNum} 
                      placeholder={"+1 999 999 9999"}
                      autoCompleteType="tel"
                      keyboardType="phone-pad"
                      textContentType="telephoneNumber"
                  />
              </SafeAreaView>
            </View>

            {/* send verification code button ----------------------------------------------- */}
            <Pressable style={styles.verificationButton} disabled={!phoneNum} onPress={async () => {
              try {
                const phoneProvider = new firebase.auth.PhoneAuthProvider();
                const verificationId = await phoneProvider.verifyPhoneNumber(
                  phoneNum,
                  recaptchaVerifier.current
                );
                setVerificationId(verificationId);
                showMessage({
                  text: 'Verification code has been sent to your phone.',
                });
              } catch (err) {
                showMessage({ text: `Error: ${err.message}`, color: 'red' });
              }
            }}>
              <Text style={styles.verificationText}>Send Verification Code</Text>
            </Pressable>

            <View style={{ flexDirection: 'row'}}>
              <Text style={styles.userDetailsText}>
                6-Digit Code:
              </Text>
              <SafeAreaView>
                  <TextInput 
                      onChangeText={setVerificationCode}
                      style={styles.userInput}
                      placeholder={"123456"}
                      editable={!!verificationId}
                  />
              </SafeAreaView>
            </View>

            {/* confirm verification code button ----------------------------------------------- */}
            <Pressable style={styles.verificationButton} disabled={!verificationId} onPress={async () => {
              try {
                const credential = firebase.auth.PhoneAuthProvider.credential(
                  verificationId,
                  verificationCode
                );
                // await firebase.auth().signInWithCredential(credential);
                showMessage({ text: 'Phone authentication successful 👍' });
                
              } catch (err) {
                showMessage({ text: `Error: ${err.message}`, color: 'red' });
              }
            }}>
              <Text style={styles.verificationText}>Confirm Verification Code</Text>
            </Pressable>
      
            {/* alert/error messages ----------------------------------------------- */}
            {message ? (
              <TouchableOpacity
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: 0xffffffee, justifyContent: 'center' },
                ]}
                onPress={() => showMessage(undefined)}>
                <Text
                  style={{
                    color: message.color || '#6f1d1b',
                    fontSize: 17,
                    textAlign: 'center',
                    margin: 20,
                  }}>
                  {message.text}
                </Text>
              </TouchableOpacity>
            ) : (
              undefined
            )}

        {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}

        {/* Button to submit signup */}
        <Pressable style={styles.signUpButton} onPress={addNewUser}>
            <Text style={styles.signUpText}>Signup</Text>
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
  verificationText: {
    color: "#6f1d1b",
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  verificationButton: {
    backgroundColor: "#ffc9b9",
    borderRadius: 20,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: windowWidth/2.1,
    // ios
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // android
    elevation: 2,
  },
});

export default SignupModal;