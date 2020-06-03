import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableHighlight } from 'react-native';
import firebase from 'firebase'
import _ from 'lodash';
import Icon from "react-native-vector-icons/Ionicons";

import { db } from '../config';
let offersRef = db.ref('/offers');
import { byFollowed } from "/Users/meganyap/Desktop/ReShare/ReShare/index.js"
import OfferComponent from "../components/OfferComponent"
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

class Following extends Component {

  state = {
    offers: [],
    fullData: [],
    following: []
  };

  componentDidMount() {
    let mounted = true;
    if (mounted) {
      db.ref('/users/' + firebase.auth().currentUser.uid + '/following').on('value', snapshot => {
        let data = snapshot.val();
        const following = Object.values(data);
        console.log('following: ' + following)

        offersRef.on('value', snapshot => {
          let data = snapshot.val();
          let fullData = Object.values(data);
          this.setState({ fullData })

          let offers = _.filter(fullData, offer => {
            return byFollowed(offer, following)
          });
          console.log(offers)

          this.setState({ offers });
        })
      });
    }
    return () => mounted = false;

  }

  renderHeader = () => {
    const { currentUser } = this.state
    return (
      <View
           style={{
             flexDirection: "row",
             backgroundColor: "white",
             marginTop: 60,
             marginBottom: 10
           }}
         >
          <Text style={{marginHorizontal: 20, fontWeight: 'bold', fontSize: 25 }}>Following</Text>
         </View>
    )
  }

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
          renderItem={({ item }) => (
            <TouchableHighlight style={{ marginHorizontal: 10 }} onPress={() => { this.pressRow(item) }}>
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
export default Following;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
});