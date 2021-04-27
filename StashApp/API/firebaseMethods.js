import {Alert, DatePickerIOSBase} from "react-native";
// Server related
import * as firebase from "firebase";
import "firebase/firestore";

// --------- LOG IN / SIGN UP RELATED --------------------------
// sign up a new user
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
  const newPodRef = db.collection("pods").doc();
  await newPodRef.set({
      pod_id: newPodRef.id,
      pod_name: pod.pod_name,
      pod_picture: pod.pod_picture,
      pod_picture_url: pod.pod_picture_url,
      num_members: pod.num_members,
      num_recs: pod.num_recs,
      members: pod.members,
      recIds: [],
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
  userIds.forEach((uid) => {
    usersDb.doc(uid).update({
      [`pods.${newPodRef.id}`]: true,
    })
  })
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
      pods = Object.keys(doc.data().pods) // save the pods keys (aka pod ids) to pods list
    })
    .catch((e) => console.log("error in adding getting pods for current user: " + e));
  // get all pods that current user is a part of and add to podList which will be re-rendered every refresh
  await getPodsForUser(podList, pods);
  podsRecieved(podList); // callback function that occurs asyncronously
}

// get all pods that current user is a part of & podList is the returned and modified list
async function getPodsForUser(podList, pods) {
  const podsRef = firebase.firestore().collection("pods");
  for (const podId of pods) {
    await podsRef
      .where("pod_id", "==", podId) // save pod's data to podList
      .get()
      .then((obj) => {
        obj.forEach((doc) => {
            podList.push(doc.data());
        });
      })
      .catch((e) => console.log("error in adding pods to podList: " + e));
  }
}

// change pod's name to a new name using its podId
export async function changePodNameInDB(newName, podId) {
  const podsRef = firebase.firestore().collection("pods");
  await podsRef
    .doc(podId) 
    .update({
      pod_name : newName // update old pod name to new name
    })
    .then(() => console.log("updated new pod name"))
    .catch((e) => console.log("error in changing pod name: " + e));

    firebase.firestore().collection('recs').where('pod_id', '==', podId)
    .get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.update({
          rec_pod : newName
        });
      });
    });
  
}

// upload image to firebase storage folder called pod_images
export async function uploadImageToStorage(uploadUri, imageName) {
  const response = await fetch(uploadUri);
  const blob = await response.blob();

  var ref = firebase.storage().ref().child("pod_images/" + imageName);
  return ref.put(blob);
}

// retrieve url for image from firebase
export async function retrieveImageFromStorage(imageName, setSelectedImageUrl) {
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

// delete existing pod object from the db*****************************
export async function deletePodFromDB(pod) {
  const db = firebase.firestore();
  const imageName = pod.image;

  // get pod from db and delete it
  db.collection('pods').where('pod_id', '==', pod.podId)
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
  userIds.forEach((uid) => {
    usersDb.doc(uid).update({
      // remove pod from user's list of pods
      [`pods.${pod.podId}`]: firebase.firestore.FieldValue.delete()
    })
  })

  // delete pod image from firebase
  deleteImage(imageName);

  // delete all recs that were in the pod
  db.collection('recs').where('pod_id', '==', pod.podId)
  .get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      doc.ref.delete();
    });
  });
}

// let user leave pod***********************************
export async function removeMemberFromPod(pod) {
  const currentUserUid = firebase.auth().currentUser.uid;
  const userDb = firebase.firestore().collection("users").doc(currentUserUid);
  // const podName = pod.groupName;
  let username = "";
  
  // delete this pod from the user's list------------------
  await userDb
    .update({
      [`pods.${pod.podId}`]: firebase.firestore.FieldValue.delete()
  })

  // get current user's username --------------------------
  await userDb.get().then((doc) => {
      if (doc.exists) {
          username = doc.data().username;
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });

  // delete user from pod's members list--------------------
  const db = firebase.firestore();
  const decrement = firebase.firestore.FieldValue.increment(-1);

  db.collection('pods').where('pod_id', '==', pod.podId)
  .get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      doc.ref.update({
        [`members.${username}`]: firebase.firestore.FieldValue.delete()
      })
      .catch((error) => console.log(error));
    });
  });

  // decrement from number of members in the pod
  db.collection("pods").where('pod_id', '==', pod.podId)
  .get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      doc.ref.update({
        num_members: decrement
      })
      .catch((error) => console.log(error));
    });
  });
}

// --------- CREATING & VIEWING RECS RELATED --------------------------
//add new rec object and properties to the db
export async function addRecToDB(rec) {
  const newRecRef = firebase.firestore().collection("recs").doc();
  await newRecRef.set({
    id: newRecRef.id,
    pod_id: rec.pod_id,
    rec_type: rec.rec_type,
    rec_title: rec.rec_title,
    rec_author: rec.rec_author,
    rec_sender: rec.rec_sender,
    rec_pod: rec.rec_pod,
    rec_link: rec.rec_link,
    rec_genre: rec.rec_genre,
    rec_year: rec.rec_year,
    rec_comment: rec.rec_comment,
    seenBy: {},
    createdAt: firebase.firestore.FieldValue.serverTimestamp() // order recs to show up in order of creation
  })

  // update pod it belongs to with rec id & increment number of recs count
  const podRef = firebase.firestore().collection("pods");
  const increment = firebase.firestore.FieldValue.increment(1);
  await podRef
    .doc(rec.pod_id)
    .update({
      recIds: firebase.firestore.FieldValue.arrayUnion(newRecRef.id),
      num_recs : increment
    })
    .then(() => console.log(`new rec added to ${rec.rec_pod}`))
}

