import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, StyleSheet, Image, Alert } from "react-native";
import { Header } from 'react-native-elements'
import Icon from "react-native-vector-icons/SimpleLineIcons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons"
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import firebase from 'firebase'
require('firebase/firestore')
require("firebase/functions");

import { db } from '../config';
let offersRef = db.ref('/offers');

import OfferStyle from './OfferStyle'
import { NavigationEvents } from 'react-navigation';

const styles = StyleSheet.create({ ...OfferStyle })

// Adapted from https://github.com/nattatorn-dev/react-native-user-profile (date of retrieval: May 18)

export default class Offer extends React.PureComponent {
  state = {
    name: '',
    author: '',
    key: '',
    description: '',
    category: '',
    expiry: '',
    location: '',
    time: '',
    url: '../icons/exampleOfferImg.jpeg',
    key: '',
    uid: '',
    organisation: false
  }

  getAuthor = (uid) => {
    var ref = firebase.database().ref("users/" + uid);
    ref.once("value")
      .then((snapshot) => {
        const name = snapshot.child("name").val();
        console.log(name)
        this.setState({ author: name })
      });
  }

  getType = (uid) => {
    var ref = firebase.database().ref("users/" + uid);
    ref.once("value")
      .then((snapshot) => {
        const type = snapshot.child("type").val();
        console.log(type)
        if (type === "organisation") {
          this.setState({ organisation: true })
        }
      });
  }

  _menu = null;

  setMenuRef = ref => {
    console.log('set menu ref')
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    console.log('show menu')
    this._menu.show();
  };

  async componentDidMount() {
    this.getData()
  }

  getData = async () => {
    let mounted = true;
    if (mounted) {
      const { navigation } = this.props;

      const name = navigation.getParam('name', 'no name');
      this.setState({ name })

      const uid = navigation.getParam('uid', 'no uid')
      this.setState({ uid })
      this.getAuthor(uid)

      const key = navigation.getParam('key', 'no key')
      this.setState({ key })
      console.log(JSON.stringify(key))

      const description = navigation.getParam('description', 'no description');
      this.setState({ description })

      const category = navigation.getParam('category', 'no category')
      this.setState({ category })

      const expiry = navigation.getParam('expiry', 'no expiry');
      this.setState({ expiry })

      const location = navigation.getParam('location', 'no location')
      this.setState({ location })

      const time = navigation.getParam('time', 'no time')
      this.setState({ time })

      const imageID = navigation.getParam('imageID', 'no imageID')
      const ref = firebase.storage().ref('offers/' + { imageID }.imageID + '.jpg');
      const url = await ref.getDownloadURL();
      this.setState({ url })

      this.renderDescription()
      this.renderImage()
      this.renderDetail()

      this.getType(firebase.auth().currentUser.uid)
    }
    return () => mounted = false;
  }

  static defaultProps = {
    containerStyle: {},
  }

  renderDetail = () => {
    return (
      <View>
        <Text style={{ color: 'black', fontSize: 22, fontWeight: 'bold' }}>Description</Text>
        <Text style={styles.detailText}>{this.state.description}</Text>

        <Text style={{ color: 'black', fontSize: 22, fontWeight: 'bold', marginTop: 10 }}>Location</Text>
        <Text style={styles.detailText}>{this.state.location}</Text>

        {this.state.expiry ? (
          <View>
            <Text style={{ color: 'black', fontSize: 22, fontWeight: 'bold', marginTop: 10 }}>Expiry Date</Text>
            <Text style={styles.detailText}>{this.state.expiry}</Text>
          </View>
        ) : (
            <Text></Text>
          )}
      </View>
    )
  }

  navigateProfile = (uid) => {
    if (uid === firebase.auth().currentUser.uid) {
      this.props.navigation.navigate('MyProfile')
    }
    else {
      this.props.navigation.navigate('UserProfile', { uid: this.state.uid })
    }
  }

  renderDescription = () => {
    return (
      <View style={{ marginVertical: 25 }}>
        <Text style={styles.categoryText}>{this.state.category.toUpperCase()}</Text>
        <Text style={styles.priceText}>{this.state.name}</Text>
        <View style={{ flexDirection: 'row', marginVertical: 5, alignContent: 'center' }}>
          <Image style={styles.authorProfile} source={require('../icons/exampleOfferImg.jpeg')} />
          <Text onPress={() => { this.navigateProfile(this.state.uid) }} style={styles.authorText}>{this.state.author}</Text>
        </View>
        <Text style={styles.descriptionText}>{new Date(this.state.time).toLocaleDateString("en-MY")}</Text>
      </View>
    )
  }

