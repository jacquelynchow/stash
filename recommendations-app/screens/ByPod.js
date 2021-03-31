import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Image, 
    Pressable, Text, SafeAreaView, TextInput, 
    Dimensions, FlatList } from 'react-native';
import PodTile from '../components/PodTile';
import addPodButton from '../assets/addPodButton.png';
import closePopUpButton from '../assets/closePopUpButton.png';
import uploadPodImage from '../assets/uploadPodImage.png';
import Modal from 'react-native-modal';
import { SearchBar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ByPod = (props) => {
    // TODO: If No Pods, show message screen, else show pods
    // TODO: For loop and showing Pod Tiles with real data

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        resetFields();
    };

    const [groupName, setGroupName] = useState("");

    // add new pod dynamically when 'Create a Pod' submitted
    const [pods, setPods] = useState([]);
    const addNewPod = () => {
        // add new pod to existing list
        let newPod = { key: pods.length + 1, name: groupName.trim(), size: members.length, uri: selectedImage }

        setPods([...pods, newPod]);
        toggleModal();

        // reset input fields to blank
        resetFields();
    };
    const resetFields = () => {
        setGroupName("");
        setMembers(["MainUser"]);
        setSelectedImage("https://www.jaipuriaschoolpatna.in/wp-content/uploads/2016/11/blank-img.jpg");
        setSearch('');
        setFilteredDataSource(masterDataSource);
        setErrors({nameError: '', membersError: ''});
    }
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
            setErrors({nameError: "Group name is required"});
            allValid = false;
        // check if group name is not valid (not just alphanumeric)
        } else if (!isValid) {
            setErrors({nameError: "Group name must be alphabetic"});
            allValid = false;
        }
        // check if members includes user + other members
        if (members.length == 1) {
            setErrors({membersError: "Please add at least one user"});
            allValid = false;
        }
        // check if there was a selected image or not
        if (selectedImage === null) {
            // no image was selected, use default image
            setSelectedImage("https://www.jaipuriaschoolpatna.in/wp-content/uploads/2016/11/blank-img.jpg");
        }
        // if everything checks out, add to pods list
        if (allValid) {
            addNewPod();
        }

        setSelectedImage(null);
    };
    
    // for 'Create a Pod' pop-up search bar
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);

    // init empty list of pod tiles
    const [members, setMembers] = useState(["MainUser"]);

    useEffect(() => {
        // placeholder data for users
        fetch('https://jsonplaceholder.typicode.com/users')
          .then((response) => response.json())
          .then((responseJson) => {
            setFilteredDataSource(responseJson);
            setMasterDataSource(responseJson);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);
    
      const searchFilterFunction = (text) => {
        if (text) {
          // filter the data according to what user searched
          // update usernames shown
          const newData = masterDataSource.filter(function (item) {
            const itemData = item.username
              ? item.username.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          // when search bar clear, show all usernames
          setFilteredDataSource(masterDataSource);
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

    // on-click item in flat list, add new member to pod 
    const getItem = (item) => {
        let newMember = { key: item.id, name: item.username}
        setMembers([...members, newMember.name]);
    };

    // init var for selected pod image
    const [selectedImage, setSelectedImage] = useState("https://www.jaipuriaschoolpatna.in/wp-content/uploads/2016/11/blank-img.jpg");
    // function from expo docs tutorial
    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert("Permission to access camera roll is required!");
          return;
        }
    
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
            
        if (pickerResult.cancelled === true) {
          return;
        }
        setSelectedImage(pickerResult.uri);
      }

    return (
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.container}>
                {pods && pods.length > 0 ?
                    // make a pod for each group name stored in the pods list 
                    pods.map(name => <PodTile groupName={name.name} numMembers={name.size} uri={name.uri} key={name.name} />) :
                    <View style={styles.centeredView}>
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

                        <View style={{ flexDirection: 'row'}}>
                            <Text style={styles.userDetailsText}>
                                Pod Name:
                            </Text>
                            <SafeAreaView>
                                <TextInput 
                                onChangeText={groupName => setGroupName(groupName)}
                                style={styles.userInput}
                                defaultValue={groupName} 
                                placeholder={"Enter a group name"}
                                value={groupName}
                                />
                            </SafeAreaView>
                        </View>
                        <View style={{ display: 'flex', justifyContent: 'flex-start'}}>
                            <Text style={styles.errorMessage}>{errors.nameError}</Text>
                        </View>

                        <View style={{ flexDirection: 'row'}}>
                            <Text style={styles.userDetailsText}>
                                Pod Image: 
                            </Text>
                            <View style={{flex: 1, alignItems: 'center', marginTop: 5}}>
                                {/* if image selected, show image; also allow user to re-choose an image */}
                                {selectedImage && selectedImage != null ? 
                                    <View style={{ flexDirection: 'row'}}> 
                                        <Image
                                            source={{ uri: selectedImage }}
                                            style={styles.thumbnail}
                                        />
                                        <TouchableOpacity onPress={openImagePickerAsync} activeOpacity={0.7}>
                                            <Image style={{ width: 30, height: 30}}
                                                source={uploadPodImage}></Image>
                                        </TouchableOpacity> 
                                    </View> :
                                    <TouchableOpacity onPress={openImagePickerAsync} activeOpacity={0.7}>
                                        <Image style={{ width: 30, height: 30}}
                                            source={uploadPodImage}></Image>
                                    </TouchableOpacity> 
                                }
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row'}}>
                            <Text style={styles.userDetailsText}>
                                Users in this Pod:
                            </Text>
                        </View>

                        {/* display members added to pod so far */}
                        <View style={{ height: windowHeight/7 }}> 
                        <ScrollView contentContainerStyle={styles.membersList}>
                            {/* check if any members added yet: if not, display message */}
                            {members.length === 0 ? 
                            (<View style={{ flexDirection: 'row'}}>
                                <Text style={styles.membersText}>No members yet! {"\n"}Search below to add members to this pod.</Text>
                            </View>) : 
                            // members have been added, display each one in a row
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
                            <Text style={styles.userDetailsText}>
                                Search for Members to Add:
                            </Text>
                        </View>

                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={styles.searchBarContainer}>
                                <SearchBar
                                searchIcon={{ size: 24 }}
                                onChangeText={(text) => searchFilterFunction(text)}
                                onClear={(text) => searchFilterFunction('')}
                                placeholder="Enter a username"
                                value={search}
                                containerStyle={{ backgroundColor: '#6f1d1b', marginTop: 5, marginBottom: 5, borderTopColor: '#6f1d1b',
                                borderBottomColor: '#6f1d1b', width: windowWidth/2 }}
                                inputContainerStyle={{ backgroundColor: 'white', height: 30, borderRadius: 10 }}
                                inputStyle={{ fontSize: 16 }}
                                />
                                {/* flat list displays username data */}
                                <FlatList
                                data={filteredDataSource}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={ItemView}
                                />
                            </View>
                        </SafeAreaView>

                        <Pressable style={styles.createPodButton} onPress={checkAllFieldsOnSubmit}>
                            <Text style={styles.createPodText}>Create Pod</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Add Pod Button */}
            <View style={{marginRight: 17}}>
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
    },
    createPodButton: {
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
    userDetailsText: {
        fontSize: 18,
        color: 'white',
        marginTop: 17,
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    userInput: {
        height: 30,
        width: windowWidth/3,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        paddingHorizontal: 10,
        marginLeft: 10,
        marginTop: 15,
    },
    itemStyle: {
        padding: 10,
        color: 'white'
    },
    searchBarContainer: {
        marginTop: 10,
        color: 'white',
    },
    membersList: {
        marginVertical: 5,
        marginHorizontal: 5,
        // paddingBottom: 30,
        // flexGrow:1,
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
    }
})

export default ByPod;
