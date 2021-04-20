import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Pressable, Text, TextInput, SafeAreaView, Keyboard, Dimensions, RefreshControl, Alert } from 'react-native';
import Modal from 'react-native-modal';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import DropDownPicker from 'react-native-dropdown-picker';
// Components for this Screen
import RecTile from '../components/RecTile';
import closePopUpButton from '../assets/closePopUpButton.png';
import addRecButton from '../assets/addRecButton.png';
import showMembersButton from '../assets/showMembersButton.png';
import PersonIcon from '../assets/person-icon.png';
// Media Types Components
import MovieType from '../components/media-types/MovieType';
import BookType from '../components/media-types/BookType';
import VideoType from '../components/media-types/VideoType';
import SongType from '../components/media-types/SongType';
import JustTitleType from '../components/media-types/JustTitleType';
// Server Related
import * as firebase from 'firebase';
import { addRecToDB, getRecs, getPodRecs } from '../API/firebaseMethods';

//LMTODOs:
//- fix the recYear for Movie Type
//- update between getRecs and getPodRecs -- display recs in that pod
//- error handling - how to reset it once they HAVE selected the thing?
//    instead of having to close the window and reopen to reset
//- provide option to copy and paste into input window for links

const windowHeight = Dimensions.get('window').height;

const PodPage = ({ navigation, route}) => {
  const podData = JSON.parse(JSON.stringify(route.params));
  const numMembers = podData.numMembers;
  const members = Object.keys(podData.members);
  const currentUserUID = podData.userId;
  const username = podData.username;
  const podName = podData.name;
  const podImageUri = podData.uri;
  const podId = podData.podId;
  // call firebase api function getRecs on onRecsReceived function to render recs from db
  useEffect(() => {
    console.log("pod page podId useeffect: " , podId)
    getRecs(podId, onRecsReceived);
  }, []);

  // display pop up when send rec modal view is on
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
      setModalVisible(!isModalVisible);
      resetFields();
  };

  // display pop up when pod members modal view is on
  const [isMembersModalVisible, setMembersModalVisible] = useState(false);
  const toggleMembersModal = () => {
      setMembersModalVisible(!isMembersModalVisible);
  };

  //init various states needed for recs
  const [recs, setRecs] = useState([]);
  const [mediaType, setmediaType] = useState("");
  const [recName, setrecName] = useState("");
  const [recAuthor, setrecAuthor] = useState("");
  const [recLink, setrecLink] = useState("");
  const [recGenre, setrecGenre] = useState("");
  //const [recYear, setrecYear] = useState(0); //TODO - fix recYear for movies
  const [recComment, setrecComment] = useState("");

  // init error state for various send rec form fields
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
      //TODO add recyear back here when working
      let newRec = { pod_id: podId, rec_sender: username, rec_pod: podName,
              rec_type: mediaType, rec_title: recName, rec_author: recAuthor,
              rec_link: recLink, rec_genre: recGenre,
              rec_comment: recComment }
      setRecs([...recs, newRec]);
      // add rec object to database using firebase API function
      await addRecToDB(newRec);
      //close modal pop up
      toggleModal();
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
      setrecLink("");
      setrecGenre("");
      //setrecYear(0);
      setrecComment("");
      setErrors({mediaTypeError: '', nameError: '', linkError: ''});
  }

  // check on Send Rec submit that all fields are filled in correctly
  // required fields: mediaType, name of rec, and a link for videos
  // all other fields are optional and will display as "not provided" if user
  // doesn't provide input for them
  const checkAllFieldsOnSubmit = () => {
      let validSymbols = /^[\w\-\s]+$/;
      let allValid = true;
      let isValid = validSymbols.test(recName);
      // check if media type is selected
      if (mediaType === "") {
          setErrors({mediaTypeError: "*Media type is required to continue"});
          allValid = false;
      }
      // check if rec name empty or only has whitespace
      if (recName === "" || !recName.replace(/\s/g, '').length) {
          setErrors({nameError: "*Title of this recommendation is required"});
          allValid = false;
      // check if rec name is not valid (not just alphanumeric)
      } else if (!isValid) {
          setErrors({nameError: "*Recommendation title must be alphabetic"});
          allValid = false;
      }
      // check if they uploaded link, and if so that it is valid
      if (recLink !== "" && !validURL(recLink)) {
          setErrors({linkError: "*Please enter a valid link"});
          allValid = false;
      }
      // if everything checks out, add to recs list
      if (allValid) {
          addNewRec(recs);
      }
  };

  //function to check if link inputed for Video type recs are valid
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
          console.log("pod page podId: " , podId)
          await getRecs(podId, onRecsReceived) // use await to refresh until function finished
          .then(() => setRefreshing(false));
      }, []);

  // determines which fields show in Add a Rec pop up based on selected media type
  function selectMediaType() {
    if (mediaType == "Movie") {
      return (<MovieType setrecName={setrecName} setrecGenre={setrecGenre}></MovieType>)
    } else if (mediaType == "Book" || mediaType == "Article") {
      return (<BookType setrecName={setrecName} setrecAuthor={setrecAuthor}> </BookType>)
    } else if (mediaType == "TikTok" || mediaType == "YouTube") {
      return (<VideoType setrecName={setrecName} setrecLink={setrecLink}></VideoType>)
    } else if (mediaType == "Song") {
      return (<SongType setrecName={setrecName} setrecAuthor={setrecAuthor}></SongType>)
    } //else if (mediaType == "Other") {
      //return (<JustTitleType setrecName={setrecName}></JustTitleType>)
    //}
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

          {/* Make a rec for each rec stored in the recs list
            TODO add recYear back here when working */}
          {recs && recs.length > 0 ?
              recs.map((rec, index) =>
                <RecTile key={index}
                  podId={podId}
                  recName={rec.rec_title}
                  mediaType={rec.rec_type}
                  recSender={rec.rec_sender}
                  groupName={rec.rec_pod}
                  recAuthor={rec.rec_author}
                  recLink={rec.rec_link}
                  recGenre={rec.rec_genre}
                  recComment={rec.rec_comment}
                  podName={podName} />) :
              <View style={styles.centeredView}>
                  <Text style={styles.noRecsYetTitle}>Click the > button to send a recommendation</Text>
                  <Text style={styles.noRecsYetText}>Recommendations will be shared with all members of this pod</Text>
              </View>
          }

        </ScrollView>

        {/* Show Members PopUp */}
        <Modal isVisible={isMembersModalVisible}>
          <View style={styles} >
            <View style={styles.membersModalView}>
                <Pressable style={[styles.button, styles.buttonClose]}
                    onPress={toggleMembersModal} >
                    <Image source={closePopUpButton} style={{width: 30, height: 30}}/>
                </Pressable>
                <Text style={styles.membersModalTitle}>Pod Members</Text>
                <Text style={styles.membersModalText}>{numMembers} Members</Text>
                { members ? members.map((memberName, index) =>
                  <View style={{ flexDirection: 'row'}}>
                    <Image source={PersonIcon} style={{width: 20, height: 20, marginRight: 5}}></Image>
                    <Text key={index} style={styles.memberNamesText}>{memberName}</Text> 
                  </View>) :
                  <Text style={styles.memberNamesText}>No members in this pod.</Text>
                }
            </View>
          </View>
        </Modal>

        {/* Show Pod Members Button */}
        <View style={{marginRight: 17}}>
            <Image source={showMembersButton} style={styles.floatingShowMembersButton}></Image>
        </View>
        <TouchableOpacity activeOpacity={0.25}
            onPress={toggleMembersModal}
            style={styles.floatingShowMembersButton}>
        </TouchableOpacity>


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
                        //{label: 'Other', value: 'Other'},
                    ]}
                    defaultIndex={0}
                    dropDownMaxHeight={100}
                    containerStyle={{height: 40, marginBottom: 15}}
                    onChangeItem={items => setmediaType(items.value)}
                  />

                  {/* display error message if media type is not selected */}
                  <Text style={styles.errorMessage}>
                    {errors.mediaTypeError}
                    {errors.nameError}
                    {errors.linkError}
                  </Text>

                  {/* display other relevant fields based on selected media type */}
                  { selectMediaType() }

                  {/* prompt users to add a comment for any media type */}
                  <Text style={styles.recCategoriesText}>
                    Comments:
                  </Text>
                  <SafeAreaView>
                      <TextInput style={styles.commentInput}
                            onChangeText={recComment => setrecComment(recComment)}
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

        {/* Send A Rec Button */}
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
    paddingBottom: 130,
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
      marginLeft:25,
      marginRight:25,
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
  membersModalTitle: {
    fontWeight: 'bold',
    fontSize: 35,
    marginTop: 10,
    color: "white",
  },
  membersModalText: {
    marginBottom: 25,
    fontSize: 18,
    color: "white"
  },
  memberNamesText: {
    fontSize: 16,
    color: "white",
    marginBottom: 5
  },
  membersModalView: {
    margin: 20,
    backgroundColor: "#6F1D1B",
    borderRadius: 20,
    padding: 35,
    // ios
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // android
    elevation: 2,
  },
  floatingShowMembersButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 100,
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