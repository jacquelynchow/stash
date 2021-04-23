import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, Pressable, Linking } from 'react-native';
import closePopUpButton from '../assets/closePopUpButton.png';
import Modal from 'react-native-modal';
import bookIcon from '../assets/type-icons/book.png';
import movieIcon from '../assets/type-icons/movie.png';
import songIcon from '../assets/type-icons/song.png';
import tiktokIcon from '../assets/type-icons/tiktok.png';
import articleIcon from '../assets/type-icons/article.png';
import youtubeIcon from '../assets/type-icons/youtube.png';

const windowWidth = Dimensions.get('window').width;

const RecTile = (props) => {

  // For pop up display
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
      setModalVisible(!isModalVisible);
  };

//To display different icon based on media type
function selectImage() {
    if (props.mediaType == "Article") {
        return articleIcon
    }
    else if (props.mediaType == "Book") {
        return bookIcon
    }
    else if (props.mediaType == "Movie") {
        return movieIcon
    }
    else if (props.mediaType == "Song") {
        return songIcon
    }
    else if (props.mediaType == "TikTok") {
        return tiktokIcon
    }
    else if (props.mediaType == "YouTube") {
        return youtubeIcon
    }
}

//To display the correct colour for the recommendation title based on media type
function selectColor() {
    if (props.mediaType == "Article") {
        return styles.articleColor
    }
    else if (props.mediaType == "Book") {
        return styles.bookColor
    }
    else if (props.mediaType == "Movie") {
        return styles.movieColor
    }
    else if (props.mediaType == "Song") {
        return styles.songColor
    }
    else if (props.mediaType == "TikTok") {
        return styles.tiktokColor
    }
    else if (props.mediaType == "YouTube") {
        return styles.videoColor
    }
}

//To display the correct background colour for the recommendation pop up by media type
function selectBackgroundColor() {
    if (props.mediaType == "Article") {
        return styles.articleBackgroundColor
    }
    else if (props.mediaType == "Book") {
        return styles.bookBackgroundColor
    }
    else if (props.mediaType == "Movie") {
        return styles.movieBackgroundColor
    }
    else if (props.mediaType == "Song") {
        return styles.songBackgroundColor
    }
    else if (props.mediaType == "TikTok") {
        return styles.tiktokBackgroundColor
    }
    else if (props.mediaType == "YouTube") {
        return styles.videoBackgroundColor
    }
}

// determines what to display in addition to title and comment based on media type
// and what the sender actually inputted when sending the rec
function displayRecDetails(){
  // for Articles and Books, only display author/artist
  if (props.mediaType == "Article" || props.mediaType == "Book" || props.mediaType == "Song"){
    // if they didn't include an author, display "not provided"
    if (props.recAuthor == ""){
      return(
        <Text style={styles.modalText}>
          <Text style={styles.modalHeading}>By: </Text>
          <Text style={styles.modalSubtitle}>Not provided </Text>
        </Text>)}
    // if they did, display the author name
    else {
      return(
        <Text style={styles.modalText}>
          <Text style={styles.modalHeading}>By: </Text>
          {props.recAuthor}
        </Text>)}

  // for videos (TikTok and YouTube) only display link
  // recLink is required, so no else case
  } else if (props.mediaType == "TikTok" || props.mediaType == "YouTube") {
      return(
        <Text>
          <Text style={styles.modalHeading}>View at: </Text>
          <Text style={styles.modalText}
              onPress={() => Linking.openURL(props.recLink)}>
            {props.recLink}
          </Text>
        </Text>)

  // for movies, display genre and year
  } else if (props.mediaType == "Movie") {
      //GENRE & YEAR COMBINATIONS - display "not provided" if not inputted
      // (1) if they didn't include a genre or a year
      if (props.recGenre == "" && props.recYear == 0) {
        return(
          <Text style={styles.modalText}>
            <Text style={styles.modalHeading}>Genre: </Text>
            <Text style={styles.modalSubtitle}>Not provided </Text>
            {"\n"}
            <Text style={styles.modalHeading}>Year: </Text>
            <Text style={styles.modalSubtitle}>Not provided </Text>
          </Text>)
      }
      // (2) if they included a genre but no year
      else if (props.recGenre !== "" && props.recYear == 0){
        return(
          <Text style={styles.modalText}>
            <Text style={styles.modalHeading}>Genre: </Text>
            {props.recGenre}
            {"\n"}
            <Text style={styles.modalHeading}>Year: </Text>
            <Text style={styles.modalSubtitle}>Not provided </Text>
          </Text>)
      }
      // (3) if they included a year but no genre
      else if (props.recGenre == "" && props.recYear !== 0) {
        return(
          <Text style={styles.modalText}>
            <Text style={styles.modalHeading}>Genre: </Text>
            <Text style={styles.modalSubtitle}>Not provided </Text>
            {"\n"}
            <Text style={styles.modalHeading}>Year: </Text>
            {props.recYear}
          </Text>
           )
      }
      // (4) if they provided both
      else {
        return(
          <Text style={styles.modalText}>
            <Text style={styles.modalHeading}>Genre: </Text>
            {props.recGenre}
            {"\n"}
            <Text style={styles.modalHeading}>Year: </Text>
            {props.recYear}
          </Text>)
      }
  }
}