// makes list of recs for a specific pod from the current state of the database and
// calls callback function to run asyncronously
export async function getRecs(podId, recsRecieved) {
  let recList = []; // init recList with all recs in the pod
  let snapshot = await firebase.firestore() // return a query snapshot of current db
    .collection("recs")
    .where('pod_id', '==', podId)
    .get()

    // push each rec in db to recList
    snapshot.forEach((doc) => {
      recList.push(doc.data());
    });
  // (if time): recs are sorted by new to old, or by notSeen to seen

  recsRecieved(recList); // callback function that occurs asyncronously
}

// makes list of recs for media
export async function getMediaRecs(recsRecieved, media_type){
  let recsInMedia = []; //init list of user's recs of specific media type
  let pods = []; // init list of pods the user is a current member of
  const currentUserUid = firebase.auth().currentUser.uid; // grab current user's uid

  await firebase.firestore().collection("users")
    .doc(currentUserUid)
    .get()
    .then((doc) => {
      pods = Object.keys(doc.data().pods) // save the pods keys to pods list
    })
    .catch((e) => console.log("error in adding getting pods for current user: " + e));

    if (pods.length > 0) {
      await firebase.firestore()
      .collection("recs")
      .where('rec_type', '==', media_type) //only have recs of specific media type
      .where('pod_id','in',pods) //only have recs that are part of current user's pods
      .get()
      .then((obj) => {
        obj.forEach((doc) => {
            recsInMedia.push(doc.data());
        });
      })
      .catch((e) => console.log("error in recsInMedia: " + e));

      recsRecieved(recsInMedia);
    }
}

// makes dictionary of num recs and senders for all media types
export async function getNumRecsAndPeople(mediaDict){
  var dictionaryForMedia= {}; //dictionary with media types for keys and values of number of recs & people
  var dictNumRecs = {}; //dictionary with media types for keys and values as number of recs
  var dictNumPeople = {}; //dictionary with media types for keys and values as arrays of senders
  let pods = []; // init list of pods the user is a current member of
  const currentUserUid = firebase.auth().currentUser.uid; // grab current user's uid
  var recTypes = ['Article','Book','Movie','Song','TikTok','YouTube']; //all media types
  for(rectype in recTypes){
    dictionaryForMedia[recTypes[rectype]]=[0,0]; //init number of recs and people as 0
  }
  await firebase.firestore().collection("users")
    .doc(currentUserUid)
    .get()
    .then((doc) => {
      pods = Object.keys(doc.data().pods) // save the pods keys to pods list
    })
    .catch((e) => console.log("error in adding getting pods for current user: " + e));

    if (pods.length > 0) {
      await firebase.firestore()
      .collection("recs")
      .where('pod_id','in',pods) //only have recs that are part of current user's pods
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var data = doc.data(); //get data for document
            var type = data.rec_type; //get media type for document
            dictNumRecs[type] = (dictNumRecs[type] || 0) + 1; //update number of recs for media type
            //if there are no people for that media type
            if(!(type in dictNumPeople)){
              dictNumPeople[type] = [];
            }
            //if there exists the key 'type' and the sender is not in the array
            if((type in dictNumPeople) && !(dictNumPeople[type].includes(data.rec_sender))){
             dictNumPeople[type].push(data.rec_sender);
            }
            dictionaryForMedia[type] = [dictNumRecs[type],dictNumPeople[type].length];
        });
    })
      .catch((e) => console.log("error in dictionaryForMedia: " + e));

      mediaDict(dictionaryForMedia);
    }
}

// update rec's seenBy property by updating the userId's value to either true (seen) or false (not seen)
// or adding the userId to the seenBy property if it was the first time this rec was clicked on
export async function updateRecSeenBy(userId, recId) {
  await firebase.firestore().collection("recs")
    .doc(recId)
    .get()
    .then( 
      function(doc) {
        let seenByList = doc.data().seenBy;
        // check if user id was already set in the seenBy property
        if (userId in seenByList) { 
          let wasSeen = seenByList[userId];
          // user has either seen or notSeen (but userId was set) the rec, just use the opposite of
          // what the boolean value was before
          return doc.ref.update({ [`seenBy.${userId}`]: !wasSeen });
        }
        // if user had never clicked seen rec at all, set bool as true
        return doc.ref.update({ [`seenBy.${userId}`]: true });
      }
    )
    .then(() => console.log(userId, "clicked a rec: ", recId))
}

// delete existing rec object from the db
export async function deleteRecFromDB(recId, podId) {
  const db = firebase.firestore();

  // get rec from db and delete it
  await db.collection('recs').where('id', '==', recId)
  .get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      doc.ref.delete();
    });
  });

  // delete this rec id data from the pod it is in
  const podsDb = db.collection("pods");
  await podsDb.doc(podId).update({
    // remove rec from pod's list of rec ids
    "recIds" : firebase.firestore.FieldValue.arrayRemove(recId)
  })

  // decrement number of recs in pod data
  const decrement = firebase.firestore.FieldValue.increment(-1);
  await db.collection("pods").where('pod_id', '==', podId)
  .get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      doc.ref.update({
        num_recs: decrement
      })
      .catch((error) => console.log(error));
    });
  });
}