import React, {Component} from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';
import firebase from 'firebase'

export default class Profile extends React.Component {
  state = { currentUser: null }
  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }
  render() {
    const { currentUser } = this.state
    return (
      <View style={styles.container}>
        <Text>Profile</Text>
        <Text>Email address: {currentUser && currentUser.email}</Text>

        <Button
         title="Sign out"
         onPress={() => firebase.auth().signOut()} 
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
});