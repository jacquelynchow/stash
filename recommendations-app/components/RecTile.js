import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from 'react-native';
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
    else if (props.mediaType == "Video") {
        return styles.videoBackgroundColor
    }
}

  return (
      <View style={styles.item}>
          <TouchableOpacity activeOpacity={0.25} onPress={toggleModal}>
              <Image source={selectImage()} style={styles.recImage}></Image>
              <Text style={[styles.name, selectColor()]}>{props.recName}</Text>
              <Text style={styles.media}>{props.mediaType}</Text>
          </TouchableOpacity>

          {/* Rec Details PopUp */}
          <Modal isVisible={isModalVisible}>
              <View style={styles.centeredView}>
                  <View style={[styles.modalView, selectBackgroundColor()]}>
                      <Pressable style={[styles.button, styles.buttonClose]}
                          onPress={toggleModal} >
                          <Image source={closePopUpButton} style={{width: 30, height: 30}}/>
                      </Pressable>
                      {/* icon based on media type */}
                      <Image source={selectImage()} style={styles.recImagePopUp}></Image>
                      {/* display all recommendation information: */}
                      <Text style={styles.modalTitle}> {props.recName} </Text>
                      <Text style={styles.modalText}> {props.mediaType} </Text>
                      {/* TODO: update this in the instance that some fields aren't filled for media type
                      example - don't want "view at" for link if it's a book*/}
                      {/* Author */}
                      <Text style={styles.modalText}>
                        <Text style={styles.modalHeading}>By: </Text>
                        {props.recAuthor}
                      </Text>
                      {/* Link */}
                      <Text style={styles.modalText}>
                        <Text style={styles.modalHeading}>View at: </Text>
                        {props.recLink}
                      </Text>
                      {/* Comments */}
                      <Text style={styles.modalText}>
                        <Text style={styles.modalHeading}>Comments: </Text>
                        {props.recComment}
                      </Text>
                      {/* Sender */}
                      <Text style={styles.modalSubtitle}>Sent by {props.recSender} in {props.groupName} pod</Text>


                  </View>
              </View>
          </Modal>

      </View>
  )
}

const styles = StyleSheet.create({
    item: {
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
        padding: 80,
        alignItems: "center",
        // ios
        shadowOffset: {width: 10, height: 10},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // android
        elevation: 2,
    },
    buttonClose: {
        position: 'absolute',
        alignSelf: 'flex-start',
        marginTop: 10,
        marginLeft: 10,
    },
    modalTitle: {
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 30,
        marginBottom: 5,
        color: "white",
    },
    modalHeading: {
        marginTop: 5,
        textAlign: "center",
        fontSize: 13,
        fontWeight: "900",
        color: "white"
    },
    modalText: {
        marginTop: 5,
        textAlign: "center",
        fontSize: 15,
        color: "white"
    },
    modalSubtitle: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 13,
        fontStyle: "italic",
        color: "white"
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
        width: 90,
        height: 90,
        marginTop: 20,
        borderRadius: 10,
    },
    recImagePopUp:{
      width: windowWidth/3,
      height: windowWidth/2.5,
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
    }
})

export default RecTile;
