import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../config';
import firebase from 'firebase'
import 'firebase/storage';
import uuid from 'react-native-uuid';
import ResourceImagePicker from "../components/ResourceImagePicker"
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import { AsyncStorage } from "react-native"
import { NavigationEvents } from 'react-navigation';

let offersRef = db.ref('/offers');

// Adapted from https://medium.com/@joananespina/uploading-to-firebase-storage-with-react-native-39f4a500dbcb

class Add extends Component {
  constructor() {
    super()
    this.state = {
      // Sets the visibility of the date picker
      isVisible: false
    }
  }
  state = {
    name: '',
    author: firebase.auth().currentUser.uid,
    category: '',
    time: firebase.database.ServerValue.TIMESTAMP,
    description: '',
    location: '',
    expiry: '',
    imageUri: ''
  };

  // Shows the date picker
  showPicker = () => {
    this.setState({ isVisible: true })
  };

  // Hides the date picker and resets expiry (users have to press confirm to save their changes)
  hidePicker = () => {
    this.setState({
      isVisible: false,
      expiry: ''
    })
  }

  // Hides the date picker and sets the state of expiry to the date the user has picked
  handlePicker = (date) => {
    this.setState({
      isVisible: false,
      expiry: moment(date).format('MMMM Do YYYY')   // Formats the date into a readable form
    })
  }

  componentDidMount() {
    this.getPermissionAsync();
    this.refreshData()
  }

