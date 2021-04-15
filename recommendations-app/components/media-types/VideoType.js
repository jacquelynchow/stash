import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView } from 'react-native';

export default function VideoType() {
  const [recName, setrecName] = useState("");
  const [recLink, setrecLink] = useState("");

  return (
    <View>
      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.recCategoriesText}>
          Title:
        </Text>
        <SafeAreaView>
          <TextInput
            autoFocus={true}
            onChangeText={recName => setrecName(recName)}
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
        <SafeAreaView>
          <TextInput
              autoFocus={true}
              onChangeText={recLink => setrecLink(recLink)}
              style={styles.input}
              defaultValue={recLink}
              placeholder={"Link to video"}
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
    width: 175,
    fontSize: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginTop: 5,
  }
});
