import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Divider } from "react-native-elements";
import { db } from '../config';
import { List } from 'react-native-paper';
import firebase from 'firebase'
import { NavigationEvents } from 'react-navigation';

class Messages extends Component {
  state = {
    chats: [],
    isFetching: false
  }
  componentDidMount() {
    let mounted = true;
    if (mounted) {
      this.getData()
    }
    return () => mounted = false;
  }

  getData = () => {
    let mounted = true;
    if (mounted) {
      // Gets all the chats
      db.ref('messages').on('value', snapshot => {
        let data = snapshot.val();
        let chats = new Array();
        chats = Object.values(data);

        // Sorts the chats by the latest message sent
        if (chats.length > 1) {
          const sortedChats = chats.sort(function (a, b) { return b.latestMessage.createdAt - a.latestMessage.createdAt });
          this.setState({ chats: sortedChats })
        }
        this.setState({ isFetching: false })
      });
    }
    return () => mounted = false;
  }

  // Gets the key of an offer at a certain index in the list of offers
  getKey = (index) => {
    let key = 0;
    db.ref('/messages').on('value', snapshot => {
      let data = snapshot.val();
      if (data)
        key = Object.keys(data)[index]
    })
    return key
  }

  // Gets the UID of the other user in the conversation 
  getUID = (index) => {
    let key = this.getKey(index)
    let UID = key.replace(firebase.auth().currentUser.uid, '')
    UID = UID.replace('_', '')
    return UID
  }

  // Gets the name of the user with a certain UID
  getUserInfo = (uid) => {
    var ref = firebase.database().ref("users/" + uid);
    var name = ''
    ref.on('value', snapshot => {
      name = snapshot.child("name").val();
    })
    return name
  }

  // Refreshes the data
  onRefresh() {
    let mounted = true;
    if (mounted) {
      this.setState({ isFetching: true, }, () => { this.getData(); });
    }
    return () => mounted = false;
  }

  // Renders the chats
  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this.getData()} />
        <Text style={{ marginHorizontal: 20, marginTop: 20, fontWeight: 'bold', fontSize: 25 }}>Messages</Text>
        <FlatList
          style={{ marginHorizontal: 5 }}
          data={this.state.chats}
          keyExtractor={(item, index) => this.getUID(index)}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('MessageScreen', { id: this.getUID(index), name: this.getUserInfo(this.getUID(index)) })}
            >
              {this.getKey(index).includes(firebase.auth().currentUser.uid) ?
                (<List.Item
                  title={this.getUserInfo(this.getUID(index))}
                  description={this.state.chats[index].latestMessage.text}
                  titleNumberOfLines={1}
                  titleStyle={styles.listTitle}
                  descriptionStyle={styles.listDescription}
                  descriptionNumberOfLines={1}
                />) : (
                  <Text></Text>
                )
              }

            </TouchableOpacity>
          )}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
        />
      </View>
    );
  }
}
export default Messages;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    marginTop: 40
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  }
});