  // Sets all the inputs to blank
  refreshData = () => {
    this.setState({
      name: '',
      category: '',
      description: '',
      location: '',
      expiry: '',
      imageUri: '',
      image: ''
    })
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

  // Adds the offer to Firebase according to what the user has input  
  addOffer(name, category, description, location, expiry, id) {
    const key = offersRef.push({
      name, author: firebase.auth().currentUser.uid, category, time: firebase.database.ServerValue.TIMESTAMP, description, location, expiry, id
    }).key
    return key
  };

  // Sets this.state.imageUri to the uri that is passed
  setOfferImage = (uri) => {
    this.setState({ imageUri: uri.uri })
  }

  // Alerts the user if they have not filled out one of the fields
  // If all fields are filled, uploads the offer to Firebase along with the blob of the image
  handleSubmit = () => {
    console.log(firebase.auth().currentUser.displayName.toUpperCase() + ' HAS SUBMITTED AN OFFER')
    console.log('==========================================================================')
    console.log('name: ' + this.state.name)
    console.log('category: ' + this.state.category)
    console.log('description: ' + this.state.description)
    console.log('location: ' + this.state.location)
    console.log('image URI: ' + this.state.imageUri)
    console.log('expiry (optional): ' + this.state.expiry)

    // Checks if an image has been selected
    if (!(/\S/.test(this.state.imageUri))) {
      console.log('\nERROR: NO IMAGE')
      Alert.alert(
        "Please add an image for your offer"
      );
    }

    // Checks if the other inputs have been filled
    else if (!(/\S/.test(this.state.name)) || !(/\S/.test(this.state.category)) || !(/\S/.test(this.state.description)) || !(/\S/.test(this.state.location))) {
      console.log('\nERROR: FIELD BLANK')
      Alert.alert(
        "Please fill in all the fields before submitting"
      );
    }
    else {
      this.uriToBlob(this.state.imageUri).then((blob) => {
        return this.uploadToFirebase(blob);
      });
    }
  };

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

      AsyncStorage.setItem('imageLoaded', 'not loaded')

      // Stores the blob as an image in Firebase Storage under the previously generated UUID
      var imageRef = storageRef.child('offers/' + imageUuid + '.jpg')
        .put(blob, {
        contentType: 'image/jpeg'
      }).then((snapshot) => {
        AsyncStorage.setItem('imageLoaded', 'loaded')
        blob.close();
        resolve(snapshot);
      }).catch((error) => {
        reject(error);
      });
      console.log('The image has been stored in Firebase Storage under offers/' + imageUuid)

      // Adds the offer to Firebase and gets the key
      const key = this.addOffer(this.state.name, this.state.category, this.state.description, this.state.location, this.state.expiry, imageUuid);
      console.log('\nThe offer has successfully been added to Firebase!')
      Alert.alert(
        'Offer saved successfully',
        '',
        [
          {text: 'OK', onPress: () => this.props.navigation.navigate('Offer', {
            name: this.state.name,
            uid: firebase.auth().currentUser.uid,
            key: key,
            description: this.state.description,
            category: this.state.category,
            expiry: this.state.expiry,
            location: this.state.location,
            time: this.state.time,
            imageID: imageUuid,
            prevScreen: 'add'
          })},
        ],
        {cancelable: false},
      );
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView
        style={{ backgroundColor: 'white', padding: 30 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        scrollEnabled={true}
      >
        <NavigationEvents onDidFocus={() => this.refreshData()} />
        <Text style={styles.title}>Add Offer</Text>
        <ResourceImagePicker image={this.state.image} onImagePicked={this.setOfferImage} />
        <Text style={styles.heading}>Offer Title</Text>
        <View style={[styles.inputView]}>
          <TextInput
            style={styles.inputText}
            placeholder="Name your offer"
            autoCorrect={true}
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
          />
        </View>
        <Text style={styles.heading}>Select a Category</Text>
        <DropDownPicker
          zIndex={5000}
          items={[
            { label: 'Appliances' },
            { label: 'Babies and Kids' },
            { label: 'Books' },
            { label: 'Clothing' },
            { label: 'Electronics' },
            { label: 'Food' },
            { label: 'Furniture' },
            { label: 'Health' },
            { label: 'Stationery' },
            { label: 'Hobbies' },
            { label: 'Sports' },
            { label: 'Toys and Games' }
          ]}
          defaultNull={this.state.category === ''} // If this.state.category is null, show the placeholder
          placeholder="Select a category"
          containerStyle={styles.dropdown}
          style={{ backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, padding: 20 }}
          dropDownStyle={{ backgroundColor: 'white', borderBottomLeftRadius: 25, borderBottomRightRadius: 25 }}
          placeholderStyle={{ color: "#c9c9c9", position: 'absolute', left: 0 }}
          labelStyle={{ color: "#c9c9c9", position: 'relative', marginLeft: 10 }}
          activeLabelStyle={{ color: "#c9c9c9", position: 'relative', marginLeft: 10 }}
          onChangeItem={(item) => {
            this.setState({
              category: item.label
            });
          }}
          dropDownMaxHeight={240}
        />

        <Text style={styles.heading}>Select a Location</Text>
        <DropDownPicker
          zIndex={4000}
          items={[
            { label: 'Johor' },
            { label: 'Kedah' },
            { label: 'Kelantan' },
            { label: 'KL/Selangor' },
            { label: 'Melaka' },
            { label: 'Negeri Sembilan' },
            { label: 'Pahang' },
            { label: 'Penang' },
            { label: 'Perak' },
            { label: 'Perlis' },
            { label: 'Sabah' },
            { label: 'Sarawak' },
            { label: 'Terengganu' }
          ]}
          defaultNull={this.state.location === ''} // If this.state.location is null, show the placeholder
          placeholder="Select a state"
          containerStyle={styles.dropdown}
          style={{ backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 }}
          dropDownStyle={{ backgroundColor: 'white', borderBottomLeftRadius: 25, borderBottomRightRadius: 25 }}
          placeholderStyle={{ color: "#c9c9c9", position: 'absolute', left: 0 }}
          labelStyle={{ color: "#c9c9c9", position: 'relative', marginLeft: 10 }}
          activeLabelStyle={{ color: "#c9c9c9", position: 'relative', marginLeft: 10 }}
          onChangeItem={(item) => {
            this.setState({
              location: item.label
            });
          }}
          dropDownMaxHeight={240}
        />

        <Text style={styles.heading}>Offer Description</Text>
        <TextInput
          style={styles.description}
          placeholder="Describe your offer - what does it look like? What are its dimensions? How much is available? Can the recipient take a partial amount or does it have to be all?"
          onChangeText={description => this.setState({ description })}
          multiline={true}
          maxLength={300}
          clearButtonMode='while-editing'
          value={this.state.description}
        />
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.heading}>Offer Expiry Date (optional)</Text>
          <TouchableOpacity style={{ position: 'absolute', right: 0 }} onPress={this.showPicker}><Text style={{ color: "#CFC8EF" }}>Choose Date</Text></TouchableOpacity>
        </View>

        <Text style={{ marginLeft: 10, color: "#2C2061" }}>{this.state.expiry}</Text>

        <DateTimePickerModal
          isVisible={this.state.isVisible}
          mode={"date"}
          onConfirm={this.handlePicker}
          onCancel={this.hidePicker}
          datePickerModeAndroid={'spinner'}
        />
        <TouchableHighlight
          style={styles.button}
          underlayColor="black"
          onPress={this.handleSubmit}
        >
          <Text style={styles.buttonText}>ADD</Text>
        </TouchableHighlight>
        <View style={{ height: 50 }}></View>
      </KeyboardAwareScrollView>
    );
  }
}
export default Add;

const styles = StyleSheet.create({
  title: {
    marginHorizontal: 10,
    fontSize: 25,
    marginTop: 30,
    fontWeight: 'bold'
  },
  inputView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 25,
    height: 60,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.2,
    shadowRadius: 3.84
  },
  description: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 25,
    height: 150,
    marginBottom: 20,
    padding: 20,
    paddingTop: 20,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    alignSelf: 'center',
  },
  inputText: {
    color: "black",
  },
  dropdown: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.2,
    shadowRadius: 3.84
  },
  button: {
    width: "50%",
    backgroundColor: "#2C2061",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: "#CFC8EF",
    fontWeight: 'bold',
    fontSize: 17
  },
  heading: {
    marginLeft: 10,
    marginBottom: 10,
    fontSize: 15,
    color: '#4b4c4c',
    fontWeight: 'bold'
  }
});