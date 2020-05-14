import React, {Component} from 'react';
import {View, Button, Text, StyleSheet, Image, SafeAreaView, Dimensions} from 'react-native';
import firebase from 'firebase'
import { AsyncStorage } from "react-native"
import { ifIphoneX } from 'react-native-iphone-x-helper'

export default class Profile extends React.Component {
  state = { currentUser: null }
  componentDidMount() {
    let mounted = true;
    if(mounted){
      const { currentUser } = firebase.auth()
      this.setState({ currentUser })
    }
    return () => mounted = false;

  }
  render() {
    const { currentUser } = this.state
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={styles.profile}>
          <Image 
          source={require('../icons/exampleOfferImg.jpeg')}
          style={[styles.inProfile, {width: 125, height: 125, borderRadius: 400/ 2}]}/>
        </SafeAreaView>
        <Text>Name: {currentUser && currentUser.displayName}</Text>
        <Text>Email address: {currentUser && currentUser.email}</Text>
        <Button
         title="Sign out"
         onPress={() => 
          {
          AsyncStorage.setItem('userStatus', JSON.stringify('not logged in'))
          firebase.auth().signOut();
          this.props.navigation.navigate('Loading');
        }}
         />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    height: Dimensions.get('window').height * 0.27,
    width: '100%',
    backgroundColor: "#84DAC1"
  },
  inProfile: {
    marginTop: 20,
    marginHorizontal: 20
  }
});