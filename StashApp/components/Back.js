import React from 'react';
import { Image, TouchableOpacity, View, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Components
import backButton from '../assets/back-symbol.png';

// back icon button
const Back = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, paddingTop: 5, paddingLeft: 15}}>
                <TouchableOpacity activeOpacity={0.25} onPress={() => navigation.navigate('Home')}>
                    <Image source={backButton} style={{width: 25, height: 25, marginTop: 2}}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Back;