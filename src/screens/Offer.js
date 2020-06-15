import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, StyleSheet, Image, Alert } from "react-native";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons"
import Menu, { MenuItem } from 'react-native-material-menu';
import firebase from 'firebase'
import { AsyncStorage } from "react-native"

import { db } from '../config';
let offersRef = db.ref('/offers');

import OfferStyle from './OfferStyle'
import { NavigationEvents } from 'react-navigation';

const styles = StyleSheet.create({ ...OfferStyle })

// Adapted from https://github.com/nattatorn-dev/react-native-user-profile (date of retrieval: May 18)

// Renders a button or a comment or nothing based on who the current user is
const RenderButton = (props) => {
  const { uid, author, keyItem, name, organisation, currentUid, contactDonor } = props;

  // If the current user is the one who posted the offer, don't render anything
  if (uid === currentUid) {
    return (
      null
    )
  }

  // If the current user did not post it and they are an organisation, allow them to contact the donor
  else if (organisation) {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonFooter} onPress={() => contactDonor(uid, author, keyItem, name)}>
          <Text style={styles.textFooter}>CONTACT DONOR</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // If the current user is an individual and did not post it, render a message that tells them they cannot accept it
  else {
    return (
      <Text style={{ alignSelf: 'center', fontSize: 16, position: 'absolute', bottom: 15 }}>Non-organisations cannot accept offers</Text>
    )
  }
}

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
    organisation: false,
    profileUrl: '../icons/exampleOfferImg.jpeg'
  }

  // Gets the profile picture of the current user
  getProfilePicture = (uid) => {
    db.ref('/users').child(uid).once("value")
      .then((snapshot) => {
        console.log(snapshot)
        const imageID = snapshot.child('pfp').val();

        AsyncStorage.getItem('profileLoaded').then(data => {
          if (data === 'loaded') {
            const ref = firebase.storage().ref('profile/' + { imageID }.imageID + '.jpg');
            this.getProfileURL(ref)
          }
        })
      });
  }

  // Gets the URL of the image ref for the profile
  getProfileURL = async (ref) => {
    const url = await ref.getDownloadURL();
    this.setState({ profileUrl: url })
  }

  // Gets the name of the user with a certain UID
  getAuthor = (uid) => {
    var ref = firebase.database().ref("users/" + uid);
    ref.once("value")
      .then((snapshot) => {
        const name = snapshot.child("name").val();
        console.log(name)
        this.setState({ author: name })
      });
  }

  // Gets the type (organisation or individual) of the user with a certain UID
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

  // Sets up the menu option
  setMenuRef = ref => {
    console.log('set menu ref')
    this._menu = ref;
  };

  // Hides the menu
  hideMenu = () => {
    this._menu.hide();
  };

  // Shows the menu 
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
      AsyncStorage.setItem('profileLoaded', 'loaded')
      // Gets the parameters passed to the screen by navigation
      const { navigation } = this.props;

      const name = navigation.getParam('name', 'no name');
      this.setState({ name })

      const uid = navigation.getParam('uid', 'no uid')
      this.setState({ uid })
      this.getAuthor(uid)

      const key = navigation.getParam('key', 'no key')
      this.setState({ key })

      const description = navigation.getParam('description', 'no description');
      this.setState({ description })

      const category = navigation.getParam('category', 'no category')
      this.setState({ category })

      const expiry = navigation.getParam('expiry', 'no expiry');
      this.setState({ expiry })

      const location = navigation.getParam('location', 'no location')
      this.setState({ location })

      const time = navigation.getParam('time', 'no time')
      offersRef.child(key).once("value")
        .then((snapshot) => {
          const time = snapshot.child("time").val();
          this.setState({ time: time })
        });

      const imageID = navigation.getParam('imageID', 'no imageID')
      console.log('image: ' + imageID)
      AsyncStorage.getItem('imageLoaded').then(data => {
        if (data === 'loaded') {
          const ref = firebase.storage().ref('offers/' + { imageID }.imageID + '.jpg');
          this.getURL(ref)
        }
      })

      this.getProfilePicture(uid)

      // Renders the UI
      this.renderDescription()
      AsyncStorage.getItem('imageLoaded').then(data => {
        if (data === 'loaded') {
          this.renderImage()
        }
      })
      this.renderDetail()

      this.getType(firebase.auth().currentUser.uid)
      this.forceUpdate()
    }
    return () => mounted = false;
  }

  // Gets the URL of the image ref
  getURL = async (ref) => {
    const url = await ref.getDownloadURL();
    this.setState({ url })
  }

  static defaultProps = {
    containerStyle: {},
  }

  // Renders the offer's description, location, and expiry date
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

  // Navigates to the correct profile based on the UID passed
  navigateProfile = (uid) => {
    if (uid === firebase.auth().currentUser.uid) {
      this.props.navigation.navigate('MyProfile')
    }
    else {
      this.props.navigation.navigate('UserProfile', { uid: this.state.uid })
    }
  }

  // Renders the category, name, date, and author of the offer
  renderDescription = () => {
    return (
      <View style={{ marginVertical: 25 }}>
        <Text style={styles.categoryText}>{this.state.category.toUpperCase()}</Text>
        <Text style={styles.priceText}>{this.state.name}</Text>
        <View style={{ flexDirection: 'row', marginVertical: 5, alignContent: 'center' }}>
          <Image style={styles.authorProfile} source={{
            uri: this.state.profileUrl,
          }} />
          <Text onPress={() => { this.navigateProfile(this.state.uid) }} style={styles.authorText}>{this.state.author}</Text>
        </View>
        <Text style={styles.descriptionText}>{new Date(this.state.time).toLocaleDateString("en-MY")}</Text>
      </View>
    )
  }

  backDecision = () => {
    const prevScreen = this.props.navigation.getParam('prevScreen', 'no prevScreen')
    if (prevScreen === 'add') {
      this.props.navigation.navigate('Home')
    }
    else {
      this.props.navigation.goBack()
    }
  }

  // Renders the offer image, the menu and the back button
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
                onPress={() => this.backDecision()}
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

  // Navigates to Edit, passing the offer's attributes as parameters
  editOffer = () => {
    console.log('editing offer')
    this.props.navigation.navigate('Edit', {
      name: this.state.name,
      uid: this.state.uid,
      key: this.state.key,
      description: this.state.description,
      category: this.state.category,
      expiry: this.state.expiry,
      location: this.state.location,
      time: this.state.time,
      imageID: this.props.navigation.getParam('imageID', 'no imageID')
    })
    this.hideMenu()
  }

  // Deletes the offer
  deleteOffer = () => {
    console.log('deleting offer')
    offersRef.child(this.state.key).remove();
    this.hideMenu()
    this.props.navigation.navigate('Home')
  }

  // Adds the offer key under reported
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

  // Contacts the donor of the offer
  contactDonor = (uid, author, key, name) => {
    key = key.replace('\"','');
    key = key.replace('\"','');
    const chatID = this.chatID(uid)

    // Sets the latest message of the chat to the user requesting the offer
    firebase.database().ref('messages').child(chatID).update({
      latestMessage: {
        _id: key,
        text: 'Requesting ' + name,
        createdAt: new Date().getTime(),
        system: true
      }
    })

    // Adds a message to the chat that the user is requesting the offer
    firebase.database().ref('messages/' + chatID).once('value', function (snapshot) {
      if (!snapshot.hasChild(key)) {
        console.log('key:'+key)
        firebase.database().ref('messages').child(chatID + '/' + key).set({
          _id: key,
          createdAt: new Date().getTime(),
          text: 'Requesting ' + name,
          system: true
        })
      }
    })

    // Navigates to MessageScreen, passing the uid and name of the author as props
    this.props.navigation.navigate('MessageScreen', {
      id: uid,
      name: author
    })
  }

  // Creates a chatID by joining the current user's UID and the other user's UID
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

  // Renders the offer
  render() {
    const key = this.props.navigation.getParam('key', 'no key')
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

        <RenderButton
          uid={this.state.uid}
          author={this.state.author}
          keyItem={JSON.stringify(key)}
          name={this.state.name}
          organisation={this.state.organisation}
          currentUid={firebase.auth().currentUser.uid}
          contactDonor={this.contactDonor}
        />
      </View>
    )
  }

}