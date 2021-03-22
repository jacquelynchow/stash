import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView } from 'react-native';

export default function MovieType() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  
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
                Author(s):
            </Text>
            <SafeAreaView>
                <TextInput 
                    autoFocus={true}
                    onEndEditing={author => setAuthor(author)}
                    style={styles.input}
                    defaultValue={author} 
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