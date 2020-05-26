import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, Platform, Image, FlatList, TouchableHighlight, ScrollView, Dimensions } from "react-native";
import { List, ListItem, Divider } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import _ from 'lodash';
import { contains } from "/Users/meganyap/Desktop/ReShare/ReShare/index.js"
import { AsyncStorage } from "react-native"
import OfferComponent from "../components/OfferComponent"
const { height, width } = Dimensions.get("window");
//import firestore from '@react-native-firebase/firestore';

import { db } from '../config';
let offersRef = db.ref('/offers');

class Home extends Component{

  state = {
    offers: [],
    fullData: [],
    currentUser: null,
    query: "",
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

  renderHeader = () => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 0 }}>
        <View
           style={{
             backgroundColor: "white",
             height: 80,
             borderBottomWidth: 1,
             borderBottomColor: "#dddddd"
           }}
         >
           <View
             style={{
               flexDirection: "row",
               padding: 10,
               backgroundColor: "white",
               marginHorizontal: 20,
               marginVertical: 10,
               shadowOffset: { width: 0, height: 0 },
               shadowColor: "black",
               shadowOpacity: 0.2
             }}
           >
             <Icon name="ios-search" color="grey" size={20} style={{ marginRight: 10 }} />
             <TextInput
               underlineColorAndroid="transparent"
               placeholder="Search offers"
               placeholderTextColor="grey"
               style={{ flex: 1, fontWeight: "700", backgroundColor: "white" }}
               onSubmitEditing={text => this.handleSearch(text.nativeEvent.text)}
               clearButtonMode={ 'while-editing'}
             />
           </View>
         </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginHorizontal: 5, marginTop: 15, fontWeight: 'bold', fontSize: 25}}>Categories</Text>
          <Text style={{marginHorizontal: 5, marginTop: 30, fontSize: 12, textAlign:'right', width: 230, color: 'grey'}} onPress={() => {this.props.navigation.navigate('Categories')}}>See all ></Text>
        </View>
        <View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <FlatList
              scrollEnabled = {false}
              style = {styles.categoryStyle}
              data = {this.state.categories}
              contentContainerStyle={{alignSelf: 'flex-start'}}
              numColumns={this.state.categories.length / 2}
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
          </ScrollView>
        </View>
        <Text style={{marginHorizontal: 10, marginTop: 15, fontWeight: 'bold', fontSize: 25}}>Recent Offers</Text>
        </SafeAreaView>
        )
  }

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

        const sortedOffers = offers.sort(function(a, b) {return b.time - a.time});
          this.setState({ offers: sortedOffers })
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
      time: item.time,
      imageID: item.id,
      key: ''
    })
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
    console.log('Search query: ' + text)
    AsyncStorage.setItem('searchQuery', JSON.stringify(text))
    this.props.navigation.navigate('SearchResults')

    AsyncStorage.setItem('categoryFilterState',
    JSON.stringify(""));
    AsyncStorage.setItem('locationFilterState',
    JSON.stringify(""));
    AsyncStorage.setItem('sortState',
    JSON.stringify("Recent"));
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
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        {this.state.offers.length > 0 ? (
          <View style={[styles.flex, styles.column, styles.recommended]}>
          <View style={[styles.column]}>
            <FlatList
            numColumns = {2}
            showsVerticalScrollIndicator = {false}
            pagingEnabled = {true}
            scrollEnabled = {true}
            scrollEventThrottle = {16}
            snapToAlignment = "center"
            style = {styles.listStyle}
            data = {this.state.offers}
            renderItem = {({item} ) => (
              <TouchableHighlight style = {styles.listItemStyle} onPress={() => {this.pressRow(item)}}>
                <OfferComponent
                    item = {item}
                />
              </TouchableHighlight>
            ) }
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={this.renderHeader}
          />
          </View>
          </View>
        ) : (
          <Text style = {{marginVertical: 20, marginHorizontal: 10}}>No offers</Text>
        )}
      </SafeAreaView>
    ); 
  }
}
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listStyle:
  {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  categoryStyle:
  {
    marginVertical: 10
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
  flex: {
    flex: 1,
},
column: {
    flexDirection: 'column'
}
});