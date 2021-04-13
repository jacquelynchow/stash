import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Pressable, Text, TextInput, SafeAreaView, Keyboard, Dimensions, RefreshControl, Alert } from 'react-native';
import Modal from 'react-native-modal';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import DropDownPicker from 'react-native-dropdown-picker';
// Components for this Screen
import RecTile from '../components/RecTile';
import closePopUpButton from '../assets/closePopUpButton.png';
import addRecButton from '../assets/addRecButton.png';
// Media Types Components
import MovieType from '../components/media-types/MovieType';
import BookType from '../components/media-types/BookType';
import VideoType from '../components/media-types/VideoType';
import SongType from '../components/media-types/SongType';
import JustTitleType from '../components/media-types/JustTitleType';
// Server Related
import * as firebase from 'firebase';
import { addRecToDB, getRecs, getPodRecs } from '../API/firebaseMethods';

//LMTODO - update between getRecs and getPodRecs

const windowHeight = Dimensions.get('window').height;

const PodPage = (props) => {

  const currentUserUID = props.userId;
  const currentPod = props.groupName;
  const username = props.username;

  // call firebase api function getRecs on onRecsReceived function to render recs from db
  useEffect(() => {
      getRecs(onRecsReceived);
  }, []);

  // display pop up when modal view is on
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
      setModalVisible(!isModalVisible);
  };

  //init various states needed for recs
  const [recs, setRecs] = useState([]);
  const [mediaType, setmediaType] = useState("");
  const [recName, setrecName] = useState("");
  const [recAuthor, setrecAuthor] = useState("");
  const [recLink, setrecLink] = useState("");
  const [recComment, setrecComment] = useState("");

  // init error state for various form fields
  const [errors, setErrors] = useState({
      mediaTypeError: '', nameError: '', linkError: ''
  });

  // add new rec dynamically when 'Send a Rec' submitted
  const addNewRec = async (recs) => {
      let recLength = 0;
      if (recs && recs.length > 0) {
        recLength = recs.length;
      }
      // add group name of new pod to existing list
  //LMTODO - should only include fields that work for all mediatypes here?
  //or call with all but they are default blank because of init. Rec tile pop up doesn't open
      let newRec = { key: recs.length + 1, rec_type: mediaType, rec_title: recName,
              rec_author: recAuthor, rec_comment: recComment}
      {/*let newRec = { key: recs.length + 1, rec_sender: username, rec_pod: currentPod,
              rec_type: mediaType, rec_title: recName, rec_author: recAuthor,
              rec_link: recLink, rec_comment: recComment} */}
      setRecs([...recs, newRec]);
      // add rec object to database using firebase API function
      addRecToDB(newRec);
      //close modal pop up
      toggleModal(); //LMTODO recs are adding without pop up closing
      //reset input fields to blank
      resetFields();
  };

  // once recs are received, set recs to these received recs
  const onRecsReceived = (recList) => {
      setRecs(recList);
  };

  // resets all form fields on Send a Rec modal
  const resetFields = () => {
      setmediaType("");
      setrecName("");
      setrecAuthor("");
      setrecAuthor("");
      //LMTODO do I need to reset all other fiels in each file too?
      //or all other possible subcategory of each media type?
      setrecComment("");
      setErrors({mediaTypeError: '', nameError: '', linkError: ''});
  }

//LMTODO - can all error checking be done here? or does it have to be in each type subfile?

  // check on Send Rec submit that all fields are filled in correctly
  const checkAllFieldsOnSubmit = () => {
      let validSymbols = /^[\w\-\s]+$/;
      let allValid = true;
      let isValid = validSymbols.test(recName);
    //LMTODO - figure out these testing calls - recs don't add when tests are uncommented
      {/* // check if media type is selected
      if (mediaType === "") {
          setErrors({mediaTypeError: "Recommendation media type is required to continue"});
          allValid = false;
      }
      // check if rec name empty or only has whitespace
      if (recName === "" || !recName.replace(/\s/g, '').length) {
          setErrors({nameError: "Title of this recommendation is required"});
          allValid = false;
      // check if rec name is not valid (not just alphanumeric)
      } else if (!isValid) {
          setErrors({nameError: "Recommendation title must be alphabetic"});
          allValid = false;
      }
      // check if they uploaded link, and if so that it is valid
      if (recLink !== "" && !validURL(recLink)) {
          setErrors({linkError: "Please enter a valid link"});
          allValid = false;
      } */}
      // if everything checks out, add to recs list
      if (allValid) {
          addNewRec(recs);
      }
  };

