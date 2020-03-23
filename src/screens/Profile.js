import React, {Component} from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';
import firebase from 'firebase'

export default class Profile extends React.Component {
  state = { currentUser: null }
  componentDidMount() {
    let mounted = true;
    if(mounted){
      const { currentUser } = firebase.auth()
      this.setState({ currentUser })
    }
    return () => mounted = false;

    //const { name } = firebase.auth().currentUser.displayName
    //this.setState({ name })
  }
  render() {
    const { currentUser } = this.state
    //const { name } = this.state.name
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