import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, Platform, Image, FlatList, TouchableHighlight, TouchableOpacity } from "react-native";
import { List, ListItem, Divider } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import _ from 'lodash';
import { contains } from "/Users/meganyap/Desktop/ReShare/ReShare/index.js"
import {Dimensions} from 'react-native';

import { db } from '../config';
let offersRef = db.ref('/offers');

class CategorySelector extends Component{

  state = {
    categories: [
        {key: 'Appliances'},
        {key: 'Babies & Kids'},
        {key: 'Books'},
        {key: 'Clothing'},
        {key: 'Electronics'},
        {key: 'Food'},
        {key: 'Furniture'},
        {key: 'Health'},
        {key: 'Hobbies'},
        {key: 'Sports'},
        {key: 'Stationery'},
        {key: 'Toys & Games'},
    ]
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
        console.log('CategorySelector')
    }
    return () => mounted = false;
  }


  FlatListItemSeparator = () => <View style={styles.line} />;

  selectCategory(item) {
    console.log(item)
    this.props.navigation.navigate('SearchResults',{
        category: item
      })
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
            onPress={() => this.props.navigation.navigate('SearchResults',{category: null})}
            hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
            />
            <Text style={{marginHorizontal: 5, marginVertical: 15, fontWeight: 'bold', fontSize: 25}}>Category Selector</Text>
         </View>
         <FlatList
          style = {styles.listStyle}
          data = {this.state.categories}
          renderItem = {({item} ) => (
            <TouchableHighlight style = {styles.listItemStyle} onPress={this.selectCategory.bind(this, item.key)}>
            <Text style = {{fontSize: 15}}>
              {item.key}
            </Text>
            </TouchableHighlight>
          ) }
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
      </SafeAreaView>
    ); 
  }
}
export default CategorySelector;

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