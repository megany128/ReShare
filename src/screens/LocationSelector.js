import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, Platform, Image, FlatList, TouchableHighlight, TouchableOpacity } from "react-native";
import { List, ListItem, Divider } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import _ from 'lodash';
import { contains } from "/Users/meganyap/Desktop/ReShare/ReShare/index.js"
import {Dimensions} from 'react-native';
import { AsyncStorage } from "react-native"

import { db } from '../config';
let offersRef = db.ref('/offers');

class LocationSelector extends Component{

  state = {
    locations: [
        {key: 'Johor'},
        {key: 'Kedah'},
        {key: 'Kelantan'},
        {key: 'KL/Selangor'},
        {key: 'Melaka'},
        {key: 'Negeri Sembilan'},
        {key: 'Pahang'},
        {key: 'Penang'},
        {key: 'Perak'},
        {key: 'Perlis'},
        {key: 'Sabah'},
        {key: 'Sarawak'},
        {key: 'Terengganu'},
    ],
    currentLocation: ""
  };

  renderSeparator = () => {
    return(
      <View
        style = {{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE"
        }}
     />
    );
  };

  componentDidMount() {
    let mounted = true;
    if(mounted){
        console.log('LocationSelector')
        try {
          AsyncStorage.getItem('locationFilterState').then(data => {
            if(data) {
              const currentLocation = JSON.parse(data);
              this.setState({ currentLocation })  
            }          
          });
        }
        catch(err){
          console.log('Failed to load current location')
        }
    }
    return () => mounted = false;
  }


  FlatListItemSeparator = () => <View style={styles.line} />;

  selectLocation(item) {
    console.log(item)
    AsyncStorage.setItem('locationFilterState',
    JSON.stringify(item));
    this.props.navigation.navigate("SearchResults")
  }

  clearFilter() {
    AsyncStorage.setItem('locationFilterState',
    JSON.stringify(""));
    this.props.navigation.navigate("SearchResults")
  }

  render() {
    const { currentUser } = this.state
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 0 }}>
        <View
           style={{
             flexDirection: "row",
             backgroundColor: "white",
             height: 70,
             borderBottomWidth: 1 ,
             borderBottomColor: "#dddddd",
           }}
         >
            <Icon
            name="ios-close"
            color='grey'
            size={40}
            style={{ marginHorizontal: 20, marginVertical: 10 }}
            onPress={() => this.props.navigation.navigate('SearchResults')}
            hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
            />
            <Text style={{marginHorizontal: 5, marginVertical: 15, fontWeight: 'bold', fontSize: 25}}>Location Selector</Text>
         </View>
         <FlatList
          style = {styles.listStyle}
          data = {this.state.locations}
          scrollEnabled = {false}
          renderItem = {({item} ) => (
            <TouchableHighlight style = {styles.listItemStyle} onPress={this.selectLocation.bind(this, item.key)}>
              {item.key === this.state.currentLocation ? (
                <Text style = {{fontWeight:"bold", fontSize: 15}}>
                  {item.key}
                  </Text>
              ) : (
                <Text style = {{fontSize: 15}}>
                  {item.key}
                </Text>   
              )}
            
            </TouchableHighlight>
          ) }
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
        <TouchableOpacity onPress={() => this.clearFilter()} style = {[styles.clearBtn]}>
                 <Text style = {{color: "white"}}>
                    CLEAR FILTER
                 </Text>
            </TouchableOpacity>
      </SafeAreaView>
    ); 
  }
}
export default LocationSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listStyle:
  {
    marginVertical: 10,
    marginHorizontal: 10
  },
  listItemStyle:
  {
    marginVertical: 10
  },
  clearBtn:
  {
    borderRadius:25,
    height: 40,
    alignItems:"center",
    justifyContent:"center",
    marginTop:0,
    marginBottom:15,
    marginTop: 30,
    marginLeft: 135,
    width: 150,
    backgroundColor: "#d3d3d3"
  },
  listStyle:
  {
    marginVertical: 10,
    marginHorizontal: 10
  },
  listItemStyle:
  {
    marginVertical: 10
  }
});