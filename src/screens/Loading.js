import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { AsyncStorage } from "react-native"

import firebase from 'firebase'

export default class Loading extends React.Component {
  state = { userStatus: '' }

  componentDidMount = () => {
    let mounted = true;
    if (mounted) {
      // Determines whether the user is logged in or not
      firebase.auth().onAuthStateChanged((user) => {
        try {
          AsyncStorage.getItem('profileSetUp').then(data => {
            if (data != 'set up') {
              AsyncStorage.setItem('userStatus', JSON.stringify('not logged in'))
              this.setState({ userStatus: 'not logged in' })
            }
            else if (user) {
              console.log(user)
              console.log('logged in')
              AsyncStorage.setItem('userStatus', JSON.stringify('logged in'))
              this.setState({ userStatus: 'logged in' })
            } else {
              console.log('not logged in')
              AsyncStorage.setItem('userStatus', JSON.stringify('not logged in'))
              this.setState({ userStatus: 'not logged in' })
            }
          });
        }
        catch (err) {
          console.log('Failed to load')
        }
      });

      // Gets the current user's status
      try {
        AsyncStorage.getItem('userStatus').then(data => {
          if (data) {
            const userStatus = JSON.parse(data);
            this.setState({ userStatus })
            console.log(this.state.userStatus)
          }
        });
      }
      catch (err) {
        console.log('Failed to load user status')
      }
    }
    return () => mounted = false;
  }

  // Navigates to the correct screen based on whether or not the user is signed in
  componentDidUpdate = () => {
    console.log(this.state.userStatus)
    if (this.state.userStatus === 'logged in') {
      console.log('user is signed in')
      this.props.navigation.navigate('Home')
    } else {
      console.log('user is not signed in')
      this.props.navigation.navigate('SignUpIndividual')

    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
})