import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Image, Pressable, Text, SafeAreaView, TextInput, Dimensions, FlatList, RefreshControl, Alert } from 'react-native';
import PodTile from '../components/PodTile';
import addPodButton from '../assets/addPodButton.png';
import closePopUpButton from '../assets/closePopUpButton.png';
import uploadPodImage from '../assets/uploadPodImage.png';
import Modal from 'react-native-modal';
import { SearchBar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import { addPodToDB, getPods, uploadImageToStorage,
    retrieveImageFromStorage, deleteImage, getUsers, deletePodFromDB } from '../API/firebaseMethods';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const defaultImageUrl = "https://www.jaipuriaschoolpatna.in/wp-content/uploads/2016/11/blank-img.jpg";

const ByPod = (props) => {

    const currentUserUID = props.userId;
    const username = props.username;

    // call firebase api function getPods on onPodsReceived function to render pods from db
    useEffect(() => {
        getPods(onPodsReceived);
    }, []);

    // display pop up when modal view is on
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        resetFields();
    };

    // add new pod dynamically when 'Create a Pod' submitted
    const [pods, setPods] = useState([]);
    const [groupName, setGroupName] = useState("");
    const addNewPod = async (pods) => {
        let podLength = 0;
        if (pods && pods.length > 0) {
            podLength = pods.length;
        }
        // create dictionary of key value pairs, (memberName: true)
        let membersDictionary = members.reduce((m, member) => ({...m, [member]: true}), {})
        // add new pod to current pods list
        let newPod = { key: podLength + 1, pod_name: groupName.trim(), num_members: members.length,
            pod_picture: selectedImageName, pod_picture_url: selectedImageUrl, num_recs: 0, members: membersDictionary };
        setPods([...pods, newPod]);
        // add pod object to database using firebase api function
        addPodToDB(newPod);
        // close modal
        toggleModal();
        // reset input fields to blank
        resetFields();

    };
    // once pods are received, set pods to these received pods
    const onPodsReceived = (podList) => {
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
    // init error state for various form fields
    const [errors, setErrors] = useState({
        nameError: '', membersError: ''
    });
    // check on create pod submit that all fields are filled in & filled in correctly
    const checkAllFieldsOnSubmit = () => {
        let validSymbols = /^[\w\-\s]+$/;
        let allValid = true;
        let isValid = validSymbols.test(groupName);
        // check if group name empty or only has whitespace
        if (groupName === "" || !groupName.replace(/\s/g, '').length) {
            setErrors({nameError: "*Group name is required"});
            allValid = false;
        // check if group name is not valid (not just alphanumeric)
        } else if (!isValid) {
            setErrors({nameError: "*Group name must be alphabetic"});
            allValid = false;
        }
        // check if members includes user + other members
        if (members.length == 1) {
            setErrors({membersError: "*Please add at least one user"});
            allValid = false;
        }
        // if everything checks out, add to pods list
        if (allValid) {
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

    // on-click item in flat list, add new member to pod, if user re-clicks that same username,
    // user will be removed from pod list
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

    // function from expo docs tutorial
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

        let uploadUri = Platform.OS === 'ios' ? result.uri.replace('file://', '') : result.uri;
        // get extension of image and set filename as username and current timestamp
        const extension = uploadUri.split('.').pop();
        const imageName = currentUserUID + "_" + Date.now() + '.' + extension;

        // check if image was changed (the second and following times), delete the old image on db
        deleteImage(selectedImageName);

        // setstate sets things asyncronously (after re-render),
        // so use imageName instead of selectedImageName to use as variable
        setSelectedImageName(imageName);

        // upload image to firebase storage
        await uploadImageToStorage(uploadUri, imageName)
            .then(() => {
                // after uploading image to server, get image url from firebase
                retrieveImageFromStorage(imageName, setSelectedImageUrl);
            })
            .catch((error) => {
                console.log("Something went wrong with image upload! " + error.message + error.code);
        });
    }

    // refresh page function to see new pods
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
            setRefreshing(true);
            await getPods(onPodsReceived) // use await to refresh until function finished
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
                    pods.map(pod =>
                        <PodTile key={pod.key}
                            groupName={pod.pod_name}
                            numMembers={pod.num_members}
                            members={pod.members}
                            uri={pod.pod_picture_url}
                            userId={currentUserUID}
                            username={username} />) :
                    <View style={styles.centeredView}>
                        <Text style={styles.noPodsYetText}>Welcome, {username}!</Text>
                        <Text style={styles.noPodsYetTitle}>Click the + button to start a pod</Text>
                        <Text style={styles.noPodsYetText}>Pods can be with one person or a group</Text>
                    </View>
                }
            </ScrollView>

            {/* Create A Pod PopUp */}
            <Modal isVisible={isModalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Pressable style={[styles.button, styles.buttonClose]}
                            onPress={toggleModal} >
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

                        <View style={{ display: 'flex'}}>
                            <Text style={styles.errorMessage}>{errors.nameError}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: -5 }}>
                            <Text style={styles.userDetailsText}>
                                Pod Image:
                            </Text>
                            <View style={{flex: 1, alignItems: 'center', marginTop: 5}}>
                                {/* if image selected, show image; also allow user to re-choose an image */}
                                <View style={{ flexDirection: 'row'}}>
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

                        {/* display members added to pod so far */}
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
                                 borderBottomColor: '#6f1d1b', width: windowWidth/1.5 }}
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

                        <View>
                            <Pressable style={styles.createPodButton} onPress={checkAllFieldsOnSubmit}>
                                <Text style={styles.createPodText}>Create Pod</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add Pod Button */}
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
    noPodsYetTitle: {
        marginTop: windowHeight/4,
        color: "#6F1D1B",
        fontWeight: "700",
        fontSize: 22,
    },
    noPodsYetText: {
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
        marginTop: 55,
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
        marginTop: 17,
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
    }
})

export default ByPod;
