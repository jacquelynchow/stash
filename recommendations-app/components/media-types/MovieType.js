import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView } from 'react-native';

export default function MovieType() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState(0);
  
  return (
    <View>
      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.recCategoriesText}>
          Title:
        </Text>
        <SafeAreaView>
          <TextInput 
            autoFocus={true}
            onEndEditing={title => setTitle(title)}
            style={styles.titleInput}
            defaultValue={title} 
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
              onEndEditing={genre => setGenre(genre)}
              style={styles.input}
              defaultValue={genre} 
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
              onEndEditing={year => setYear(year)}
              style={styles.titleInput}
              defaultValue={year} 
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