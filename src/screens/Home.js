import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, Image, FlatList, TouchableHighlight, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import _ from 'lodash';
import { AsyncStorage } from "react-native"
import OfferComponent from "../components/OfferComponent"
import { NavigationEvents } from 'react-navigation';

import { db } from '../config';
let offersRef = db.ref('/offers');

class Home extends React.Component {
  state = {
    offers: [],
    key: '',
    fullData: [],
    query: "",
    categories: [
      { key: 'Appliances' },
      { key: 'Babies & Kids' },
      { key: 'Books' },
      { key: 'Clothing' },
      { key: 'Electronics' },
      { key: 'Food' },
      { key: 'Furniture' },
      { key: 'Health' },
      { key: 'Hobbies' },
      { key: 'Sports' },
      { key: 'Stationery' },
      { key: 'Toys & Games' },
    ],
    isFetching: false
  };

  // Gets the data again
  onRefresh() {
    let mounted = true;
    if (mounted) {
      console.log('refreshing')
      this.setState({ isFetching: true, }, () => { this.getData(); });
    }
    return () => mounted = false;
  }

  // Renders the search bar and categories as a header
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
                shadowOpacity: 0.2,
              }}
            >
              <Icon name="ios-search" color="grey" size={20} style={{ marginRight: 10 }} />
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="Search offers"
                placeholderTextColor="grey"
                style={{ flex: 1, fontWeight: "700", backgroundColor: "white" }}
                onSubmitEditing={text => this.handleSearch(text.nativeEvent.text)}
                clearButtonMode={'while-editing'}
              />
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ marginTop: 15, fontWeight: 'bold', fontSize: 25, marginLeft: 10 }}>Categories</Text>
          <Text style={{ marginHorizontal: 5, marginTop: 30, fontSize: 12, textAlign: 'right', width: 230, color: 'grey' }} onPress={() => { this.props.navigation.navigate('Categories') }}>See all </Text>
        </View>
        <View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <FlatList
              scrollEnabled={false}
              style={styles.categoryStyle}
              data={this.state.categories}
              contentContainerStyle={{ alignSelf: 'flex-start' }}
              numColumns={this.state.categories.length / 2}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View>
                  <TouchableHighlight style={styles.categoryIconStyle} onPress={() => { this.selectCategory(item) }}>
                    {this.renderImage(item.key)}
                  </TouchableHighlight>

                  <TouchableHighlight style={styles.categoryItemStyle} onPress={() => { this.selectCategory(item) }}>
                    <Text style={{ width: 120, textAlign: 'center' }}>
                      {item.key}
                    </Text>
                  </TouchableHighlight>
                </View>
              )}
            ></FlatList>
          </ScrollView>
        </View>
        <Text style={{ marginHorizontal: 10, marginTop: 15, fontWeight: 'bold', fontSize: 25 }}>Recent Offers</Text>
      </SafeAreaView>
    )
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE"
        }}
      />
    );
  };

  componentDidMount() {
    let mounted = true;
    if (mounted) {
      this.forceUpdate()
      this.getData()
      this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
          this.getData();
        }
      );
    }
    return () => mounted = false;
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  getData = () => {
    let mounted = true;
    if (mounted) {
      AsyncStorage.setItem('imageLoaded', 'loaded')
      // Gets all the offers in Firebase
      offersRef.on('value', snapshot => {
        let data = snapshot.val();
        if (data) {
          let offers = Object.values(data);
          let fullData = Object.values(data);
          this.setState({ offers });
          this.setState({ fullData })

          // Sorts the offers based on how recently they were published
          const sortedOffers = offers.sort(function (a, b) { return b.time - a.time });
          this.setState({ offers: sortedOffers })
          this.setState({ isFetching: false })

          this.forceUpdate()
        }
      });
    }
    return () => mounted = false;
  }

  // Gets the key of the offer and passes it to the screen Offer along with the other characteristics of the offer
  pressRow(item, index) {
    console.log('key:' + this.getKey(index))
    console.log('index: ' + index)
    const key = this.getKey(index)
    this.props.navigation.navigate('Offer', {
      name: item.name,
      key: key,
      uid: item.author,
      description: item.description,
      category: item.category,
      expiry: item.expiry,
      location: item.location,
      time: item.time,
      imageID: item.id
    })
  }

  // Clears the search query and location filter and sets the category filter to the one selected
  // Sets the sort to the default (recent) and navigates to SearchResults to show the results of that category filter
  selectCategory(item) {
    AsyncStorage.setItem('searchQuery', '')
    AsyncStorage.setItem('categoryFilterState', JSON.stringify(item.key));
    AsyncStorage.setItem('locationFilterState', JSON.stringify(""));
    AsyncStorage.setItem('sortState', JSON.stringify("Recent"));

    this.props.navigation.navigate('SearchResults')
  }

  // Sets the search query to the text in the search bar and navigates to SearchResults
  // Clears the filters and automatically sets the sort to Recent
  handleSearch = text => {
    console.log('Search query: ' + text)
    AsyncStorage.setItem('searchQuery', JSON.stringify(text))
    AsyncStorage.setItem('categoryFilterState', JSON.stringify(""));
    AsyncStorage.setItem('locationFilterState', JSON.stringify(""));
    AsyncStorage.setItem('sortState', JSON.stringify("Recent"));

    this.props.navigation.navigate('SearchResults')
  }

  // Renders the correct icon based on the category
  renderImage(img) {
    switch (img) {
      case 'Appliances':
        return (<Image style={{ width: 120, height: 100 }} source={require('../icons/appliances.png')} />);
      case 'Babies & Kids':
        return (<Image style={{ width: 120, height: 100 }} source={require('../icons/babiesandkids.png')} />);
      case 'Books':
        return (<Image style={{ width: 120, height: 100 }} source={require('../icons/books.png')} />);
      case 'Clothing':
        return (<Image style={{ width: 120, height: 100 }} source={require('../icons/clothing.png')} />);
      case 'Electronics':
        return (<Image style={{ width: 120, height: 100 }} source={require('../icons/electronics.png')} />);
      case 'Food':
        return (<Image style={{ width: 120, height: 100 }} source={require('../icons/food.png')} />);
      case 'Furniture':
        return (<Image style={{ width: 120, height: 100 }} source={require('../icons/furniture.png')} />);
      case 'Health':
        return (<Image style={{ width: 120, height: 100 }} source={require('../icons/health.png')} />);
      case 'Hobbies':
        return (<Image style={{ width: 120, height: 100 }} source={require('../icons/hobbies.png')} />);
      case 'Sports':
        return (<Image style={{ width: 120, height: 100 }} source={require('../icons/sports.png')} />);
      case 'Stationery':
        return (<Image style={{ width: 120, height: 100 }} source={require('../icons/stationery.png')} />);
      case 'Toys & Games':
        return (<Image style={{ width: 120, height: 100 }} source={require('../icons/toysandgames.png')} />);
      default:
        return (
          <Text>{'Null'}</Text>
        );
    }
  }

  // Gets the key of an offer at a certain index in the list of offers
  getKey = (index) => {
    let key = 0;
    offersRef.on('value', snapshot => {
      let data = snapshot.val();
      if (data) {
        const sortedOffers = Object.keys(data).reverse()
        key = sortedOffers[index]
      }
    })
    console.log('key:' + key)
    return key
  }

  // Renders the list of offers
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <NavigationEvents onDidFocus={() => this.getData()} />
        {this.state.offers[0] ? (
          <View style={{ marginLeft: 20 }, [styles.flex, styles.column]}>
            <View style={[styles.column]}>
              <FlatList
                numColumns={2}
                showsVerticalScrollIndicator={false}
                pagingEnabled={true}
                scrollEnabled={true}
                scrollEventThrottle={16}
                snapToAlignment="center"
                style={styles.listStyle}
                data={this.state.offers}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableHighlight style={styles.listItemStyle} onPress={() => { this.pressRow(item, index) }}>
                    <OfferComponent
                      item={this.state.offers[index]}
                    />
                  </TouchableHighlight>
                )}
                ListHeaderComponent={this.renderHeader}
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFetching}
              />
            </View>
          </View>
        ) : (
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
                      clearButtonMode={'while-editing'}
                    />
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                <Text style={{ marginHorizontal: 10, marginTop: 15, fontWeight: 'bold', fontSize: 25 }}>Categories</Text>
                <Text style={{ marginHorizontal: 5, marginTop: 30, fontSize: 12, textAlign: 'right', width: 230, color: 'grey' }} onPress={() => { this.props.navigation.navigate('Categories') }}>See all</Text>
              </View>
              <View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  <FlatList
                    scrollEnabled={false}
                    style={styles.categoryStyle}
                    data={this.state.categories}
                    contentContainerStyle={{ alignSelf: 'flex-start' }}
                    numColumns={this.state.categories.length / 2}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View>
                        <TouchableHighlight style={styles.categoryIconStyle} onPress={() => { this.selectCategory(item) }}>
                          {this.renderImage(item.key)}
                        </TouchableHighlight>

                        <TouchableHighlight style={styles.categoryItemStyle} onPress={() => { this.selectCategory(item) }}>
                          <Text style={{ width: 120, textAlign: 'center' }}>
                            {item.key}
                          </Text>
                        </TouchableHighlight>
                      </View>
                    )}
                  ></FlatList>
                </ScrollView>
              </View>
              <Text style={{ marginHorizontal: 10, marginTop: 15, fontWeight: 'bold', fontSize: 25 }}>Recent Offers</Text>
              <Text style={{ marginVertical: 20, marginHorizontal: 20 }}>No offers</Text>
            </SafeAreaView>
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
    marginVertical: 10,
    marginHorizontal: 5
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