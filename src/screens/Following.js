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
import { NavigationEvents } from 'react-navigation';

class Following extends Component {

  state = {
    offers: [],
    fullData: [],
    following: [],
    isFetching: false
  };

  getData = () => {
    db.ref('/users/' + firebase.auth().currentUser.uid + '/following').on('value', snapshot => {
      let data = snapshot.val();
      if (data) {
        const following = Object.values(data);
        console.log('following: ' + following)
      }

      offersRef.on('value', snapshot => {
        let data = snapshot.val();
        if (data) {
          let fullData = Object.values(data);
          this.setState({ fullData })

          let offers = _.filter(fullData, offer => {
            return byFollowed(offer, following)
          });
          console.log(offers)

          this.setState({ offers });
          this.setState({ isFetching: false })
        }
      })
    });
  }

  componentDidMount() {
    let mounted = true;
    if (mounted) {
      this.getData()
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
        <Text style={{ marginHorizontal: 20, fontWeight: 'bold', fontSize: 25 }}>Following</Text>
      </View>
    )
  }

  pressRow(item) {
    this.props.navigation.navigate('Offer', {
      name: item.name,
      uid: item.author,
      description: item.description,
      category: item.category,
      expiry: item.expiry,
      location: item.location,
      time: item.time,
      imageID: item.id
    })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <NavigationEvents onDidFocus={() => this.getData()} />
        {this.state.offers[0] != null ?
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
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
          />
          :
          <View
            style={{
              flexDirection: "column",
              backgroundColor: "white",
              marginTop: 60,
              marginBottom: 10
            }}
          >
            <Text style={{ marginHorizontal: 20, fontWeight: 'bold', fontSize: 25 }}>Following</Text>
            <Text style={{ marginTop: 20, marginLeft: 20 }}>Follow other users to see their offers!</Text>
          </View>
        }
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