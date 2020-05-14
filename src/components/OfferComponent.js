import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");

import firebase from 'firebase'
import { db } from '../config';
let offersRef = db.ref('/offers');

class OfferComponent extends Component {
  state = {
    url: '../icons/exampleOfferImg.jpeg'
  }
  async componentDidMount() {
    let mounted = true;
    if(mounted){
      const ref = firebase.storage().ref('offers/' + this.props.item.id + '.jpg');
      const url = await ref.getDownloadURL();
      this.setState({ url })
    }
    return () => mounted = false;
  }
  render() {
    return (
      <View>
        <View style={[styles.flex, styles.column, styles.recommendation]}>
          <View style={[styles.flex, styles.recommendationHeader, styles.shadow]}>
            <Image style = {styles.recommendationImage} source={{ uri: this.state.url }}/>
          </View>
        </View>
        <View style={[styles.flex, styles.column, { justifyContent: 'space-evenly', paddingHorizontal: 12, flexDirection: 'row' }]}>
          <Text style={{ fontSize: 16 * 1.25, fontWeight: '500', paddingBottom: 36 / 4.5, flexWrap: 'wrap', flex: 1 }}>{this.props.item.name} </Text>
        </View>
        <View style={[styles.flex, styles.column, { justifyContent: 'space-evenly', paddingHorizontal: 12 }]}>
          <Text style={{ color: '#BCCCD4', marginTop: 5 }}>{this.props.item.category} </Text>
        </View>
      </View>  
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
        width: (width - (36* 2)) / 2,
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