import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView } from 'react-native';

export default function SongType() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  
  return (
    <View>
        <View style={{ flexDirection: 'row'}}>
            <Text style={styles.recCategoriesText}>
                Song Title:
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
                Artist(s):
            </Text>
            <SafeAreaView>
                <TextInput 
                    autoFocus={true}
                    onEndEditing={artist => setArtist(artist)}
                    style={styles.input}
                    defaultValue={artist} 
                    placeholder={"Add artist(s)"}
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
      width: 135,
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
      width: 150,
      fontSize: 16,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 5,
      paddingHorizontal: 10,
      marginLeft: 10,
      marginTop: 5,
    }
});