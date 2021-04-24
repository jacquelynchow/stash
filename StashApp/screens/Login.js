import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, StatusBar, Image, TouchableOpacity } from 'react-native';
import logo from '../assets/stash-transparent.png';
import Swiper from 'react-native-swiper/src';
import PodIcon from '../assets/onboard-icons/pod.png';
import InteractIcon from '../assets/onboard-icons/interact.png';
import SortIcon from '../assets/onboard-icons/sort.png';
import SignupModal from '../components/SignupModal';
import LoginModal from '../components/LoginModal';

// measurement of screen size for sizing of onboard buttons
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const onBoardBtnWidth = (windowWidth/4) - 20;

export default function LoginScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const clickBtn = index => {
    setActiveIndex(index);
  };

  // for signup and login pop-ups
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalSelected, setModalSelected] = useState("");
  const toggleModal = (modalName) => {
      setModalVisible(!isModalVisible);
      // set appropriate modal to be visible
      setModalSelected(modalName);
  };

    return (
      <View style={ styles.container } >
        <StatusBar hidden={true}></StatusBar>
        <Image source={logo} style={styles.logo} />

        {/* Onboard Screens & Buttons */}
        <Swiper height={320} dot={ <View style={styles.onboardBtn}/> }
                activeDot={ <View style={styles.active}/> } >
          <View style={styles.slide}>
            <Text style={ styles.title } >Welcome</Text>
            <Text style={ styles.instructions } >Swipe left to see how we work.</Text>
          </View>
          <View style={styles.slide}>
            <Image source={PodIcon} style={styles.icons}></Image>
            <Text style={ styles.title2 } >Start a Pod</Text>
            <Text style={ styles.instructions } >Create groups for friends, family, classmates{'\n'}to start sending and receiving recommendations.</Text>
          </View>
          <View style={styles.slide}>
            <Image source={SortIcon} style={styles.icons}></Image>
            <Text style={ styles.title2 } >Sort by Pod or Type</Text>
            <Text style={ styles.instructions } >Check out your centralized recommendations{'\n'}by groups or by type of media.</Text>
          </View>
          <View style={styles.slide}>
            <Image source={InteractIcon} style={styles.icons}></Image>
            <Text style={ styles.title2 } >Interact With Recs</Text>
            <Text style={ styles.instructions } >Click on a recommendation for more info, react to it,{'\n'}or swipe left when you’re done checking it out!</Text>
          </View>
        </Swiper>

        {/* Signup PopUp */}
        <SignupModal key={"signup"} isModalVisible={modalSelected === 'Signup'} setModalVisible={setModalVisible} setModalSelected={setModalSelected} />

        {/* Login PopUp */}
        <LoginModal  key={"login"} isModalVisible={modalSelected === 'Login'} setModalVisible={setModalVisible} setModalSelected={setModalSelected} />

        {/* Signup Button */}
        <TouchableOpacity style={ styles.signupBtn } activeOpacity={.7} onPress={() => toggleModal('Signup')} >
          <Text style={ styles.signupBtnText } >Signup</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <View style={ styles.bottomContainer } >
          <Text style={ styles.bottomText } >Already have an account?</Text>
          <TouchableOpacity style={ styles.loginBtn } >
            <Text style={ styles.loginBtnText } onPress={() => toggleModal('Login')} >Login</Text>
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
      fontSize: 35,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      textAlign: 'center'
    },
    title2: {
      color: "#FCFBFB",
      fontSize: 25,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      textAlign: 'center'
    },
    instructions: {
      fontStyle: 'italic',
      color: "#FCFBFB",
      fontSize: 12,
      marginTop: 1,
      textAlign: 'center'
    },
    icons: {
      width: windowHeight/5,
      height: windowHeight/5,
      marginTop: 0,
    },
    logo: {
      marginTop: windowHeight/8,
      width: 250,
      height: 150,
    },
    slide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -20,
    },
    onboardBtn: {
      backgroundColor: 'rgba(255, 201, 185,.7)',
      width: onBoardBtnWidth,
      height: 15,
      borderRadius: 20,
      marginHorizontal: (windowWidth - (onBoardBtnWidth*4))/15,
    },
    signupBtn: {
      width: windowWidth - 50,
      height: 70,
      borderRadius: 20,
      backgroundColor: "#FCFBFB",
      marginBottom: windowHeight/10,
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
      backgroundColor: 'rgba(252,251,251, 1)',
      width: onBoardBtnWidth,
      height: 15,
      borderRadius: 20,
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
