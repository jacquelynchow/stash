import * as firebase from "firebase";
import "firebase/firestore";
import {Alert} from "react-native";

// --------- LOG IN / SIGN UP RELATED --------------------------
export async function registration(username, phone) {
  try {
    console.log("signing up");
    const currentUser = firebase.auth().currentUser;

    // adds user to users collection in database
    const db = firebase.firestore();
    db.collection("users")
      .doc(currentUser.uid)
      .set({
        username: username,
        phone: phone,
        pods: {} 
      });
  } catch (err) {
    console.log("sign up failed");
    if (err.message === '') {
      Alert.alert("Signup failed!", "Please try again.");
    } else {
      Alert.alert("Signup failed!", err.message);
    }
  }
}

// sign in w/ email & password
export async function signIn(email, password) {
  try {
   await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
  } catch (err) {
    if (err.message === '') {
      Alert.alert("Login failed!", 'Please try again.');
    } else {
      Alert.alert("Login failed!", err.message);
    }
  }
}

// log out of account
export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}

// --------- CREATING & VIEWING PODS RELATED --------------------------
// add new pod object and properties to the db
export function addPodToDB(pod) {
  const db = firebase.firestore();
  db.collection("pods")
    .add({
      pod_name: pod.pod_name,
      pod_picture: pod.pod_picture,
      pod_picture_url: pod.pod_picture_url,
      num_members: pod.num_members,
      num_recs: pod.num_recs,
      createdAt: firebase.firestore.FieldValue.serverTimestamp() // order pods to show up in order of creation
    })
    .catch((error) => console.log(error)); // log any errors
}

// make a list of pods from the current state of the database and calls callback function to run asyncronously
export async function getPods(podsRecieved) {
  let podList = []; // init podList

  let snapshot = await firebase.firestore() // return a query snapshot of current db
    .collection("pods")
    .orderBy("createdAt") // get pods in order of creation
    .get()

    // push each pod in db to podList
    snapshot.forEach((doc) => {
      podList.push(doc.data());
    });

    podsRecieved(podList); // callback function that occurs asyncronously
}

// upload image to firebase storage folder called pod_images
export async function uploadImageToStorage(uploadUri, imageName) {
  const response = await fetch(uploadUri);
  const blob = await response.blob();

  var ref = firebase.storage().ref().child("pod_images/" + imageName);
  return ref.put(blob);
}

// retrieve url for image from firebase
export function retrieveImageFromStorage(imageName, setSelectedImageUrl) {
  let imageRef = firebase.storage().ref().child("pod_images/" + imageName);
  imageRef.getDownloadURL()
  .then((url) => { // on upload finish, set the selected image url to be the server hosted image url
      setSelectedImageUrl(url);
      console.log("URL set");
      return url;
  })
  .catch((e) => console.log('getting downloadURL of image error => ', e));
}

// delete image from firebase (if not chosen as pod image)
export function deleteImage(selectedImageName) {
  if (selectedImageName != "") {
      console.log("not the first time uploading image");
      let imageRef = firebase.storage().ref().child("pod_images/" + selectedImageName);
      console.log("prevImage: ", selectedImageName);
      imageRef
      .delete()
      .then(() => {
          console.log(`${selectedImageName} has been deleted successfully.`);
      })
      .catch((e) => console.log('error on image deletion => ', e));
  }
  return
}


// --------- CREATING & VIEWING RECS RELATED --------------------------
//add new rec object and properties to the db
{/*
export function addRecToDB(pod) {
  const db = firebase.firestore();
  db.collection("pods")
  .doc(pod) 
  .collection("recs") //want to add rec to pod?
    .add({
      rec_name: rec.rec_name,
      //include pod name
      rec_type: rec.rec_type,
      rec_author: rec.rec_author,
      rec_year: rec.rec_year,
      rec_comments: rec.rec_comments,
      createdAt: firebase.firestore.FieldValue.serverTimestamp() // order recs to show up in order of creation
    })
    .catch((error) => console.log(error)); // log any errors
}

//makes list of recs for pod
export async function getPodRecs(pod){
  let recList = [];

}

//makes list of recs for media
export async function getMediaRecs(){

}
*/}
