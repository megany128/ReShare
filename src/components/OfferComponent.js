import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

import firebase from 'firebase'
import { AsyncStorage } from "react-native"

class OfferComponent extends Component {
  state = {
    // Sets the default image to the example offer
    url: '../icons/exampleOfferImg.jpeg'
  }
  async componentDidMount() {
    let mounted = true;
    if (mounted) {
      console.log(this.props.item.name + ': ' + this.props.item.id)
      AsyncStorage.getItem('imageLoaded').then(data => {
        if (data === 'loaded') {
          // Gets the url of the image stored under the corresponding offer in Firebase
          const ref = firebase.storage().ref('offers/' + this.props.item.id + '.jpg');
          this.getURL(ref)
        }
        return () => mounted = false;
      })
    }
  }

  getURL = async(ref) => {
    const url = await ref.getDownloadURL();
    this.setState({ url })
  }

  render() {
    // Renders the offer as a square showing the image, category, and author
    return (
      <View>
        <View style={[styles.flex, styles.column, styles.recommendation]}>
          <View style={[styles.flex, styles.recommendationHeader, styles.shadow]}>
            <Image style={styles.recommendationImage} source={{ uri: this.state.url }} />
          </View>
        </View>
        <View style={[styles.flex, styles.column, { justifyContent: 'space-evenly', paddingHorizontal: 12, flexDirection: 'row' }]}>
          <Text style={{ fontSize: 16 * 1.25, fontWeight: '500', paddingBottom: 36 / 4.5, flexWrap: 'wrap', flex: 1 }}>{this.props.item.name} </Text>
        </View>
        <View style={[styles.flex, styles.column, { justifyContent: 'space-evenly', paddingHorizontal: 12 }]}>
          <Text style={{ color: '#BCCCD4', marginTop: 5 }}>{this.props.item.category} </Text>
        </View>
      </View >
    );
  }
}
export default OfferComponent;

const styles = StyleSheet.create({
  recommendation: {
    width: (width - (36 * 2)) / 2,
    marginHorizontal: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
    borderRadius: 12,
    marginVertical: 36 * 0.5,
  },
  recommendationImage: {
    width: (width - (36 * 2)) / 2,
    height: (width - (36 * 2)) / 2
  },
  recommendationHeader: {
    overflow: 'hidden',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  flex: {
    flex: 1,
  },
  column: {
    flexDirection: 'column'
  }
})