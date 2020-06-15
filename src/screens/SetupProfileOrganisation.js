import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, TouchableOpacity, Image, Dimensions } from 'react-native'
import firebase from 'firebase'
import { AsyncStorage } from "react-native"
import { db } from '../config'
import { Keyboard } from 'react-native'

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import 'firebase/storage';
import uuid from 'react-native-uuid';
import DropDownPicker from 'react-native-dropdown-picker';
import ProfileImagePicker from "../components/ProfileImagePicker"

export default class SetupProfileOrganisation extends React.Component {
    state = { bio: '', phoneNumber: '', imageUri: '', category: null }

    // Edits the entry for the user in Firebase Database (instead of in Firebase Authentication)
    setUpProfile = (bio, phoneNumber, category) => {
        console.log('setting up user profile')
        console.log(firebase.auth().currentUser.uid)
        console.log(bio)
        console.log(phoneNumber)

        // Updates the bio, phone number, and category (only for organisations)
        db.ref('users/' + firebase.auth().currentUser.uid).update({
            bio: bio,
            phoneNumber: phoneNumber,
            category: category
        })

        this.uriToBlob(this.state.imageUri).then((blob) => {
            return this.uploadToFirebase(blob);
        });

        AsyncStorage.setItem('profileSetUp', JSON.stringify('set up'))
        AsyncStorage.setItem('userStatus', JSON.stringify('logged in'))
        this.props.navigation.navigate('Home')
    }

    // Sets this.state.imageUri to the uri that is passed
    setProfilePicture = (uri) => {
        this.setState({ imageUri: uri.uri })
    }

    // Converts the URI to a blob that can be stored in Firebase Storage
    uriToBlob = (uri) => {
        return new Promise(function (resolve, reject) {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", uri);
                xhr.responseType = "blob";
                xhr.onerror = function () { reject("Network error.") };
                xhr.onload = function () {
                    if (xhr.status === 200) { resolve(xhr.response) }
                    else { reject("Loading error:" + xhr.statusText) }
                };
                console.log('\nThe URI has been converted to a blob')
                xhr.send();
            }
            catch (err) { reject(err.message) }
        })
    }

    // Uploads the offer to Firebase along with the blob
    uploadToFirebase = (blob) => {
        console.log('Uploading the offer to firebase...')
        return new Promise((resolve, reject) => {
            var storageRef = firebase.storage().ref();

            // Generates a random and unique ID for the image
            const imageUuid = uuid.v1();
            console.log('uuid: ' + imageUuid)

            // Updates the profile picture in the database
            db.ref('users/' + firebase.auth().currentUser.uid).update({
                pfp: imageUuid
            })

            AsyncStorage.setItem('profileLoaded', 'not loaded')

            // Stores the blob as an image in Firebase Storage under the previously generated UUID
            var imageRef = storageRef.child('profile/' + imageUuid + '.jpg')
                .put(blob, {
                    contentType: 'image/jpeg'
                }).then((snapshot) => {
                    AsyncStorage.setItem('profileLoaded', 'loaded')
                    blob.close();
                    resolve(snapshot);
                }).catch((error) => {
                    reject(error);
                });
            console.log('The image has been stored in Firebase Storage under profile/' + imageUuid)

        });
    }

    // Gets permission to access the camera roll
    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            console.log('getting permission');
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    componentDidMount = () => {
        this.getPermissionAsync()
    }

    // Renders the profile setup UI
    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <Text style={styles.setup}>Setup your profile</Text>
                    {this.state.errorMessage &&
                        <Text style={{ color: 'red' }}>
                            {this.state.errorMessage}
                        </Text>}

                    <View style={{ flexDirection: 'row', marginTop: 100, marginHorizontal: 35, marginBottom: 20 }}>
                        <ProfileImagePicker image={this.state.image} onImagePicked={this.setProfilePicture} />
                        <View style={{ flexDirection: 'column', position: 'absolute', left: 150, marginTop: 25 }}>
                            <Text style={styles.individual}>ORGANISATION</Text>
                            <Text style={styles.name}>{firebase.auth().currentUser.displayName}</Text>
                            <Text style={styles.email}>{firebase.auth().currentUser.email}</Text>
                        </View>
                    </View>

                    <View style={styles.bio}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Describe your organisation"
                            autoCapitalize="sentences"
                            autoCorrect={true}
                            onChangeText={bio => this.setState({ bio })}
                            value={this.state.bio}
                            multiline={true}
                            maxLength={150}
                            clearButtonMode='while-editing'
                        />
                    </View>

                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Phone number (optional)"
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={phoneNumber => this.setState({ phoneNumber })}
                            value={this.state.phoneNumber}
                            keyboardType={'phone-pad'}
                            textContentType='telephoneNumber'
                        />
                    </View>

                    <Text style={{ fontWeight: 'bold', marginLeft: 40, fontSize: 20, color: '#4b4c4c' }}>Category</Text>

                    <DropDownPicker
                    zIndex={5000}
                        items={[
                            { label: 'Care Home' },
                            { label: 'Disaster Relief' },
                            { label: 'Education' },
                            { label: 'Infrastructure' },
                            { label: 'Medical' },
                            { label: 'Religious Organisation' },
                            { label: 'Other' },
                        ]}
                        defaultNull={this.state.category === null}
                        placeholder="Select a category"
                        containerStyle={styles.dropdown}
                        style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
                        dropDownStyle={{ backgroundColor: 'white', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
                        placeholderStyle={{ color: "#c9c9c9" }}
                        labelStyle={{ color: "#2C2061" }}
                        onChangeItem={(item) => {
                            this.setState({
                                category: item.label
                            });
                        }}
                        dropDownMaxHeight={240}
                    />

                    <TouchableOpacity style={styles.signUpBtn} onPress={() => this.setUpProfile(this.state.bio, this.state.phoneNumber, this.state.category)}>
                        <Text style={styles.signUpText}>CONTINUE</Text>
                    </TouchableOpacity>

                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    setup: {
        fontWeight: "bold",
        fontSize: 30,
        color: "#2C2061",
        alignSelf: 'flex-start',
        marginLeft: 20,
        position: 'absolute',
        top: 40
    },
    inputView: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 25,
        marginBottom: 20,
        paddingLeft: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        alignSelf: 'center',
    },
    bio: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 25,
        height: 150,
        margin: 20,
        padding: 20,
        justifyContent: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        alignSelf: 'center',
    },
    inputText: {
        height: 50,
        color: "#2C2061"
    },
    signUpBtn: {
        width: "50%",
        backgroundColor: "#2C2061",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginTop: 50,
        alignSelf: 'center',
    },
    signUpText: {
        color: "#CFC8EF",
        fontWeight: 'bold',
        fontSize: 17
    },
    filterBtn:
    {
        borderRadius: 25,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        marginVertical: 20
    },
    pfp: {
        width: 120,
        height: 120,
        borderRadius: 60
    },
    individual: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#84DAC1'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#4b4c4c'
    },
    email: {
        marginTop: 10,
        fontSize: 16,
        color: '#a9a9a9'
    },
    dropdown: {
        height: 40,
        width: '80%',
        alignSelf: 'center',
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
    }
})