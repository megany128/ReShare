import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
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
    this.getData()
  }

  getData = () => {
    let mounted = true;
    if (mounted) {
      db.ref('messages').on('value', snapshot => {
        let data = snapshot.val();
        let chats = Object.values(data);
        // TO DO: GET ONLY CHATS WITH USER ID IN ID
        console.log('key: ' + this.getKey(0))

        const sortedChats = chats.sort(function (a, b) { return a.latestMessage.createdAt - b.latestMessage.createdAt });
        console.log(sortedChats)
        this.setState({ chats: sortedChats })
        this.setState({isFetching: false})
      });
    }
    return () => mounted = false;
  }

  getKey = (index) => {
    let key = 0;
    db.ref('/messages').on('value', snapshot => {
      let data = snapshot.val();
      if (data)
        key = Object.keys(data)[index]
    })
    return key
  }

  getUID = (index) => {
    let key = 0;
    db.ref('/messages').on('value', snapshot => {
      let data = snapshot.val();
      if (data)
        key = Object.keys(data)[index]
    })
    let UID = key.replace(firebase.auth().currentUser.uid, '')
    UID = UID.replace('_', '')
    return UID
  }

  getUserInfo = (uid) => {
    var ref = firebase.database().ref("users/" + uid);
    var name = ''
    ref.on('value', snapshot => {
      name = snapshot.child("name").val();
    })
    console.log(name)
    return name
  }

  onRefresh() {
    this.setState({ isFetching: true, }, () => { this.getData(); });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this.getData()} />
        <FlatList
          data={this.state.chats}
          keyExtractor={(item, index) => this.getUID(index)}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('MessageScreen', { id: this.getUID(index), name: this.getUserInfo(this.getUID(index)) })}
            >
              <List.Item
                title={this.getUserInfo(this.getUID(index))}
                description={item.latestMessage.text}
                titleNumberOfLines={1}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                descriptionNumberOfLines={1}
              />

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