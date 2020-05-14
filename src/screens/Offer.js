import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, SafeAreaView, Platform, Image, FlatList, TouchableHighlight} from "react-native";

import firebase from 'firebase'
require('firebase/firestore')
require("firebase/functions");

import { db } from '../config';
let offersRef = db.ref('/offers');

export default class Offer extends React.Component {  
    getAuthor(uid){
      var getUser = firebase.functions().httpsCallable('getUser');
      console.log('success');
      getUser({uid: uid}).then(function(result) {
        console.log('getUser called')
        var user = result.data.uid;
        return(
          result
          )
        
      })
      .catch(function(error) {
        var code = error.code;
        var message = error.message;
        var details = error.details;
      });
    }
    

    render() {
        const { navigation } = this.props;  
        const name = navigation.getParam('name', 'no name');
        const author = navigation.getParam('author', 'no author')
        const description = navigation.getParam('description', 'no description');
        const category = navigation.getParam('category', 'no category')
        const expiry = navigation.getParam('expiry', 'no expiry');
        const location = navigation.getParam('location', 'no location')
        const tags = navigation.getParam('tags', 'no tags');
        const date = navigation.getParam('date', 'no date')
       
        return(
        <View style = {styles.container}>
            <Text> Name: {name}</Text>
            <Text> Author: {author} </Text>
            <Text> Description: {description}</Text>
            <Text> Category: {category}</Text>
            <Text> Expiry: {expiry}</Text>
            <Text> Location: {location}</Text>
            <Text> Tags: {tags}</Text>
            <Text> Date: {date}</Text>
         </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  })