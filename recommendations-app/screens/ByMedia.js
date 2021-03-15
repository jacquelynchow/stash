import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MediaGroup from '../components/MediaGroup';
import Pod from '../components/Pod';

const ByMedia = () => {
    return (
        <View style={styles.container}>
            <MediaGroup/>
            <MediaGroup/>
            <MediaGroup/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      marginTop: 5,
      marginHorizontal: 10,
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-start' // if you want to fill rows left to right
    },
    item: {
      width: '50%' // is 50% of container width
    }, 
    textBox: {
        margin: 50,
        padding: 20,
        alignContent: 'center',
        justifyContent: 'center',
    }
})

export default ByMedia