import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, Keyboard } from 'react-native';

export default function JustTitleType(props) {
  const [recName, setrecName] = useState("");

  return (
    //TODO - do we want to keep this type? If so it's 7 types and we need another
    //  icon & colour

    <View>
        <View style={{ flexDirection: 'row'}}>
            <Text style={styles.recCategoriesText}>
                Title:
            </Text>
            <SafeAreaView>
                <TextInput
                autoFocus={true}
                onChangeText={recName => props.setrecName(recName)}
                style={styles.input}
                defaultValue={recName}
                placeholder={"Enter a title"}
                />
            </SafeAreaView>
        </View>
    </View>
  );
}


const styles = StyleSheet.create({
    recCategoriesText: {
      fontSize: 18,
      color: 'white',
      marginTop: 10,
    },
    input: {
      height: 30,
      width: 180,
      fontSize: 16,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 5,
      paddingHorizontal: 10,
      marginLeft: 10,
      marginTop: 5,
    },
    descriptionInput: {
      height: 80,
      width: 230,
      fontSize: 16,
      backgroundColor: 'white',
      borderRadius: 10,
      paddingTop:10,
      paddingBottom:10,
      paddingHorizontal: 10,
      marginTop: 5,
    }
});
