import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView } from 'react-native';

export default function ArticleType(props) {
  const [recName, setrecName] = useState("");
  const [recAuthor, setrecAuthor] = useState("");
  const [recLink, setrecLink] = useState("");

  //for article types, prompt user to input a title (mandatory) and
  //  (optional:) an author and a link to the article
  return (
    <View>
      <View style={{ flexDirection: 'row'}}>
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
            Author(s):
        </Text>
        <SafeAreaView style={{flex: 1}}>
          <TextInput
              autoFocus={true}
              onChangeText={recAuthor => props.setrecAuthor(recAuthor)}
              style={styles.input}
              defaultValue={recAuthor}
              placeholder={"Add author(s)"}
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
                  style={styles.linkInput}
                  defaultValue={recLink}
                  placeholder={"Link to article"}
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
      width: '95%',
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
      width: '94%',
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
