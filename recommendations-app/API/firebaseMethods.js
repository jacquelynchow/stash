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
  const usernamesList = Object.keys(pod.members);
  // get the uids of each user just added to this new pod
  const userIds = await getListOfUserIds(usernamesList, usersDb);

  // using the uid of each user, update their respective list of pods
  // by adding the new pod's name to the array without rewriting old data
  const podName = pod.pod_name;
  userIds.forEach((uid) => {
    usersDb.doc(uid).update({
      [`pods.${podName}`]: true,
    })
  })
}

// delete existing pod object from the db
export async function deletePodFromDB(pod) {
  const db = firebase.firestore();

  // get pod from db and delete it
  db.collection('pods').where('pod_name', '==', pod.groupName)
  .get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      doc.ref.delete();
    });
  });

  // delete this pod data from each members' object
  const usersDb = db.collection("users");

  const usernamesList = Object.keys(pod.members);
  // get the uids of each user in this pod
  const userIds = await getListOfUserIds(usernamesList, usersDb);

  // using the uid of each user, update their respective list of pods
  const podName = pod.groupName;
  userIds.forEach((uid) => {
    usersDb.doc(uid).update({
      [`pods.${podName}`]: false,
    })
  })

  // todo: delete all recs that were in the pod? delete pod image from firebase?

  console.log("deleting in parent", pod.groupName, pod.members);
}

// get list of uids from db when given a list of member usernames
async function getListOfUserIds(usernamesList, usersDb) {
  const userIds = []
  for (const username of usernamesList) {
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

// --------- CREATING & VIEWING RECS RELATED --------------------------
//add new rec object and properties to the db
export function addRecToDB(rec) {
  const db = firebase.firestore();
  db.collection("recs")
    .add({
      rec_type: rec.rec_type,
      rec_title: rec.rec_title,
      rec_author: rec.rec_author,
      rec_sender: rec.rec_sender,
      rec_pod: rec.rec_pod,
      rec_link: rec.rec_link,
      rec_genre: rec.rec_genre,
      //rec_year: rec.rec_year,
      rec_comment: rec.rec_comment,
      createdAt: firebase.firestore.FieldValue.serverTimestamp() // order recs to show up in order of creation
    })
    //.catch((error) => console.log(error)); // log any errors
    //TODO: when add rec also update #recs in pod -> use updateNumRecsInPod
}

export function updateNumRecsInPod(pod) {
  const db = firebase.firestore();
  const increment = firebase.firestore.FieldValue.increment(1);
  db.collection("pods")
  .where('pod_name','==',pod.pod_name)
    .update({
      num_recs : increment
    })
    .catch((error) => console.log(error));
}

// make a list of recs from the current state of the database and calls callback function to run asyncronously
export async function getRecs(recsRecieved) {
  let recList = []; // init recList

  let snapshot = await firebase.firestore() // return a query snapshot of current db
    .collection("recs")
    //neeed to look at recs for the 1 user
    .orderBy("createdAt") // get recs in order of creation
    .get()

    // push each rec in db to recList
    snapshot.forEach((doc) => {
      recList.push(doc.data());
    });

    recsRecieved(recList); // callback function that occurs asyncronously
}

//makes list of recs for pod
export async function getPodRecs(pod){
  let recsInPod = [];
  //TODO: search recs for that user and add to recList the recs
  // with a rec_pod that matches the pod.pod_name for given pod
  let snapshot = await firebase.firestore() // return a query snapshot of current db
    .collection("recs")
    //need to only look at recs for the 1 user
    .where('rec_pod','==',pod.pod_name)
    .orderBy("createdAt") // get recs in order of creation
    .get()
    // push each pod in db to podList
    snapshot.forEach((doc) => {
      recsInPod.push(doc.data());
    });
    podsRecieved(recsInPod);
}

//makes list of recs for media
export async function getMediaRecs(recsRecieved,media_type){
  let recsInMedia = [];
  // grab current user's uid
  const currentUserUid = firebase.auth().currentUser.uid;
  // get all current user's pods and add to list
  // await firebase.firestore().collection("users")
  //   .doc(currentUserUid)
  //   .get()
  //   .then((doc) => {
  //     pods = Object.keys(doc.data().pods) // save the pods keys (aka pod names) to pods list
  //   })
  //   .catch((e) => console.log("error in adding getting pods for current user: " + e));

  //   .where('rec_pod','in',podList)


    let snapshot = await firebase.firestore()
    .collection("recs")
    //need to look at recs for the 1 user
    .where('rec_type', '==', media_type)
    .get()
    .then((obj) => {
      obj.forEach((doc) => {
          recsInMedia.push(doc.data());
      });
    })
    .catch((e) => console.log("error in adding pods to recsInMedia: " + e));

    recsRecieved(recsInMedia);
}

//get number of all recs for user
export async function getNumRecsForUser(){
  const currentUserUid = firebase.auth().currentUser.uid;
  await firebase.firestore().collection("users")
    .doc(currentUserUid)
    .get()
    .then((doc) => {
      pods = Object.keys(doc.data().pods) // save the pods keys (aka pod names) to pods list
    })
  db.collection("recs")
  .where('rec_pod','==', pods) //need to get it for only the user
  .get()
  .then(function(querySnapshot) {
    (querySnapshot.numChildren());
});

}

//gets number of recs for media type
  export async function getNumRecsForMedia(media_type){
    const currentUserUid = firebase.auth().currentUser.uid;
    await firebase.firestore().collection("users")
      .doc(currentUserUid)
      .get()
      .then((doc) => {
        pods = Object.keys(doc.data().pods) // save the pods keys (aka pod names) to pods list
      })
    db.collection("recs")
    .where('rec_pod','==', pods)
    .where('rec_type', '==', media_type)
    .get()
    .then(function(querySnapshot) {
      console.log(querySnapshot.numChildren());
  });
  }
