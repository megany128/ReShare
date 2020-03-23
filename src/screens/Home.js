import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, SafeAreaView, Platform, Image, FlatList, TouchableHighlight} from "react-native";
import { List, ListItem, Divider } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";

import { db } from '../config';
let offersRef = db.ref('/offers');

class Home extends Component{

  state = {
    offers: [],
    currentUser: null
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
        this.setState({ offers });
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

  render() {
    const { navigate } = this.props.navigation;
    const { currentUser } = this.state
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
             />
           </View>
         </View>
        </View>
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
    marginHorizontal: 10
  },
  listItemStyle:
  {
    marginVertical: 10
  }
});