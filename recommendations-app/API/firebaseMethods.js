import * as firebase from "firebase";
import "firebase/firestore";
import {Alert} from "react-native";
import { cos } from "react-native-reanimated";

// register new user w/ email & password
export async function registration(email, password, username) {
  try {
    // creates new user under "Authentication - Users"
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const currentUser = firebase.auth().currentUser;

    // adds user to users collection in database
    const db = firebase.firestore();
    db.collection("users")
      .doc(currentUser.uid)
      .set({
        email: currentUser.email,
        username: username,
      });
  } catch (err) {
    Alert.alert("There is something wrong!!!!", err.message);
  }
}

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

export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}

// add new pod object and properties to the db
export async function addPodToDB(pod) {
  const db = firebase.firestore();
  // add new pod to db
  db.collection("pods")
    .add({
      pod_name: pod.pod_name,
      pod_picture: pod.pod_picture,
      pod_picture_url: pod.pod_picture_url,
      num_members: pod.num_members,
      num_recs: pod.num_recs,
      members: pod.members,
      createdAt: firebase.firestore.FieldValue.serverTimestamp() // order pods to show up in order of creation
    })
    .catch((error) => console.log(error)); // log any errors 
  
  const usersDb = db.collection("users");
  
  // add this new pod data to each members' object
  const fakeList = Object.keys(pod.members); 
  // get the uids of each user just added to this new pod
  const userIds = await getListOfUserIds(fakeList, usersDb);
  
  // using the uid of each user, update their respective list of pods 
  // by adding the new pod's name to the array without rewriting old data
  const podName = pod.pod_name;
  userIds.forEach((uid) => {
    usersDb.doc(uid).update({
      [`pods.${podName}`]: true,
    })
  })
}

// get list of uids from db when given a list of member usernames
async function getListOfUserIds(usersList, usersDb) {
  const userIds = []
  for (const username of usersList) {
    await usersDb.where("username", "==", username)
      .get()
      .then((obj) => {
        obj.forEach((doc) => {
            userIds.push(doc.id);
        });
      })
      .catch((e) => console.log("error in looking up matching user ids: " + e));
    }
  return userIds;
}

// make a list of pods from the current state of the database and call callback function to run asyncronously
export async function getPods(podsRecieved) {
  let pods = []; // init list of pods the user is a current member of
  let podList = []; // init podList for pod data
  // grab current user's uid
  const currentUserUid = firebase.auth().currentUser.uid;
  // get all current user's pods and add to list
  await firebase.firestore().collection("users")
    .doc(currentUserUid)
    .get()
    .then((doc) => {
      pods = Object.keys(doc.data().pods) // save the pods keys (aka pod names) to pods list
    })
    .catch((e) => console.log("error in adding getting pods for current user: " + e));
  // get all pods that current user is a part of and add to podList which will be re-rendered every refresh
  const podsRef = firebase.firestore().collection("pods");
  for (const podName of pods) {
    await podsRef
      .where("pod_name", "==", podName) // save pod's data to podList
      .get()
      .then((obj) => {
        obj.forEach((doc) => {
            podList.push(doc.data());
        });
      })
      .catch((e) => console.log("error in adding pods to podList: " + e));
  }
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

// get users that match the username or is close to the username
export async function getUsers(searchUsername, currentUsername) {
  let usersList = []; // init usersList
  
  // username query not case-sensitive, searchUsername was changed to all lowercase
  let snapshot = await firebase.firestore() // return a query snapshot of current db
    .collection("users")
    .where("username", ">=", searchUsername).where("username", "<=", searchUsername + '~')
    // .where("username", "==", searchUsername)
    .get();

    // push each users object in db to usersList
    snapshot.forEach((doc) => {
      usersList.push(doc.data());
    });
  // if the usersList has users, return the list of user objects
  if (usersList) {
    // use filter method to make a new list of usernames without current user's username
    return usersList.filter((userData) => { return userData.username != currentUsername })
  } 
  return null;
}