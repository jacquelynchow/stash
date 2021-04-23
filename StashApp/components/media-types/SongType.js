import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView } from 'react-native';

export default function SongType(props) {
  const [recName, setrecName] = useState("");
  const [recAuthor, setrecAuthor] = useState("");
  const [recLink, setrecLink] = useState("");

  return (
    <View>
        <View style={{ flexDirection: 'row'}}>
            <Text style={styles.recCategoriesText}>
                Song Title:
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
                Artist(s):
            </Text>
            <SafeAreaView>
                <TextInput
                    autoFocus={true}
                    onChangeText={recAuthor => props.setrecAuthor(recAuthor)}
                    style={styles.input}
                    defaultValue={recAuthor}
                    placeholder={"Add artist(s)"}
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
                  onChangeText={recLink => props.setrecLink(recLink)}
                  style={styles.linkInput}
                  defaultValue={recLink}
                  placeholder={"Link to song"}
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
    titleInput: {
      height: 30,
      width: 134,
      fontSize: 16,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 5,
      paddingHorizontal: 10,
      marginLeft: 10,
      marginTop: 5,
    },
    artistInput: {
      height: 30,
      width: 150,
      fontSize: 16,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 5,
      paddingHorizontal: 10,
      marginLeft: 10,
      marginTop: 5,
    },
    linkInput: {
      height: 30,
      width: 182,
      fontSize: 16,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 5,
      paddingHorizontal: 10,
      marginLeft: 10,
      marginTop: 5,
    }
});
