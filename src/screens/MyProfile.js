import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Dimensions, FlatList, TouchableHighlight, TouchableOpacity } from 'react-native';
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
    category: '',
    url: '../icons/exampleOfferImg.jpeg'
  }

  // Gets the profile picture of the current user
  getProfilePicture = () => {
    db.ref('/users').child(firebase.auth().currentUser.uid).once("value")
        .then((snapshot) => {
          console.log(snapshot)
          const imageID = snapshot.child('pfp').val();
          
          AsyncStorage.getItem('profileLoaded').then(data => {
            if (data === 'loaded') {
              const ref = firebase.storage().ref('profile/' + {imageID}.imageID + '.jpg');
              this.getURL(ref)
            }
          })
        });
  }

  // Gets the URL of the image ref
  getURL = async (ref) => {
    const url = await ref.getDownloadURL();
    this.setState({ url })
  }

  componentDidMount() {
    let mounted = true;
    if (mounted) {
      AsyncStorage.setItem('profileLoaded', 'loaded')
      offersRef.on('value', snapshot => {
        let currentUser = firebase.auth().currentUser
        this.setState({ currentUser })

        // Gets all the offers from Firebase
        let data = snapshot.val();
        if (data) {
          let fullData = Object.values(data);
          this.setState({ fullData })

          // Filters the offers and only returns those by the current user
          let offers = _.filter(fullData, offer => {
            return byAuthor(offer, currentUser.uid)
          });
          this.setState({ offers });
        }
        this.getProfilePicture()
        this.getData(currentUser.uid)
      });
    }
    return () => mounted = false;

  }

  // Gets the bio, type, and category of the user with the UID passed in
  getData = (uid) => {
    var ref = firebase.database().ref("users/" + uid);
    ref.once("value")
      .then((snapshot) => {
        const bio = snapshot.child("bio").val();
        if (bio) this.setState({ bio: bio })
        else this.setState({ bio: 'This user has no biography' })

        const type = snapshot.child("type").val();
        this.setState({ type: type })

        const category = snapshot.child("category").val();
        this.setState({ category: category })
      });
  }

  // Gets the key of the offer and passes it to the screen Offer along with the other characteristics of the offer
  pressRow(item, index) {
    console.log(item)
    this.props.navigation.navigate('Offer', {
      name: item.name,
      key: this.getKey(index),
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

  getKey = (index) => {
    offersRef.on('value', snapshot => {
      let data = snapshot.val();
      if (data) {
        console.log('first key')
        
        let fullData = _.filter(Object.entries(data).map(([key, value]) => {
          return byAuthor(value, firebase.auth().currentUser.uid)
        }))
        console.log(Object.keys(fullData))
        this.setState({ fullData })
      }
      console.log('key')
      console.log(Object.keys(this.state.fullData))
    })
  }

  // Renders the profile header
  renderHeader = () => {
    const { currentUser } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView style={this.state.type === 'individual' ? styles.individualProfile : styles.organisationProfile}>
          <Image
            source={{
              uri: this.state.url,
            }}
            style={[styles.inProfile, { width: 125, height: 125, borderRadius: 400 / 2 }]} />
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={{ position: 'absolute', right: 0, top: 10 }}
                onPress={() => {
                  AsyncStorage.setItem('userStatus', JSON.stringify('not logged in'))
                  firebase.auth().signOut();
                  this.props.navigation.navigate('Loading');
                }}
              >
                <Text style={{ color: 'white' }}>Sign out</Text>
              </TouchableOpacity>
              <Text style={styles.displayName}>{currentUser && currentUser.displayName}</Text>
            </View>
            {this.state.type === 'organisation' ?
              <Text style={{ color: 'white', marginVertical: 5 }}>Category: {this.state.category}</Text>
              :
              <View></View>
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

  // Renders the offers by the current user
  render() {
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
          renderItem={({ item, index }) => (
            <TouchableHighlight style={{ marginHorizontal: 10 }} onPress={() => { this.pressRow(item, index) }}>
              <OfferComponent
                item={item}
              />
            </TouchableHighlight>
          )}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={this.renderHeader}
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