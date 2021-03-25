import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import logo from '../assets/stash-transparent.png';

// measurement of screen size for sizing of onboard buttons
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const onBoardBtnWidth = (windowWidth/4) - 20;

export default function LoginScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const clickBtn = index => {
    setActiveIndex(index);
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
        <TouchableOpacity style={ styles.signupBtn } activeOpacity={.7} >
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
    }
});
