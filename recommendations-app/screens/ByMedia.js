import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MediaGroup from '../components/MediaGroup';

const ByMedia = () => {
    return (
        <View style={styles.container}>
            <MediaGroup/>
            <MediaGroup/>
            <MediaGroup/>
            <MediaGroup/>
            <MediaGroup/>
        </View>
    )
}
// if have no recommendations 

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
        padding: 30,
        alignContent: 'center',
        justifyContent: 'center',
    }
})

export default ByMedia