import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView } from 'react-native';

export default function MovieType(props) {
  const [recName, setrecName] = useState("");
  const [recGenre, setrecGenre] = useState("");
  const [recYear, setrecYear] = useState("");

  //for movie types, prompt user to input a title (mandatory) and (optional:) a genre
  //  and a release year
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
            style={styles.titleInput}
            defaultValue={recName}
            placeholder={"Enter a title"}
          />
        </SafeAreaView>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.recCategoriesText}>
          Genre:
        </Text>
        <SafeAreaView style={{flex: 1}}>
          <TextInput
              autoFocus={true}
              onChangeText={recGenre => props.setrecGenre(recGenre)}
              style={styles.input}
              defaultValue={recGenre}
              placeholder={"Enter a genre"}
          />
        </SafeAreaView>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.recCategoriesText}>
          Year:
        </Text>
        <SafeAreaView style={{flex: 1}}>
          <TextInput
              autoFocus={true}
              onChangeText={recYear => props.setrecYear(recYear)}
              style={styles.titleInput}
              defaultValue={recYear}
              placeholder={"Year Released"}
              keyboardType='numeric'
              maxLength={4}
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
  titleInput: {
    height: 30,
    width: '100%',
    fontSize: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginTop: 5,
  },
  input: {
    height: 30,
    width: '100%',
    fontSize: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginTop: 5,
  }
});
