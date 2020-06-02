import React, { Component } from 'react';
import { View, Button, Text, StyleSheet, Image, SafeAreaView, Dimensions, FlatList, TouchableHighlight } from 'react-native';
import firebase from 'firebase'
import { AsyncStorage } from "react-native"
import _ from 'lodash';

import { db } from '../config';
let offersRef = db.ref('/offers');

import { byAuthor } from "/Users/meganyap/Desktop/ReShare/ReShare/index.js"
import OfferComponent from "../components/OfferComponent"

export default class Profile extends React.Component {
  state = {
    currentUser: null,
    offers: [],
    fullData: [],
    bio: '',
    type: '',
    category: ''
  }
  componentDidMount() {
    let mounted = true;
    if (mounted) {
      offersRef.on('value', snapshot => {
        let currentUser = firebase.auth().currentUser
        this.setState({ currentUser })
        let data = snapshot.val();
        let fullData = Object.values(data);
        this.setState({ fullData })

        let offers = _.filter(fullData, offer => {
          return byAuthor(offer, currentUser.uid)
        });

        this.setState({ offers });

        this.getData(currentUser.uid)
      });
    }
    return () => mounted = false;

  }

  getData = (uid) => {
    var ref = firebase.database().ref("users/" + uid);
    ref.once("value")
      .then((snapshot) => {
        const bio = snapshot.child("bio").val();
        console.log(bio)
        if (bio) this.setState({ bio: bio })
        else this.setState({ bio: 'This user has no biography' })

        const type = snapshot.child("type").val();
        console.log(type)
        this.setState({ type: type })

        const category = snapshot.child("category").val();
        console.log(category)
        this.setState({ category: category })
      });
  }

  pressRow(item) {
    console.log(item)
    this.props.navigation.navigate('Offer', {
      name: item.name,
      uid: item.author,
      description: item.description,
      category: item.category,
      expiry: item.expiry,
      location: item.location,
      tags: item.tags,
      time: item.time,
      imageID: item.id
    })
  }

  renderHeader = () => {
    const { currentUser } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView style={this.state.type === 'individual' ? styles.individualProfile : styles.organisationProfile}>
          <Image
            source={require('../icons/exampleOfferImg.jpeg')}
            style={[styles.inProfile, { width: 125, height: 125, borderRadius: 400 / 2 }]} />
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.displayName}>{currentUser && currentUser.displayName}</Text>
            {this.state.type === 'organisation' ?
              <Text style={{ color: 'white', marginVertical: 5 }}>Category: {this.state.category}</Text>
              :
              <Text> </Text>
            }
            <View style={{ flexDirection: 'row', width: Dimensions.get('window').width * 0.55 }}>
              <Text style={styles.biography}>{this.state.bio}</Text>
            </View>
            <Text style={{ position: 'absolute', right: 0, bottom: 10, textAlign: 'right', color: 'white', fontSize: 18 }}>{this.state.type.toUpperCase()}</Text>
          </View>
        </SafeAreaView>
        <View>
          <Text style={{ marginHorizontal: 20, marginTop: 15, fontWeight: 'bold', fontSize: 25 }}>My Listings</Text>
        </View>
      </View>
    )
  }

  renderFooter = () => {
    return (
      <Button
        title="Sign out"
        onPress={() => {
          AsyncStorage.setItem('userStatus', JSON.stringify('not logged in'))
          firebase.auth().signOut();
          this.props.navigation.navigate('Loading');
        }}
      />
    )
  }

  render() {
    const { currentUser } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList
          numColumns={2}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}
          scrollEnabled={true}
          scrollEventThrottle={16}
          snapToAlignment="center"
          data={this.state.offers}
          renderItem={({ item }) => (
            <TouchableHighlight style={{ marginHorizontal: 10 }} onPress={() => { this.pressRow(item) }}>
              <OfferComponent
                item={item}
              />
            </TouchableHighlight>
          )}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
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
  individualProfile: {
    height: Dimensions.get('window').height * 0.25,
    width: '100%',
    backgroundColor: "#84DAC1",
    flexDirection: 'row'
  },
  organisationProfile: {
    height: Dimensions.get('window').height * 0.25,
    width: '100%',
    backgroundColor: "#F288AF",
    flexDirection: 'row'
  },
  inProfile: {
    marginTop: 20,
    marginHorizontal: 20
  },
  displayName: {
    marginTop: 30,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  biography: {
    marginTop: 5,
    marginLeft: 2,
    fontSize: 10,
    color: 'white',
    flex: 1,
    flexWrap: 'wrap'
  }
});