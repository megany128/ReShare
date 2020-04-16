import React, {Component} from 'react';
import {View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Alert} from 'react-native';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { db } from '../config';
import firebase from 'firebase'

class Add extends Component {
  state = {
    name: '',
    author: firebase.auth().currentUser.uid,
    category: '',
    time: firebase.database.ServerValue.TIMESTAMP,
    description: '',
    location: '',
    expiry: '',
    tags:''
  };

  addOffer(name, author, category, time, description, location, expiry, tags){
    db.ref('/offers').push({
      name, author, category, time, description, location, expiry, tags
    });
  };

  handleChange = e => {
    this.setState({
      e: e.nativeEvent.text
    });
  };
  
  handleSubmit = () => {
    this.addOffer(this.state.name, this.state.author, this.state.category, this.state.time, this.state.description, this.state.location, this.state.expiry, this.state.tags);
    Alert.alert('Offer saved successfully');
  };
  
  render() {
    // TO DO: In description, prompt users to specify if they are fine with users taking partial amounts or if it has to be all
    return (
      <View style={styles.main}>
        <Text style={styles.title}>Add Offer</Text>
        <TextInput style={styles.itemInput} placeholder = "Offer title" onChangeText={name => this.setState({ name })} />
        <RNPickerSelect
            style={pickerSelectStyles.inputIOS}
            //placeholder = "Select category"
            onValueChange={(category) => this.setState({ category })}
            items={[
                { label: "Furniture", value: "Furniture" },
                { label: "Food", value: "Food" },
                { label: "Stationery", value: "Stationery" },
                { label: "Electronics", value: "Electronics" },
                { label: "Toys and Games", value: "Toys and Games" },
                { label: "Health", value: "Health" },
                { label: "Books", value: "Books" },
                { label: "Hobbies", value: "Hobbies" },
                { label: "Appliances", value: "Appliances" },
                { label: "Clothing", value: "Clothing" },
                { label: "Babies and Kids", value: "Babies and Kids" },
                { label: "Sports", value: "Sports" },
            ]}
        />
        <TextInput style={styles.itemInput} placeholder = "Description" onChangeText={description => this.setState({ description })} />
        <TextInput style={styles.itemInput} placeholder = "Location" onChangeText={location => this.setState({ location })} />
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