import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView } from 'react-native';

export default function MovieType(props) {
  const [recName, setrecName] = useState("");
  const [recGenre, setrecGenre] = useState("");
  const [recYear, setrecYear] = useState(0);
  //TODO - change recYear back to props below when working

  return (
    <View>
      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.recCategoriesText}>
          Title:
        </Text>
        <SafeAreaView>
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
        <SafeAreaView>
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
        <SafeAreaView>
          <TextInput
              autoFocus={true}
              onEndEditing={recYear => setrecYear(recYear)}
              style={styles.titleInput}
              defaultValue={recYear}
              placeholder={"Year Published"}
              keyboardType='number-pad'
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
    width: 175,
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
    width: 160,
    fontSize: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginTop: 5,
  }
});
