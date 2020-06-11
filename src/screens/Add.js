import React, { Component, useState } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Button
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../config';
import firebase from 'firebase'
import 'firebase/storage';
import uuid from 'react-native-uuid';
import { AsyncStorage } from "react-native"
import ResourceImagePicker from "../components/ResourceImagePicker"
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import { useFonts } from '@use-expo/font';

let offersRef = db.ref('/offers');

class Add extends Component {
  constructor() {
    super()
    this.state = {
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
    tags: '',
    imageUri: ''
  };
  showPicker = () => {
    this.setState({ isVisible: true })
  };

  hidePicker = () => {
    this.setState({
      isVisible: false,
      expiry: ''
    })
  }

  handlePicker = (date) => {
    this.setState({
      isVisible: false,
      expiry: moment(date).format('MMMM Do YYYY')
    })
  }

  componentDidMount() {
    this.getPermissionAsync();
    this.refreshData()
    var user = firebase.auth().currentUser;
  }

  refreshData = () => {
    this.setState({ name: '',
    category: '',
    description: '',
    location: '',
    expiry: '',
    tags: '',
    imageUri: ''
  })
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      console.log('getting permission');
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  addOffer(name, category, description, location, expiry, id) {
    offersRef.push({
      name, author: firebase.auth().currentUser.uid, category, time: firebase.database.ServerValue.TIMESTAMP, description, location, expiry, id
    });
    this.setState({
      name: '', category: '', description: '', location: '', expiry: '', id: ''
    })
  };

  handleChange = e => {
    this.setState({
      e: e.nativeEvent.text
    });
  };


  setOfferImage = (uri) => {
    this.setState({ imageUri: uri.uri })
  }

  handleSubmit = () => {
    if (!(/\S/.test(this.state.imageUri))) {
      Alert.alert(
        "Please add an image for your offer"
      );
    }

    else if (!(/\S/.test(this.state.name)) || !(/\S/.test(this.state.category)) || !(/\S/.test(this.state.description)) || !(/\S/.test(this.state.location))) {
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

  uriToBlob = (uri) => {
    console.log('uri: ' + uri)
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
        xhr.send();
      }
      catch (err) { reject(err.message) }
    })
  }

  uploadToFirebase = (blob) => {
    console.log('uploading to firebase')
    return new Promise((resolve, reject) => {
      var storageRef = firebase.storage().ref();
      const imageUuid = uuid.v1();
      console.log('uuid: ' + imageUuid)
      this.addOffer(this.state.name, this.state.category, this.state.description, this.state.location, this.state.expiry, imageUuid);
      Alert.alert('Offer saved successfully');
      storageRef.child('offers/' + imageUuid + '.jpg').put(blob, {
        contentType: 'image/jpeg'
      }).then((snapshot) => {
        blob.close();
        resolve(snapshot);
      }).catch((error) => {
        reject(error);
      });
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
          defaultNull={this.state.category === ''}
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
          defaultNull={this.state.location === ''}
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