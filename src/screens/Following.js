import React, { Component } from 'react';
import { View, Text, FlatList, TouchableHighlight } from 'react-native';
import firebase from 'firebase'
import _ from 'lodash';

import { db } from '../config';
let offersRef = db.ref('/offers');
import { byFollowed } from "/Users/meganyap/Desktop/ReShare/ReShare/index.js"
import OfferComponent from "../components/OfferComponent"
import { NavigationEvents } from 'react-navigation';

class Following extends Component {
  state = {
    offers: [],
    fullData: [],
    isFetching: false
  };

  getData = () => {
    // Gets the UIDs of the people that the current user is following
    db.ref('/users/' + firebase.auth().currentUser.uid + '/following').on('value', snapshot => {
      let data = snapshot.val();
      var following;
      if (data) {
        following = Object.values(data);
      }

      // Gets all the offers that have been published by the people the current user is following
      offersRef.on('value', snapshot => {
        let data = snapshot.val();
        if (data && following) {
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

  // Navigates to Offer, passing the appropriate parameters
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

  // Gets the data again
  onRefresh() {
    this.setState({ isFetching: true, }, () => { this.getData(); });
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
            // Renders a list of offers by the people the current user follows
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