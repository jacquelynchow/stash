import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, Keyboard } from 'react-native';

export default function MovieType() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
                style={styles.input}
                defaultValue={title} 
                placeholder={"Enter a title"}
                />
            </SafeAreaView>
        </View>
          <Text style={styles.recCategoriesText}>
              Description:
          </Text>
          <SafeAreaView>
              <TextInput 
              autoFocus={true}
              onEndEditing={description => setDescription(description)}
              style={styles.descriptionInput}
              defaultValue={description} 
              placeholder={"Add a description"}
              maxLength={200}
              multiline={true}
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={()=>{Keyboard.dismiss()}}
              />
          </SafeAreaView>
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