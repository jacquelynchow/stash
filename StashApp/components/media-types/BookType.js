import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView } from 'react-native';

export default function BookType(props) {
  const [recName, setrecName] = useState("");
  const [recAuthor, setrecAuthor] = useState("");

  //for book/article types, prompt user to input a title (mandatory) and author (optional)
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
                Author(s):
            </Text>
            <SafeAreaView>
                <TextInput
                    autoFocus={true}
                    onChangeText={recAuthor => props.setrecAuthor(recAuthor)}
                    style={styles.input}
                    defaultValue={recAuthor}
                    placeholder={"Add author(s)"}
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
      width: 135,
      fontSize: 16,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 5,
      paddingHorizontal: 10,
      marginLeft: 10,
      marginTop: 5,
    }
});