//LMTODO - when testing actually works, test the URL validator
  //function to check if link attached to rec is valid
  function validURL(url) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
  }

  // refresh page function to see new recs
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
          setRefreshing(true);
          await getRecs(onRecsReceived) // use await to refresh until function finished
          .then(() => setRefreshing(false));
      }, []);

  // determines which fields show in Add a Rec pop up based on selected media type
  function selectMediaType() {
    if (mediaType == "Movie") {
      return (<MovieType></MovieType>)
    } else if (mediaType == "Book" || mediaType == "Article") {
      return (<BookType></BookType>)
    } else if (mediaType == "TikTok" || mediaType == "YouTube") {
      return (<VideoType></VideoType>)
    } else if (mediaType == "Song") {
      return (<SongType></SongType>)
    } else if (mediaType == "Other") {
      return (<JustTitleType></JustTitleType>)
    }
  };

    return (
      <View style={{flex: 1}} >

        {/* Pull screen down for recommendations refresh */}
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }>

          {/* make a rec for each rec stored in the recs list */}
          {recs && recs.length > 0 ?
              recs.map(rec => <RecTile key={rec.key} recName={rec.rec_title}
                  mediaType={rec.rec_type} recSender={rec.rec_sender} groupName={rec.rec_pod}
                  recAuthor={rec.rec_author} recLink={rec.rec_link} recComment={rec.rec_comment}/>) :
              <View style={styles.centeredView}>
                  <Text style={styles.noRecsYetTitle}>Click the > button to send a recommendation</Text>
                  <Text style={styles.noRecsYetText}>Recommendations will be shared with all members of this pod</Text>
              </View>
          }

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

                {/* prompt users to select a media type */}
                <View style={{ flexDirection: 'column', alignSelf: 'flex-start', marginTop: 20}}>
                  <DropDownPicker
                    placeholder="Select a media type"
                    items={[
                        {label: 'Article', value: 'Article'},
                        {label: 'Book', value: 'Book'},
                        {label: 'Movie', value: 'Movie'},
                        {label: 'Song', value: 'Song'},
                        {label: 'TikTok', value: 'TikTok'},
                        {label: 'YouTube', value: 'YouTube'},
                        {label: 'Other', value: 'Other'},
                    ]}
                    defaultIndex={0}
                    dropDownMaxHeight={100}
                    containerStyle={{height: 40, marginBottom: 15}}
                    onChangeItem={items => setmediaType(items.value)}
                  />

                  {/* display error message if not selected */}
                  <View style={{ display: 'flex', justifyContent: 'flex-start'}}>
                      <Text style={styles.errorMessage}>{errors.mediaTypeError}</Text>
                  </View>

                  {/* display other relevant fields based on selected media type */}
                  { selectMediaType() }

                  {/* prompt users to add a comment for any media type */}
                  <Text style={styles.recCategoriesText}>
                    Comments:
                  </Text>
                  <SafeAreaView>
                      <TextInput style={styles.commentInput}
                            onEndEditing={recComment => setrecComment(recComment)}
                            maxLength={200}
                            multiline={true}
                            defaultValue={recComment}
                            returnKeyType="done"
                            blurOnSubmit={true}
                            onSubmitEditing={()=>{Keyboard.dismiss()}}/>
                  </SafeAreaView>
                </View>

                <Pressable style={styles.createRecButton} onPress={checkAllFieldsOnSubmit}>
                    <Text style={styles.createRecText}>Add</Text>
                </Pressable>
                <KeyboardSpacer />
            </View>
          </View>
        </Modal>

        {/* Add A Rec Button */}
        <View style={styles.bottomButtonView}>
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
  bottomButtonView: {
    marginRight: 17,
    // ios
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: .5,
    shadowRadius: 10,
    // android
    elevation: 3,
  },
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
  noRecsYetTitle: {
      marginTop: windowHeight/4,
      textAlign: "center",
      color: "#6F1D1B",
      fontWeight: "700",
      fontSize: 22,
  },
  noRecsYetText: {
      textAlign: "center",
      color: "#6F1D1B",
      fontStyle: 'italic',
      marginTop: 10,
      fontSize: 14
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
  },
  errorMessage: {
      color: '#ffc9b9',
  }
})

export default PodPage;
