import React from 'react';
import { Image, TouchableOpacity, View, SafeAreaView} from 'react-native';
import logoutButton from '../assets/logout-symbol.png';
import { useNavigation } from '@react-navigation/native';

// logout icon button
const Logout = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, paddingTop: 5, paddingRight: 10}}>
                <TouchableOpacity activeOpacity={0.25} onPress={() => navigation.navigate('Login')}>
                    <Image source={logoutButton} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Logout