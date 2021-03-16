import React from 'react';
import { Image, TouchableOpacity, View, SafeAreaView} from 'react-native';
import backButton from '../assets/back-symbol.png';
import { useNavigation } from '@react-navigation/native';

// back icon button
const Back = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, paddingTop: 5, paddingLeft: 10}}>
                <TouchableOpacity activeOpacity={0.25} onPress={() => navigation.navigate('Home')}>
                    <Image source={backButton} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Back;