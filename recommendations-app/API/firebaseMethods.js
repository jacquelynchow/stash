import * as firebase from "firebase";
import "firebase/firestore";
import {Alert} from "react-native";

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
export function addPodToDB(pod) {
  const db = firebase.firestore();
  db.collection("pods")
    .add({
      pod_name: pod.pod_name,
      pod_picture: pod.pod_picture,
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