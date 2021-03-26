import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, Button, Image, TouchableOpacity, Pressable, SafeAreaView, TextInput } from 'react-native';
import logo from '../assets/stash-transparent.png';
import closePopUpButton from '../assets/closePopUpButton.png';
import Modal from 'react-native-modal';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';

// measurement of screen size for sizing of onboard buttons
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const onBoardBtnWidth = (windowWidth/4) - 20;

export default function LoginScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const clickBtn = index => {
    setActiveIndex(index);
  };

  // for signup popup
  const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
  };
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [phoneNum, setPhoneNum] = useState("");

  const addNewUser = () => {
    console.log("Username: ", username);
    console.log("Phone #: ", phoneNum);

    // reset input fields to blank
    setUsername("");
    setPw("");
    setPhoneNum("");
    toggleModal();
};

    return (
      <View style={ styles.container } >
        <Image source={logo} style={styles.logo} />
        <Text style={ styles.title } >Welcome</Text>
        <Text style={ styles.instructions } >Swipe left to see how we work.</Text>
        <View style={ styles.btnRow }>
          <TouchableOpacity
            style={ activeIndex == 0 ? styles.active : styles.onboardBtn }
            onPress={() => clickBtn(0)}
          ></TouchableOpacity>
          <TouchableOpacity
            style={ activeIndex == 1 ? styles.active : styles.onboardBtn }
            onPress={() => clickBtn(1)}
          ></TouchableOpacity>
          <TouchableOpacity
            style={ activeIndex == 2 ? styles.active : styles.onboardBtn }
            onPress={() => clickBtn(2)}
          ></TouchableOpacity>
          <TouchableOpacity
            style={ activeIndex == 3 ? styles.active : styles.onboardBtn }
            onPress={() => clickBtn(3)}
          ></TouchableOpacity>
        </View>

        {/* Signup PopUp */}
        <Modal isVisible={isModalVisible}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Pressable style={[styles.button, styles.buttonClose]}
                    onPress={toggleModal} >
                    <Image source={closePopUpButton} style={{width: 30, height: 30}}/>
                </Pressable>
                <Text style={styles.modalTitle}>Signup</Text>
                <Text style={styles.modalText}>Create an account to start joining pods and share recommendations with your friends!</Text>
                
                {/* user input: username, password, phone # */}
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
                <View style={{ flexDirection: 'row'}}>
                  <Text style={styles.userDetailsText}>
                      Phone #:
                  </Text>
                  <SafeAreaView>
                      <TextInput 
                          onChangeText={phoneNum => setPhoneNum(phoneNum)}
                          style={styles.userInput}
                          defaultValue={phoneNum} 
                          placeholder={"Enter your phone #"}
                      />
                  </SafeAreaView>
                </View>

                {/* btn to submit signup */}
                <Pressable style={styles.signUpButton} onPress={addNewUser}>
                    <Text style={styles.signUpText}>Signup</Text>
                </Pressable>
              </View>
          </View>
        </Modal>

        <TouchableOpacity style={ styles.signupBtn } activeOpacity={.7} onPress={toggleModal} >
          <Text style={ styles.signupBtnText } >Signup</Text>
        </TouchableOpacity>
        <View style={ styles.bottomContainer } >
          <Text style={ styles.bottomText } >Already have an account?</Text>
          <TouchableOpacity style={ styles.loginBtn } >
            <Text style={ styles.loginBtnText } onPress={() => navigation.navigate('Home')} >Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: "#d68c45",
    },
    title: {
      color: "#FCFBFB",
      fontSize: 40,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginTop: 40,
    },
    instructions: {
      fontStyle: 'italic',
      color: "#FCFBFB",
      fontSize: 14,
      marginTop: 1,
    },
    logo: {
      marginTop: 125,
      paddingTop: 0,
      width: 300,
      height: 150,
    },
    btnRow: {
      flexDirection: 'row',
      marginTop: windowHeight/6,
    },
    onboardBtn: {
      borderRadius: 20,
      backgroundColor: '#FFC9B9',
      width: onBoardBtnWidth,
      height: 15,
      marginHorizontal: (windowWidth - (onBoardBtnWidth*4))/15,
    },
    signupBtn: {
      width: windowWidth - 50,
      height: 70,
      borderRadius: 20,
      backgroundColor: "#FCFBFB",
      marginTop: 20,
      marginBottom: 20,
      // ios
      shadowOffset: {width: 5, height: 10},
      shadowOpacity: 0.1,
      shadowRadius: 10,
      // android
      elevation: 3,
      justifyContent: 'center',
    },
    signupBtnText: {
      textAlign: 'center',
      color: '#D68C45',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      fontSize: 18,
      letterSpacing: 1.5,
    },
    bottomContainer: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 40,
    },
    bottomText: {
      color: "#FCFBFB",
      fontSize: 18,
    },
    loginBtn: {
      marginLeft: 20,
      color: "#FCFBFB",
    },
    loginBtnText: {
      color: "#FCFBFB",
      fontSize: 18,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    active: {
      borderRadius: 20,
      backgroundColor: "#FCFBFB",
      width: onBoardBtnWidth,
      height: 15,
      marginHorizontal: (windowWidth - (onBoardBtnWidth*4))/15,
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
      width: 165,
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
