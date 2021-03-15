import React from 'react';
import { Image, TouchableOpacity, View, SafeAreaView} from 'react-native';
import logoutButton from '../assets/logout-symbol.png';

// logging out function
function signout() {
    return (
        alert("Logging out")
    )
}

// logout icon button
const Logout = () => {
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, paddingTop: 5, paddingRight: 10}}>
                <TouchableOpacity activeOpacity={0.25} onPress={signout}>
                    <Image source={logoutButton} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Logout