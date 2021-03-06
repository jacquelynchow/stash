import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Image, Pressable, Text,
    SafeAreaView, TextInput, Dimensions, FlatList,
    RefreshControl, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { useIsFocused } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import KeyboardSpacer from 'react-native-keyboard-spacer';
// Components
import PodTile from '../components/PodTile';
import addPodButton from '../assets/addPodButton.png';
import closePopUpButton from '../assets/closePopUpButton.png';
import uploadPodImage from '../assets/uploadPodImage.png';
// Server related
import { addPodToDB, getPods, uploadImageToStorage,
    retrieveImageFromStorage, deleteImage, getUsers,
    deletePodFromDB, removeMemberFromPod } from '../API/firebaseMethods';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const defaultImageUrl = "https://www.jaipuriaschoolpatna.in/wp-content/uploads/2016/11/blank-img.jpg";

// First view of homescreen displaying all pods under "Your Pods"
const ByPod = (props) => {
    const currentUserUID = props.userId;
    const username = props.username;

    // check if screen is focused 
    const isFocused = useIsFocused(); // mostly for when recs change (get added) and we are returning from podpage to bypod page
    // listen for isFocused, if useFocused changes 
    // call the function that you use to mount the component in useEffect.

    // call firebase api function getPods on onPodsReceived function to render pods from db
    useEffect(() => {
        let gettingPods = true;
        getPods(onPodsReceived, currentUserUID);

        return () => {
            gettingPods = false;
        };
    }, [isFocused]);

    // display pop up when add pod modal view is on
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        resetFields();
    };

    // add new pod dynamically when 'Create a Pod' submitted
    const [pods, setPods] = useState([]);
    const [groupName, setGroupName] = useState("");
    const addNewPod = async (pods) => {
        // create dictionary of key value pairs, (memberName: true)
        let membersDictionary = members.reduce((m, member) => ({...m, [member]: true}), {})
        // add new pod to current pods list
        let newPod = { pod_name: groupName.trim(), num_members: members.length,
            pod_picture: selectedImageName, pod_picture_url: selectedImageUrl, num_recs: 0, members: membersDictionary };
        // add pod object to database using firebase api function, once done, refresh pods to get new pod
        await addPodToDB(newPod)
            .then(() => {getPods(onPodsReceived, currentUserUID);  setLoading(false);});
        // close modal
        toggleModal();
        // reset input fields to blank
        resetFields();
    };
    // once pods are received, set pods to these received pods
    const onPodsReceived = (podList) => {
        // set list of pods and their data
        setPods(podList);
    };

    // resets all form fields on Create a Pod modal
    const resetFields = () => {
        setGroupName("");
        setMembers([username]);
        setSelectedImageName("");
        setSelectedImageUrl(defaultImageUrl);
        setSearch('');
        setFilteredDataSource([]);
        setErrors({nameError: '', membersError: ''});
    }

    // init error state for various add pod form fields
    const [errors, setErrors] = useState({
        nameError: '', membersError: ''
    });

    // check on create pod submit that all fields are filled in & filled in correctly
    const checkAllFieldsOnSubmit = () => {
        let allValid = true;
        // check if group name empty or only has whitespace
        if (groupName === "" || !groupName.replace(/\s/g, '').length) {
            setErrors({nameError: "*Pod name is required"});
            allValid = false;
        }  else if (groupName.length > 20) {
            setErrors({nameError: "*Maximum 20 characters"});
            allValid = false;
        }
        // check if members includes user + other members
        if (members.length == 1) {
            setErrors({membersError: "*Please add at least one user"});
            allValid = false;
        }
        // if everything checks out, add to pods list
        if (allValid) {
            setLoading(true);
            addNewPod(pods);
        }
    };

    // for 'Create a Pod' pop-up search bar
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);

    // init empty list of pod tiles
    const [members, setMembers] = useState([username]);

    const searchFilterFunction = async (text) => {
        if (text) {
            // grab users from the database that match the searched text or is close to it
            const users = await getUsers(text.toLowerCase(), username);
            if (users) {
                setFilteredDataSource(users);
            } else {
                setFilteredDataSource([]);
            }
            setSearch(text);
        } else {
            // when search bar clear, show all usernames
            setFilteredDataSource([]);
            setSearch(text);
        }
    };

    // lines between items in flat list
    const ItemSeparatorView = () => {
        return (
          <View
            style={{
              height: 0.5,
              width: '100%',
              backgroundColor: '#C8C8C8',
            }}
          />
        );
    };

    // each text component for usernames in flat list
    const ItemView = ({ item }) => {
        return (
          <Text style={styles.itemStyle} onPress={() => getItem(item)}>
            {item.username}
          </Text>
        );
    };

    // on-click item in flat list, add new member to pod, if user re-clicks that
    // same username, user will be removed from pod list
    const getItem = (item) => {
        if (members.indexOf(item.username) == -1) {
            let newMember = { key: item.id, name: item.username}
            setMembers([...members, newMember.name]);
        } else {
            const removedDeletedMember = members.filter((member) => {
                return member != item.username
            })
            setMembers(removedDeletedMember);
        }
    };

    // init var for selected pod image
    const [selectedImageName, setSelectedImageName] = useState("");
    const [selectedImageUrl, setSelectedImageUrl] = useState(defaultImageUrl);
    // init loading bool when activity indicator is needed
    const [isLoading, setLoading] = useState(false);

    // allow user to choose image from photo library, uploads image to server, saves image URL; while image is
    // being sent to server and url is being saved, a loading indicator pops up blocking all user interaction
    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          alert("Permission to access camera roll is required!");
          return;
        }

        let result = await ImagePicker.launchImageLibraryAsync();
        if (result.cancelled === true) {
          return;
        }
        // set filename as username and current timestamp and resize image for more space in storage
        const imageName = currentUserUID + "_" + Date.now() + '.' + 'png';
        const resizedPhoto = await ImageManipulator.manipulateAsync(
            result.uri, [{ resize: { width: 200 } }], // resize to width of 200 and preserve aspect ratio
            { compress: 0.7, format: 'png' }, // use png type of images
        );

        // check if image was changed (the second and following times), delete the old image on db
        deleteImage(selectedImageName);

        // setstate sets things asyncronously (after re-render),
        // so use imageName instead of selectedImageName to use as variable
        setSelectedImageName(imageName);
        // show activity indicator by setting true (makes user wait until image has been uploaded to server & image url is saved)
        setLoading(true);

        // upload image to firebase storage
        await uploadImageToStorage(resizedPhoto.uri, imageName)
            .then(async () => {
                // after uploading image to server, wait to get image url from firebase
                await retrieveImageFromStorage(imageName, setSelectedImageUrl)
                    // once image has been uploaded to server and image url is saved, we can stop showing the activity indicator
                    .then(() => setLoading(false))
                    .catch(() => setLoading(false));
            })
            .catch((error) => {
                setLoading(false);
                console.log("Something went wrong with image upload! " + error.message + error.code);
        });
    }

    // refresh page function to see new pods
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
            setRefreshing(true);
            await getPods(onPodsReceived, currentUserUID) // use await to refresh until function finished
                .then(() => setRefreshing(false));
        }, []);

    return (
        <View style={{flex: 1}}>

            {/* pull screen down for pods refresh */}
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }>

                {/* make a pod for each group name stored in the pods list */}
                {pods && pods.length > 0 ?
                    pods.map((pod, index) =>
                        <PodTile key={index}
                            podId={pod.pod_id}
                            groupName={pod.pod_name}
                            numRecs={pod.num_recs}
                            numMembers={pod.num_members}
                            members={pod.members}
                            uri={pod.pod_picture_url}
                            userId={currentUserUID}
                            username={username}
                            deletePod={deletePodFromDB}
                            leavePod={removeMemberFromPod}
                            refresh={onRefresh}
                            image={pod.pod_picture}
                            />) :
                    <View style={styles.centeredView}>
                        <Text style={styles.noPodsYetWelcome}>Welcome,  <Text style={{fontStyle:'italic', fontWeight: '700'}} >{username}</Text>!</Text>
                        <Text style={styles.noPodsYetTitle}>Click the + button to start a pod</Text>
                        <Text style={styles.noPodsYetText}>Pods can be with one person or a group</Text>
                    </View>
                }
            </ScrollView>

            {/* Create A Pod PopUp */}
            <Modal isVisible={isModalVisible}>
                {/* Show loading screen (blocking all user interaction) if image is being sent to server & its image URL being fetched */}
                {isLoading ?
                <View style={styles.loading}>
                    <ActivityIndicator size="large"/>
                </View> :
                // if image not being sent right now, show the 'create a pod' modal
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Pressable style={[styles.button, styles.buttonClose]}
                            // close modal popup and delete image if one was selected
                            onPress={() => { toggleModal(); deleteImage(selectedImageName); }} >
                            <Image source={closePopUpButton} style={{width: 30, height: 30}}/>
                        </Pressable>
                        <Text style={styles.modalTitle}>Create a Pod</Text>
                        <Text style={styles.modalText}>Add your friends by username!</Text>

                        <View style={{ flexDirection: 'row', marginBottom: -10}}>
                            <Text style={styles.userDetailsText}>
                                Pod Name:
                            </Text>
                            <SafeAreaView>
                                <TextInput
                                onChangeText={groupName => setGroupName(groupName)}
                                style={styles.userInput}
                                defaultValue={groupName}
                                placeholder={"Enter a pod name"}
                                value={groupName}
                                />
                            </SafeAreaView>
                        </View>
                        {/* Show error if a pod name was not entered or contains non-alphanumeric symbols */}
                        <View style={{ display: 'flex', marginTop: 10}}>
                            <Text style={styles.errorMessage}>{errors.nameError}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: -5 }}>
                            <Text style={styles.userDetailsText}>
                                Pod Image:
                            </Text>
                            <View style={{flex: 1, alignItems: 'center', marginTop: 5}}>
                                {/* if image selected, show image; also allow user to re-choose an image */}
                                <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                     <Image
                                         source={{ uri: selectedImageUrl }}
                                         style={styles.thumbnail}
                                     />
                                    <TouchableOpacity onPress={openImagePickerAsync} activeOpacity={0.7}>
                                        <Image style={{ width: 30, height: 30}}
                                            source={uploadPodImage}></Image>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: -5}}>
                            <Text style={styles.userDetailsText}>
                                Users in this Pod:
                            </Text>
                        </View>

                        {/* Display members added to pod so far */}
                        <View style={{ height: windowHeight/7 }}>
                            <ScrollView contentContainerStyle={styles.membersList}>
                                {/* check if any members added yet: if not, display message;
                                if members have been added, display each one in a row */}
                                {members.length === 0 ?
                                    (<View style={{ flexDirection: 'row'}}>
                                        <Text style={styles.membersText}>No members yet! {"\n"}Search below to add members to this pod.</Text>
                                    </View>) :
                                    (members.map(name =>
                                    <View key={name} style={{ flexDirection: 'row'}}>
                                        <Text style={styles.membersText}>{name}</Text>
                                    </View>)
                                )}
                            </ScrollView>
                            <Text style={styles.errorMessage}>{errors.membersError}</Text>
                        </View>

                        {/* search bar, click on usernames to add members to pod */}
                        <View style={{ flexDirection: 'row'}}>
                            <Text style={styles.userDetailsTextBottom}>
                                Search for Members to Add:
                            </Text>
                        </View>

                        <SafeAreaView style={{ flex: 1 }}>
                            <View>
                                <SearchBar
                                searchIcon={{ size: 24 }}
                                onChangeText={(text) => setSearch(text)}
                                onSubmitEditing={() => searchFilterFunction(search)}
                                onClear={() => searchFilterFunction('')}
                                placeholder="Enter a username"
                                value={search}
                                containerStyle={{ backgroundColor: '#6f1d1b', borderTopColor: '#6f1d1b',
                                 borderBottomColor: '#6f1d1b', width: "100%" }}
                                inputContainerStyle={{ backgroundColor: 'white', height: 30, borderRadius: 10 }}
                                inputStyle={{ fontSize: 16 }}
                                />
                                {/* flat list displays username data */}
                                { filteredDataSource ?
                                    <FlatList
                                    data={filteredDataSource}
                                    keyExtractor={(item, index) => index.toString()}
                                    ItemSeparatorComponent={ItemSeparatorView}
                                    renderItem={ItemView}
                                    /> :
                                    <View style={{ flexDirection: 'row'}}>
                                        <Text style={styles.membersText}>No users with that username...Try a different name!</Text>
                                    </View>
                                }
                            </View>
                        </SafeAreaView>

                        {/* Add A Pod Button for pop up */}
                        <View>
                            <TouchableOpacity style={styles.createPodButton} onPress={checkAllFieldsOnSubmit}>
                                <Text style={styles.createPodText}>Create Pod</Text>
                            </TouchableOpacity>
                        </View>
                    <KeyboardSpacer />
                    </View>
                </View>
                }
            </Modal>

            {/* Add Pod Button on Screen */}
            <View style={styles.bottomButtonView}>
                <Image source={addPodButton} style={styles.floatingAddButton}></Image>
            </View>
            <TouchableOpacity activeOpacity={0.25}
                onPress={toggleModal}
                style={styles.floatingAddButton}>
            </TouchableOpacity>
        </View>
    )
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
    floatingAddButton: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 25,
        height: 60,
        width: 60,
    },
    container: {
        marginVertical: 20,
        marginHorizontal: 10,
        paddingBottom: 30,
        flexGrow:1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start' // fill rows left to right
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    noPodsYetWelcome: {
        color: "#6F1D1B",
        marginTop: -10,
        fontSize: 23
    },
    noPodsYetTitle: {
        marginTop: windowHeight/4,
        color: "#6F1D1B",
        fontWeight: "700",
        fontSize: 22,
    },
    noPodsYetText: {
        color: "#6F1D1B",
        fontStyle: 'italic',
        marginTop: 0,
        fontSize: 14
    },
    modalView: {
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
    button: {
        padding: 10
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
        fontSize: 30,
        marginTop: 10,
        color: "white",
    },
    modalText: {
        marginTop: 10,
        textAlign: "center",
        fontSize: 13,
        color: "white"
    },
    createPodText: {
        color: "#D68C45",
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 18,
        textAlign: 'center'
    },
    createPodButton: {
        backgroundColor: "white",
        borderRadius: 20,
        marginTop: 40,
        paddingVertical: 10,
        paddingHorizontal: 20,
        // ios
        shadowOffset: {width: 10, height: 10},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // android
        elevation: 2,
    },
    userDetailsText: {
        fontSize: 16,
        color: 'white',
        marginTop: 13,
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    userDetailsTextBottom: {
        fontSize: 16,
        color: 'white',
        marginTop: 0,
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    userInput: {
        height: 30,
        width: windowWidth/2.5,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        paddingHorizontal: 10,
        marginLeft: 0,
        marginTop: 15,
    },
    itemStyle: {
        padding: 10,
        color: 'white'
    },
    membersList: {
        marginTop: 0,
        marginHorizontal: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        color: '#ffc9b9',
    },
    membersText: {
        fontSize: 16,
        color: '#ffc9b9',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 7
    },
    podImageContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
		padding: 20,
		textAlign: 'center',
	},
    thumbnail: {
        width: 50,
        height: 50,
        resizeMode: "cover",
        marginRight: 15,
    },
    errorMessage: {
        color: '#ffc9b9',
        marginVertical: 5
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width:'100%',
        height:'100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ByPod;
