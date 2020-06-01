import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, StyleSheet, Image, Alert } from "react-native";
import { Header } from 'react-native-elements'
import Icon from "react-native-vector-icons/SimpleLineIcons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons"
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import firebase from 'firebase'
require('firebase/firestore')
require("firebase/functions");

import { db } from '../config';
let offersRef = db.ref('/offers');

import OfferStyle from './OfferStyle'

const styles = StyleSheet.create({ ...OfferStyle })

// Adapted from https://github.com/nattatorn-dev/react-native-user-profile (date of retrieval: May 18)

export default class Offer extends React.PureComponent {
  state = {
    name: '',
    author: '',
    description: '',
    category: '',
    expiry: '',
    location: '',
    time: '',
    url: '../icons/exampleOfferImg.jpeg',
    key: '',
    uid: ''
  }

  getAuthor = (uid) => {
    var ref = firebase.database().ref("users/" + uid);
    ref.once("value")
      .then((snapshot) => {
        const name = snapshot.child("name").val();
        console.log(name)
        this.setState({author: name})
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
    let mounted = true;
    if (mounted) {
      const { navigation } = this.props;

      const name = navigation.getParam('name', 'no name');
      this.setState({ name })

      const uid = navigation.getParam('uid', 'no uid')
      this.setState({ uid })
      this.getAuthor(uid)

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

      const key = navigation.getParam('key', 'no key')
      this.setState({ key })
    }
    return () => mounted = false;
  }

  static defaultProps = {
    containerStyle: {},
  }

  renderDetail = () => {
    return (
      <View>
        <Text style={styles.detailText}>{this.state.description}</Text>
      </View>
    )
  }

  renderDescription = () => {
    return (
      <View>
        <Text style={styles.categoryText}>{this.state.category.toUpperCase()}</Text>
        <Text onPress={() => { console.log(this.state.uid), this.props.navigation.navigate('UserProfile', { uid: this.state.uid }) }} style={styles.priceText}>{this.state.name}</Text>
        <View style={{ flexDirection: 'row', marginVertical: 5, alignContent: 'center' }}>
          <Image style={styles.authorProfile} source={require('../icons/exampleOfferImg.jpeg')} />
          <Text style={styles.authorText}>{this.state.author}</Text>
        </View>
        <Text style={styles.descriptionText}>{this.state.time}</Text>
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
                <Menu
                  ref={this.setMenuRef}
                  button={<Icon
                    name="options"
                    color='#D3D3D3'
                    size={25}
                    onPress={this.showMenu}
                  />}
                >
                  <MenuItem onPress={this.hideMenu}>Edit</MenuItem>
                  <MenuItem onPress={this.hideMenu}>Delete</MenuItem>
                  <MenuDivider />
                  <MenuItem onPress={this.reportOffer}>Report offer</MenuItem>
                </Menu>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    )
  }

  reportOffer = () => {
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

  render() {
    return (
      <View style={styles.mainviewStyle}>
        <ScrollView style={styles.scroll}>
          <View style={[styles.container, this.props.containerStyle]}>
            <View style={styles.cardContainer}>
              {this.renderImage()}
            </View>
          </View>
          <View style={styles.productRow}>{this.renderDescription()}</View>
          <View style={styles.productRow}>{this.renderDetail()}</View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.buttonFooter} onPress={() => {
            this.props.navigation.navigate('ChatScreen', {
              id: this.state.uid,
              author: this.state.author
            })
          }}>
            <Text style={styles.textFooter}>CONTACT DONOR</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

}