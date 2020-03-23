import React, {Component} from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

import firebase from 'firebase'

export default class Loading extends React.Component{
  componentDidMount = () => { 
    firebase.auth().onAuthStateChanged((user)=> {
      console.log(user)
      if (user) {
        console.log('user is signed in')
        this.props.navigation.navigate('Home')
      } else {
        console.log('user is not signed in')
        this.props.navigation.navigate('SignUp')

      }
    });
    
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
  }
})