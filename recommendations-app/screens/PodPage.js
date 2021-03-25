import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Pressable, Text, TextInput, SafeAreaView, Keyboard } from 'react-native';
import RecTile from '../components/RecTile';
import closePopUpButton from '../assets/closePopUpButton.png';
import addRecButton from '../assets/addRecButton.png';
import Modal from 'react-native-modal';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import DropDownPicker from 'react-native-dropdown-picker';
// Media Types Components
import MovieType from '../components/media-types/MovieType';
import BookType from '../components/media-types/BookType';
import VideoType from '../components/media-types/VideoType';
import SongType from '../components/media-types/SongType';
import JustTitleType from '../components/media-types/JustTitleType';

export default function PodPage() {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
      setModalVisible(!isModalVisible);
  };

  const [recs, setRecs] = useState([]);
  const addNewRec = () => {
      // add group name of new pod to existing list
      // TODO: read group name in from form instead of hardcoding
      let newRec = { key: recs.length + 1, name: "New Test Rec ", type: "Media Type"}
      setRecs([...recs, newRec.name + newRec.key.toString()]);
      toggleModal();
  };

  const [mediaType, setmediaType] = useState("");
  const [comment, setComment] = useState("");

  function selectMediaType() {
    if (mediaType == "Movie") {
      return (<MovieType></MovieType>)
    } else if (mediaType == "Book" || mediaType == "Article") {
      return (<BookType></BookType>)
    } else if (mediaType == "TikTok" || mediaType == "YouTube") {
      return (<VideoType></VideoType>)
    } else if (mediaType == "Song") {
      return (<SongType></SongType>)
    } else if (mediaType == "Image" || mediaType == "Other") {
      return (<JustTitleType></JustTitleType>)
    }
  };

    return (
      <View style={{flex: 1}} >
        <ScrollView contentContainerStyle={styles.container}>
          <RecTile recName={"Rec 1"} mediaType={"Book"}/>
          <RecTile recName={"Rec 2"} mediaType={"Movie"}/>
          <RecTile recName={"Rec 3"} mediaType={"Video"}/>
          {recs.map(name => <RecTile recName={name} mediaType={type} key={name} />)}
        </ScrollView>

        {/* Add A Rec PopUp */}
        <Modal isVisible={isModalVisible}>
          <View style={styles.centeredView} >
            <View style={styles.modalView}>
                <Pressable style={[styles.button, styles.buttonClose]}
                    onPress={toggleModal} >
                    <Image source={closePopUpButton} style={{width: 30, height: 30}}/>
                </Pressable>
                <Text style={styles.modalTitle}>Add Recommendation</Text>
                <Text style={styles.modalText}>This will be visible to
                  <Text style={{fontWeight: "900"}}> all members</Text> of this pod
                </Text>
                <View style={{ flexDirection: 'column', alignSelf: 'flex-start', marginTop: 20}}>
                  <DropDownPicker
                    placeholder="Select a media type"
                    items={[
                        {label: 'Song', value: 'Song'},
                        {label: 'Book', value: 'Book'},
                        {label: 'Movie', value: 'Movie'},
                        {label: 'Image', value: 'Image'},
                        {label: 'Article', value: 'Article'},
                        {label: 'YouTube', value: 'YouTube'},
                        {label: 'TikTok', value: 'TikTok'},
                        {label: 'Other', value: 'Other'},
                    ]}
                    defaultIndex={0}
                    dropDownMaxHeight={100}
                    containerStyle={{height: 40, marginBottom: 15}}
                    onChangeItem={items => setmediaType(items.value)}
                  />

                  { selectMediaType() }

                  <Text style={styles.recCategoriesText}>
                    Comments:
                  </Text>
                  <SafeAreaView>
                      <TextInput style={styles.commentInput}
                            onEndEditing={comment => setComment(comment)}
                            maxLength={200}
                            multiline={true}
                            defaultValue={comment}
                            returnKeyType="done"
                            blurOnSubmit={true}
                            onSubmitEditing={()=>{Keyboard.dismiss()}}/>
                  </SafeAreaView>
                </View>
                <Pressable style={styles.createRecButton} onPress={addNewRec}>
                    <Text style={styles.createRecText}>Add</Text>
                </Pressable>
                <KeyboardSpacer />
            </View>
          </View>
        </Modal>

        {/* Add A Rec Button */}
        <View style={{marginRight: 17}}>
            <Image source={addRecButton} style={styles.floatingAddButton}></Image>
        </View>
        <TouchableOpacity activeOpacity={0.25}
            onPress={toggleModal}
            style={styles.floatingAddButton}>
        </TouchableOpacity>
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 30,
    flexGrow:1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: "#f2f2f2"
  },
  text: {
    color: "#fcfbfb"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#6F1D1B",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    // ios
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // android
    elevation: 2,
  },
  button: {
    padding: 10,
  },
  buttonClose: {
    position: 'absolute',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalTitle: {
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 10,
    color: "white",
  },
  modalText: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12,
    color: "white"
  },
  createRecText: {
    color: "#D68C45",
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  createRecButton: {
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    // ios
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // android
    elevation: 2,
  },
  floatingAddButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 25,
    height: 60,
    width: 60,
  },
  recCategoriesText: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  commentInput: {
    height: 50,
    width: 225,
    fontSize: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop:10,
    paddingBottom:10,
    paddingHorizontal: 10,
    marginTop: 5,
  }
});