  renderImage = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.coverContainer}>
          <ImageBackground
            source={{
              uri: this.state.url,
            }}
            style={styles.coverImage}
          >
            <View style={{ flexDirection: 'row' }}>
              <Icon2
                name="arrow-left-circle"
                color='#D3D3D3'
                size={30}
                style={{ marginTop: 40, marginLeft: 20 }}
                onPress={() => this.props.navigation.goBack()}
                hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
              />
              <View style={{ marginTop: 40, marginLeft: 360, position: "absolute" }}>
                {this.state.uid === firebase.auth().currentUser.uid ? (
                  <Menu
                    ref={this.setMenuRef}
                    button={<Icon
                      name="options"
                      color='#D3D3D3'
                      size={25}
                      onPress={this.showMenu}
                    />}
                  >
                    <MenuItem onPress={this.editOffer}>Edit</MenuItem>
                    <MenuItem onPress={this.deleteOffer}>Delete</MenuItem>
                  </Menu>
                ) : (
                    <Menu
                      ref={this.setMenuRef}
                      button={<Icon
                        name="options"
                        color='#D3D3D3'
                        size={25}
                        onPress={this.showMenu}
                      />}
                    >
                      <MenuItem onPress={this.reportOffer}>Report offer</MenuItem>
                    </Menu>
                  )}
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    )
  }

  editOffer = () => {
    console.log('editing offer')
    this.props.navigation.navigate('Edit', {
      name: this.state.name,
      key: this.state.key,
      uid: this.state.uid,
      description: this.state.description,
      category: this.state.category,
      expiry: this.state.expiry,
      location: this.state.location,
      time: this.state.time,
      imageID: this.props.navigation.getParam('imageID', 'no imageID')
    })
    this.hideMenu()
  }

  deleteOffer = () => {
    console.log('deleting offer')
    offersRef.child(this.state.key).remove();
    this.hideMenu()
    this.props.navigation.navigate('Home')
  }

  reportOffer = () => {
    db.ref('/reported').push({
      key: this.state.key
    });
    Alert.alert(
      "Offer Reported",
      "The report has been sent and will be processed shortly. Thank you for contributing.",
      [
        {
          text: "OK",
          onPress: () => this.hideMenu()
        }
      ]
    );
  }

  contactDonor = (uid, author, key, name) => {
    const chatID = this.chatID(uid)

    firebase.database().ref('messages').child(chatID).update({
      latestMessage: {
        _id: key,
        text: 'Requesting ' + name,
        createdAt: new Date().getTime(),
        system: true
      }
    })

    firebase.database().ref('messages/' + chatID).once('value', function (snapshot) {
      if (!snapshot.hasChild(key)) {
        firebase.database().ref('messages').child(chatID + '/' + key).set({
          _id: key,
          createdAt: new Date().getTime(),
          text: 'Requesting ' + name,
          system: true
        })
      }
    })


    this.props.navigation.navigate('MessageScreen', {
      id: uid,
      author: author
    })
  }

  chatID = (id) => {
    const chatterID = firebase.auth().currentUser.uid;
    const chateeID = id;
    const chatIDpre = [];
    chatIDpre.push(chatterID);
    chatIDpre.push(chateeID);
    chatIDpre.sort();


    console.log(chatIDpre.join('_'))
    return chatIDpre.join('_');
  };

  render() {
    return (
      <View style={styles.mainviewStyle}>
        <NavigationEvents onDidFocus={() => this.getData()} />
        <ScrollView style={styles.scroll}>
          <View style={[styles.container, this.props.containerStyle]}>
            <View style={styles.cardContainer}>
              {this.renderImage()}
            </View>
          </View>
          <View style={styles.productRow}>{this.renderDescription()}</View>
          <View style={styles.productRow}>{this.renderDetail()}</View>
        </ScrollView>

        {this.state.organisation ? (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.buttonFooter} onPress={() => this.contactDonor(this.state.uid, this.state.author, this.state.key, this.state.name)}>
              <Text style={styles.textFooter}>CONTACT DONOR</Text>
            </TouchableOpacity>
          </View>
        ) : (
            <Text style={{ alignSelf: 'center', fontSize: 16, position: 'absolute', bottom: 15 }}>Non-organisations cannot accept offers</Text>
          )}
      </View>
    )
  }

}