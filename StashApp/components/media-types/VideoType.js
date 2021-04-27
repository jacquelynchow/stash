import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, Clipboard } from 'react-native';

export default function VideoType(props) {
  const [recName, setrecName] = useState("");
  const [recLink, setrecLink] = useState("");

  //for video types (YouTube & TikToks), prompt user to input a title and a link
  //  to the media (both mandatory)
  return (
    <View style={{alignSelf: 'flex-start', marginLeft: 'auto', marginRight: 'auto'}}>
      <View style={{ flexDirection: 'row', width: '100%'}}>
        <Text style={styles.recCategoriesText}>
          Title:
        </Text>
        <SafeAreaView style={{flex: 1}}>
          <TextInput
            autoFocus={true}
            onChangeText={recName => props.setrecName(recName)}
            style={styles.input}
            defaultValue={recName}
            placeholder={"Enter a title"}
          />
        </SafeAreaView>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.recCategoriesText}>
          Link:
        </Text>
        <SafeAreaView style={{flex: 1}}>
          <TextInput
              autoFocus={true}
              onChangeText={recLink => props.setrecLink(recLink)}
              style={styles.input}
              defaultValue={recLink}
              placeholder={"Link to video"}
              selectTextOnFocus={true}
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
    width: '95%',
    fontSize: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginTop: 5,
  }
});
