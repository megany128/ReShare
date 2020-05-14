import React, { Component, useState } from 'react';
import {View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Alert} from 'react-native';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { db } from '../config';
import firebase from 'firebase'
import 'firebase/storage';

import moment from "moment";
import ResourceImagePicker from "../components/ResourceImagePicker"
moment.locale('en-gb'); 
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

class Add extends Component {
  state = {
    name: '',
    author: firebase.auth().currentUser.uid,
    category: '',
    date: moment(new Date()).format('L'),
    description: '',
    location: '',
    expiry: '',
    tags:'',
    imageUri: ''
  };

  componentDidMount() {
    this.getPermissionAsync();

    var user = firebase.auth().currentUser;
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

  addOffer(name, author, category, date, description, location, expiry, imageURI){
    db.ref('/offers').push({
      name, author, category, date, description, location, expiry, imageURI
    });
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
    this.uriToBlob(this.state.imageUri).then(function(blob) {
      return this.uploadToFirebase(blob)
    });
    this.addOffer(this.state.name, this.state.author, this.state.category, this.state.date, this.state.description, this.state.location, this.state.expiry, this.state.imageUri);
    Alert.alert('Offer saved successfully');
  };

  uriToBlob = (uri) => {
    console.log('uri: ' + uri)
    return new Promise(function(resolve, reject) {
      try {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", uri);
          xhr.responseType = "blob";
          xhr.onerror = function() {reject("Network error.")};
          xhr.onload = function() {
              if (xhr.status === 200) {resolve(xhr.response)}
              else {reject("Loading error:" + xhr.statusText)}
          };
          xhr.send();
      }
      catch(err) {reject(err.message)}
    })
  }

  uploadToFirebase = (blob) => {
    console.log('uploading to firebase')
    return new Promise((resolve, reject)=>{
      var storageRef = firebase.storage().ref();
      storageRef.child('uploads/photo.jpg').put(blob, {
        contentType: 'image/jpeg'
      }).then((snapshot)=>{
        blob.close();
        resolve(snapshot);
      }).catch((error)=>{
        reject(error);
      });
    });
  }

  render() {
    // TO DO: In description, prompt users to specify if they are fine with users taking partial amounts or if it has to be all
    return (
      <View style={styles.main}>
        <Text style={styles.title}>Add Offer</Text>
        <ResourceImagePicker image={this.state.image} onImagePicked={this.setOfferImage}/>
        <TextInput style={styles.itemInput} placeholder = "Offer title" onChangeText={name => this.setState({ name })} />
        <RNPickerSelect
            style={pickerSelectStyles.inputIOS}
            //placeholder = "Select category"
            onValueChange={(category) => this.setState({ category })}
            items={[
                { label: "Appliances", value: "Appliances" },
                { label: "Babies and Kids", value: "Babies and Kids" },
                { label: "Books", value: "Books" },
                { label: "Clothing", value: "Clothing" },
                { label: "Electronics", value: "Electronics" },
                { label: "Food", value: "Food" },
                { label: "Furniture", value: "Furniture" },
                { label: "Health", value: "Health" },
                { label: "Stationery", value: "Stationery" },
                { label: "Hobbies", value: "Hobbies" },
                { label: "Sports", value: "Sports" },
                { label: "Toys and Games", value: "Toys and Games" },  
            ]}
        />
        <TextInput style={styles.itemInput} placeholder = "Description" onChangeText={description => this.setState({ description })} />
        <RNPickerSelect
            style={pickerSelectStyles.inputIOS}
            //placeholder = "Select category"
            onValueChange={(location) => this.setState({ location })}
            items={[
              {label: 'Johor', value: 'Johor'},
              {label: 'Kedah', value: 'Kedah'},
              {label: 'Kelantan', value: 'Kelantan'},
              {label: 'KL/Selangor', value: 'KL/Selangor'},
              {label: 'Melaka', value: 'Melaka'},
              {label: 'Negeri Sembilan', value: 'Negeri Sembilan'},
              {label: 'Pahang', value: 'Pahang'},
              {label: 'Penang', value: 'Penang'},
              {label: 'Perak', value: 'Perak'},
              {label: 'Perlis', value: 'Perlis'},
              {label: 'Sabah', value: 'Sabah'},
              {label: 'Sarawak', value: 'Sarawak'},
              {label: 'Terengganu', value: 'Terengganu'},
            ]}
        />
        <TextInput style={styles.itemInput} placeholder = "Offer expiry date" onChangeText={expiry => this.setState({ expiry })} />
        <TextInput style={styles.itemInput} placeholder = "Tags" onChangeText={tags => this.setState({ tags })} />
        <TouchableHighlight
          style={styles.button}
          underlayColor="black"
          onPress={this.handleSubmit}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
export default Add;

const styles = StyleSheet.create({
  main: {
    flex: 1, 
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center'
  },
  itemInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    color: 'grey'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'grey',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  });