import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, Platform, Image, FlatList, TouchableHighlight, TouchableOpacity } from "react-native";
import { List, ListItem, Divider } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import _ from 'lodash';
import { contains, categoryFilter, locationFilter } from "/Users/meganyap/Desktop/ReShare/ReShare/index.js"
import { Dimensions } from 'react-native';
import { AsyncStorage } from "react-native"
import moment from "moment";
import OfferComponent from "../components/OfferComponent"
import { NavigationEvents } from 'react-navigation';

import { db } from '../config';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
let offersRef = db.ref('/offers');

class SearchResults extends Component{

  state = {
    offers: [],
    fullData: [],
    currentUser: null,
    query: "",
    category: "",
    location: "",
    currentSort: ""
  };

  getData = () => {
    offersRef.on('value', snapshot => {
      let data = snapshot.val();
      let offers = Object.values(data);
      let fullData = Object.values(data);
      this.setState({ offers });
      this.setState({ fullData })

      try {
        AsyncStorage.getItem('categoryFilterState').then(data => {
          if(data) {
            const category = JSON.parse(data);
            this.setState({ category })
            console.log(category)
          } 
        });
      }
      catch(err){
        console.log('Failed to load category filter')
      }

      try {
        AsyncStorage.getItem('locationFilterState').then(data => {
          if(data) {
            const location = JSON.parse(data);
            this.setState({ location })  
          }          
        });
      }
      catch(err){
        console.log('Failed to load location filter')
      }

      try {
        AsyncStorage.getItem('searchQuery').then(data => {
          if(data) {
            const query = JSON.parse(data);
            this.setState({ query })  
            this.handleSearch(this.state.query)
          }          
        });
      }
      catch(err){
        console.log('Failed to load search query')
      }

      try {
        AsyncStorage.getItem('sortState').then(data => {
          if(data) {
            const currentSort = JSON.parse(data);
            this.setState({ currentSort });
            if(this.state.currentSort === "Recent")
            {
              console.log('sorting by date')
              const offers = this.state.offers.sort(function(a, b) {return b.time - a.time});
              this.setState({ offers })
            }
            else if(this.state.currentSort === "Expiry")
            {
              console.log('sorting by expiry date')
              const offers = this.state.offers.sort(function(a, b) {return b.time - a.time});
              this.setState({ offers })
            }
          }          
        });
      }
      catch(err){
        console.log('Failed to load search query')
      }
    });
  }

