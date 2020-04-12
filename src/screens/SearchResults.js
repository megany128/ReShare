import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, Platform, Image, FlatList, TouchableHighlight, TouchableOpacity } from "react-native";
import { List, ListItem, Divider } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import _ from 'lodash';
import { contains } from "/Users/meganyap/Desktop/ReShare/ReShare/index.js"
import {Dimensions} from 'react-native';

import { db } from '../config';
let offersRef = db.ref('/offers');

class SearchResults extends Component{

  state = {
    offers: [],
    fullData: [],
    currentUser: null,
    query: ""
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
      offersRef.on('value', snapshot => {
        let data = snapshot.val();
        let offers = Object.values(data);
        let fullData = Object.values(data);
        this.setState({ offers });
        this.setState({ fullData })

        const { navigation } = this.props;
        const query = navigation.getParam('query', 'no query');
        this.handleSearch(query)
      });
    }
    return () => mounted = false;
  }

  pressRow(item)
  {
    console.log(item)
    this.props.navigation.navigate('Offer',{
      name: item.name,
      author: item.author,
      description: item.description,
      category: item.category,
      expiry: item.expiry,
      location: item.location,
      tags: item.tags,
      time: item.time
    })
  }

  renderItem(item){
    return(
      <TouchableHighlight onPress={() => {this.pressRow(item)}}>
          <Text>
            {item.name}
          </Text>
      </TouchableHighlight>
    )
  }

  FlatListItemSeparator = () => <View style={styles.line} />;

  handleSearch = text => {
    console.log(text)
    const formattedQuery = text.toLowerCase();
    const offers = _.filter(this.state.fullData, offer => {
      return contains(offer, formattedQuery);
    });
    this.setState({ query: formattedQuery, offers })
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
           }}
         >
            <Icon
            name="ios-arrow-back"
            color='grey'
            size={20}
            style={{ marginHorizontal: 15, marginVertical: 20 }}
            onPress={() => this.props.navigation.navigate('Home')}
            hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
            />
        
           <View
             style={{
               flexDirection: "row",
               padding: 10,
               backgroundColor: "white",
               marginHorizontal: 20,
               marginVertical: 10,
               marginLeft: 10,
               shadowOffset: { width: 0, height: 0 },
               shadowColor: "black",
               shadowOpacity: 0.2,
               height: 40
             }}
           >
             <Icon name="ios-search" color="grey" size={20} style={{ marginRight: 10 }} />
             <TextInput
               underlineColorAndroid="transparent"
               placeholder="Search offers"
               placeholderTextColor="grey"
               style={{ flex: 0, fontWeight: "700", backgroundColor: "white", width: Dimensions.get('window').width - 120}}
               onSubmitEditing={text => this.handleSearch(text.nativeEvent.text)}
               clearButtonMode={ 'while-editing'}
             />
           </View>
         </View> 

         <View style = {{ borderBottomWidth: 1 , borderBottomColor: "#dddddd", flexDirection: 'row' }}>
             <TouchableOpacity style = {[styles.filterBtn, {borderColor: '#84DAC1', width: 120}]}>
                 <Text style = {{color: "#84DAC1"}}>
                    CATEGORY
                 </Text>
            </TouchableOpacity>
            <TouchableOpacity style = {[styles.filterBtn, {borderColor: '#8FD5F5', width: 120}]}>
                 <Text style = {{color: "#8FD5F5"}}>
                    LOCATION
                 </Text>
            </TouchableOpacity>
            <TouchableOpacity style = {[styles.filterBtn, {borderColor: '#F288AF', width: 100}]}>
                 <Text style = {{color: "#F288AF"}}>
                    SORT
                 </Text>
            </TouchableOpacity>
        </View>        
        
        </View>

        {this.state.offers.length > 0 ? (
          <FlatList
          style = {styles.listStyle}
          data = {this.state.offers}
          renderItem = {({item} ) => (
            <TouchableHighlight style = {styles.listItemStyle} onPress={() => {this.pressRow(item)}}>
            <Text>
              {item.name}
            </Text>
            </TouchableHighlight>
          ) }
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.renderSeparator}
        />
        ) : (
          <Text style = {{marginVertical: 20, marginHorizontal: 10}}>No offers</Text>
        )}
        
      </SafeAreaView>
    ); 
  }
}
export default SearchResults;

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
  filterBtn:
  {
    borderRadius:25,
    height: 40,
    alignItems:"center",
    justifyContent:"center",
    marginTop:0,
    marginBottom:15,
    marginLeft: 15,
    borderWidth: 1
  },
});