// displays the comment added by the sender, or "not provided" if they didn't
// include a comment
function displayComments(){
  // if they didn't include a comment
  if (props.recComment == ""){
    return(
      <Text style={styles.modalText}>
        <Text style={styles.modalHeading}>Comments: </Text>
        <Text style={styles.modalSubtitle}>Not provided </Text>
      </Text>)}
  // if they did, display the author name
  else {
    return(
      <Text style={styles.modalText}>
        <Text style={styles.modalHeading}>Comments: </Text>
        {props.recComment}
      </Text>)}
}

// function recSeen(recKey) {

// }

  return (
      <View style={styles.item}>
          <TouchableOpacity activeOpacity={0.25} onPress={toggleModal}>
              <Image source={selectImage()} style={styles.recImage}></Image>
              <Text style={[styles.name, selectColor()]}>
                {/* if rec title is longer than two lines worth, shorten it with "..." */}
                { props.recName.length > 22 ? props.recName.substring(0,22) + "..." : props.recName }
              </Text>
              <Text style={styles.media}>{props.mediaType}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity activeOpacity={0.6} >
            <View style={styles.checkmark} onClick = {() => recSeen(props.key)}></View>
          </TouchableOpacity> */}

          {/* Rec Details PopUp */}
          <Modal isVisible={isModalVisible}>
              <View style={styles.centeredView}>
                  <View style={[styles.modalView, selectBackgroundColor()]}>
                      <Pressable style={[styles.button, styles.buttonClose]}
                          onPress={toggleModal} >
                          <Image source={closePopUpButton} style={{width: 30, height: 30}}/>
                      </Pressable>

                      {/* display icon based on media type */}
                      <Image source={selectImage()} style={styles.recImagePopUp}></Image>

                      {/* display recName and mediaType for all recs
                      both are required when creating a rec - will display for all*/}
                      <Text style={styles.modalTitle}> {props.recName} </Text>
                      <Text style={styles.modalType}> {props.mediaType} </Text>

                      {/* display other fields based on media type*/}
                      { displayRecDetails() }

                      {/* display comments - not required when sending rec*/}
                      { displayComments() }

                      {/* display sender and pod */}
                      <Text style={styles.modalSubtitle}>Recommended by
                        <Text style={{fontWeight: "700"}}> {props.recSender} </Text>
                        {"\n"}in
                        <Text style={{fontWeight: "700"}}> {props.groupName} </Text>
                        pod</Text>
                  </View>
              </View>
          </Modal>

      </View>
  )
}

const styles = StyleSheet.create({
    item: {
      flexDirection: 'row', justifyContent: 'space-between',
      width: '45%', // almost half of container width
      borderColor: "black",
      borderRadius: 10,
      backgroundColor: "#ffffff",
      marginBottom: 20,
      marginTop: 0,
      marginHorizontal: '2%',
      // ios
      shadowOffset: {width: 10, height: 10},
      shadowOpacity: 0.1,
      shadowRadius: 10,
      // android
      elevation: 2,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 15,
        borderRadius: 20,
        padding: 40,
        // ios
        shadowOffset: {width: 10, height: 10},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // android
        elevation: 2,
        alignItems: 'center'
    },
    buttonClose: {
        position: 'absolute',
        alignSelf: 'flex-start',
        marginTop: 10,
        marginLeft: 10,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 20,
        marginBottom: 5,
        color: "white",
        textAlign: 'center',
    },
    modalHeading: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
        fontSize: 14,
        fontWeight: "900",
        color: "white"
    },
    modalType: {
        marginBottom: 10,
        fontSize: 14,
        color: "white",
    },
    modalText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 14,
        color: "white",
    },
    modalSubtitle: {
        marginTop: 20,
        fontSize: 12,
        fontStyle: "italic",
        color: "white",
        textAlign: 'center'
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 15,
        paddingBottom: 0,
        // colour is determined based on selectColor() function - options below
    },

    media: {
        padding: 15,
        paddingTop: 5,
    },
    recImage: {
        marginLeft: 15,
        width: 70,
        height: 70,
        marginTop: 20,
        borderRadius: 10,
    },
    recImagePopUp:{
      width: windowWidth/3,
      height: windowWidth/5,
      borderRadius: 10,
    },
    //different colour for recommendation title text based on media type
    articleColor:{
      color: "#D68C45",
    },
    bookColor: {
      color: "#D26D64",
    },
    movieColor: {
      color: "#B05E7E",
    },
    songColor: {
      color: "#7D5A86",
    },
    tiktokColor: {
      color: "#4B5476",
    },
    videoColor: {
      color: "#2F4858",
    },
    //different colour for recommendation pop up background based on media type
    articleBackgroundColor:{
      backgroundColor: "#D68C45",
    },
    bookBackgroundColor: {
      backgroundColor: "#D26D64",
    },
    movieBackgroundColor: {
      backgroundColor: "#B05E7E",
    },
    songBackgroundColor: {
      backgroundColor: "#7D5A86",
    },
    tiktokBackgroundColor: {
      backgroundColor: "#4B5476",
    },
    videoBackgroundColor: {
      backgroundColor: "#2F4858",
    },
    checkmark: {
      alignContent: 'flex-end',
      padding: 15,
      marginTop: 20,
      marginRight: 10,
      width: 1,
      height: 1,
      borderRadius: 30,
      backgroundColor: "#f2f2f2",
      borderColor: "rgba(227, 227, 227, 0.8)",
      borderWidth: 1,
    }
})

export default RecTile;