  componentDidMount = () => {
      let mounted = true;
      if (mounted) {
        this.getData()
      }
      return () => mounted = false;
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

  FlatListItemSeparator = () => <View style={styles.line} />;

  handleSearch = text => {
    console.log(text)
    AsyncStorage.setItem('searchQuery', JSON.stringify(text))

    const offers = this.state.fullData
    console.log('refreshed offers')

    this.setState({ offers })
    const formattedQuery = text.toLowerCase();
    if (this.state.category != "" && this.state.location != "")
    {
      const searchedOffers = _.filter(this.state.fullData, offer => {
        return contains(offer, formattedQuery) && categoryFilter(offer, this.state.category) && locationFilter(offer,this.state.location)
      });
      this.setState({ offers: searchedOffers })
      console.log(this.state.offers)
      if (this.state.currentSort === "Recent")
        {
          console.log('sorting by date')
          const offers = searchedOffers.sort(function(a, b) {return b.time - a.time});
          console.log(offers)
          this.setState({ offers })
        }
      else if(this.state.currentSort === "Expiry")
      {
        console.log('sorting by expiry date')
        const offers = searchedOffers.sort(function(a, b) {return b.time - a.time});
        this.setState({ offers })
      }
    }
    else if (this.state.category != "")
    {
      const searchedOffers = _.filter(this.state.fullData, offer => {
        return contains(offer, formattedQuery) && categoryFilter(offer, this.state.category)
      });
      this.setState({ offers: searchedOffers })
      console.log(this.state.offers)

      if (this.state.currentSort === "Recent")
        {
          console.log('sorting by date')
          const offers = searchedOffers.sort(function(a, b) {return b.time - a.time});
          console.log(offers)
          this.setState({ offers })
        }
      else if(this.state.currentSort === "Expiry")
      {
        console.log('sorting by expiry date')
        const offers = searchedOffers.sort(function(a, b) {return b.time - a.time});
        this.setState({ offers })
      }
    }
    else if (this.state.location != "")
    {
      const searchedOffers = _.filter(this.state.fullData, offer => {
        return contains(offer, formattedQuery) && locationFilter(offer, this.state.location)
      });
      this.setState({ offers: searchedOffers })
      console.log(this.state.offers)

      if (this.state.currentSort === "Recent")
        {
          console.log('sorting by date')
          const offers = searchedOffers.sort(function(a, b) {return b.time - a.time});
          console.log(offers)
          this.setState({ offers })
        }
      else if(this.state.currentSort === "Expiry")
      {
        console.log('sorting by expiry date')
        const offers = searchedOffers.sort(function(a, b) {return b.time - a.time});
        this.setState({ offers })
      }
    }
    else 
    {
      const searchedOffers = _.filter(this.state.fullData, offer => {
        return contains(offer, formattedQuery)
      });
      this.setState({ offers: searchedOffers })
      console.log(this.state.offers)

      if (this.state.currentSort === "Recent")
        {
          console.log('sorting by date')
          const offers = searchedOffers.sort(function(a, b) {return b.time - a.time});
          console.log(offers)
          this.setState({ offers })
        }
      else if(this.state.currentSort === "Expiry")
      {
       console.log('sorting by expiry date')
        const offers = searchedOffers.sort(function(a, b) {return b.time - a.time});
        this.setState({ offers })
      }
    }
  } 

  selectCategory() {
    this.props.navigation.navigate('CategorySelector') 
    }

  selectLocation() {
    this.props.navigation.navigate('LocationSelector')
  }

  selectSort() {
    this.props.navigation.navigate('SortSelector')
  }

  render() {
    const { navigation } = this.props; 
    const query = navigation.getParam('query', 'no query');
    const { currentUser } = this.state
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <NavigationEvents onDidFocus={() => this.getData()} />
        <View style={{ flex: 0 }}>
        <View
           style={{
             flexDirection: "row",
             backgroundColor: "white",
             height: 70,
           }}
         >
           <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()} hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}>
              <Icon
              name="ios-arrow-back"
              color='grey'
              size={20}
              style={{ marginHorizontal: 15, marginVertical: 20 }}
              />
            </TouchableWithoutFeedback>
        
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
               defaultValue={this.state.query}
               style={{ flex: 0, fontWeight: "700", backgroundColor: "white", width: Dimensions.get('window').width - 120}}
               onSubmitEditing={text => this.handleSearch(text.nativeEvent.text)}
               clearButtonMode={ 'while-editing'}
             />
           </View>
         </View> 

         <View style = {{ borderBottomWidth: 1 , borderBottomColor: "#dddddd", flexDirection: 'row' }}>
            {this.state.category != "" ? (
                <TouchableOpacity onPress={() => this.selectCategory()} style = {[styles.filterBtn, {backgroundColor: '#84DAC1', borderColor: '#84DAC1', width: 120}]}>
                    <Text style = {{color: "white", textTransform: 'uppercase'}}>
                        {this.state.category}
                    </Text>
                 </TouchableOpacity>  
                 ) : (
                <TouchableOpacity onPress={() => this.selectCategory()} style = {[styles.filterBtn, {borderColor: '#84DAC1', width: 120}]}>
                    <Text style = {{color: '#84DAC1'}}>
                        CATEGORY
                    </Text>
                </TouchableOpacity>
            )}

            {this.state.location != "" ? (
                <TouchableOpacity onPress={() => this.selectLocation()} style = {[styles.filterBtn, {backgroundColor: '#8FD5F5', borderColor: '#8FD5F5', width: 120}]}>
                    <Text style = {{color: "white", textTransform: 'uppercase'}}>
                        {this.state.location}
                    </Text>
                 </TouchableOpacity>  
                 ) : (
                <TouchableOpacity onPress={() => this.selectLocation()} style = {[styles.filterBtn, {borderColor: '#8FD5F5', width: 120}]}>
                    <Text style = {{color: '#8FD5F5'}}>
                        LOCATION
                    </Text>
                </TouchableOpacity>
            )}
            
            {this.state.currentSort != "" ? (
              <TouchableOpacity onPress={() => this.selectSort()}style = {[styles.filterBtn, {backgroundColor: '#F288AF', borderColor: '#F288AF', width: 100}]}>
              <Text style = {{color: "white", textTransform: "uppercase"}}>
                 SORT: {this.state.currentSort}
              </Text>
         </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => this.selectSort()}style = {[styles.filterBtn, {borderColor: '#F288AF', width: 100}]}>
                 <Text style = {{color: "#F288AF"}}>
                    SORT
                 </Text>
            </TouchableOpacity>
            )
            }
            
        </View>        
        
        </View>

        {this.state.offers.length > 0 ? (
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
    marginHorizontal: 10,
    backgroundColor: 'white'
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