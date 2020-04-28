import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, Platform, Image, FlatList, TouchableHighlight, ScrollView } from "react-native";
import { List, ListItem, Divider } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import _ from 'lodash';
import { contains } from "/Users/meganyap/Desktop/ReShare/ReShare/index.js"
import { AsyncStorage } from "react-native"

import { db } from '../config';
let offersRef = db.ref('/offers');

class Categories extends Component{

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

  componentDidMount() {
    let mounted = true;
    if(mounted){
    }
    return () => mounted = false;
  }
  
  selectCategory(item)
  {
    AsyncStorage.setItem('searchQuery', '')
    AsyncStorage.setItem('categoryFilterState',
    JSON.stringify(item.key));
    AsyncStorage.setItem('locationFilterState',
    JSON.stringify(""));
    AsyncStorage.setItem('sortState',
    JSON.stringify("Recent"));
    this.props.navigation.navigate('SearchResults')
  }

  renderImage(img) {
    switch (img) {
      case 'Appliances':
          return (<Image style = {{width: 120, height: 100}}source={require('../icons/appliances.png')}/> );
      case 'Babies & Kids':
        return (<Image style = {{width: 120, height: 100}}source={require('../icons/babiesandkids.png')}/> );
      case 'Books':
        return (<Image style = {{width: 120, height: 100}}source={require('../icons/books.png')}/> );
      case 'Clothing':
        return (<Image style = {{width: 120, height: 100}}source={require('../icons/clothing.png')}/> );
      case 'Electronics':
        return (<Image style = {{width: 120, height: 100}}source={require('../icons/electronics.png')}/> );
      case 'Food':
        return (<Image style = {{width: 120, height: 100}}source={require('../icons/food.png')}/> );
      case 'Furniture':
        return (<Image style = {{width: 120, height: 100}}source={require('../icons/furniture.png')}/> );
      case 'Health':
        return (<Image style = {{width: 120, height: 100}}source={require('../icons/health.png')}/> );
      case 'Hobbies':
        return (<Image style = {{width: 120, height: 100}}source={require('../icons/hobbies.png')}/> );
      case 'Sports':
        return (<Image style = {{width: 120, height: 100}}source={require('../icons/sports.png')}/> );
      case 'Stationery':
        return (<Image style = {{width: 120, height: 100}}source={require('../icons/stationery.png')}/> );
      case 'Toys & Games':
        return (<Image style = {{width: 120, height: 100}}source={require('../icons/toysandgames.png')}/> );
      default:
          return (
              <Text>{'Null'}</Text>
          );
    }
  }

  render() {
    const { navigation } = this.props; 
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
            onPress={() => this.props.navigation.navigate('Home')}
            hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
            />
          <Text style={{marginHorizontal: 5, marginVertical: 15, fontWeight: 'bold', fontSize: 25}}>Categories</Text>
         </View>
            <FlatList
              scrollEnabled = {false}
              style = {styles.listStyle}
              data = {this.state.categories}
              contentContainerStyle={{alignSelf: 'flex-start'}}
              numColumns={this.state.categories.length / 4}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              renderItem = {({item} ) => (
                <View>
                  <TouchableHighlight style = {styles.categoryIconStyle} onPress={() => {this.selectCategory(item)}}>
                  {this.renderImage(item.key)}
                  </TouchableHighlight>

                  <TouchableHighlight style = {styles.categoryItemStyle} onPress={() => {this.selectCategory(item)}}>
                  <Text style={{width: 120, textAlign:'center'}}>
                    {item.key}
                  </Text>
                  </TouchableHighlight>
              </View>
              )}
            ></FlatList>
        </View>
      </SafeAreaView>
    ); 
  }
}
export default Categories;

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
  categoryItemStyle:
  {
    marginVertical: 10,
    marginRight: 5
  },
  categoryIconStyle:
  {
  }
});