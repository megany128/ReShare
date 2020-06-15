import React, { Component } from 'react';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { Header } from 'react-native-elements'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import firebase from 'firebase'

class MessageScreen extends Component {
    state = {
        messages: [],
        id: '',
        name: ''
    };

    componentDidMount = () => {
        this.getData()
    }

    getData = () => {
        let mounted = true;
        if (mounted) {
            // Gets the parameters passed on from Messages
            const { navigation } = this.props;
            const id = navigation.getParam('id', 'no id')
            const name = navigation.getParam('name', 'no name')
            console.log(name)
            this.setState({ name })

            // When a new message is sent, append it to GiftedChat and sort the messages by when they were sent
            const chatID = this.chatID(id)
            firebase.database().ref('messages').child(chatID)
                .on('child_added', (value) => {
                    if (value.key != 'latestMessage') {
                        console.log('NEW MESSAGE')
                        console.log('===========')
                        console.log('Message: ' + value.val().text)
                        console.log('Sent by: ' + JSON.stringify(value.val().user))
                        console.log('Sent at: ' + new Date(value.val().createdAt).toLocaleDateString("en-MY")+'\n')
                        this.setState(previousState => ({
                            messages: (GiftedChat.append(previousState.messages, value.val())).sort(function (a, b) { return b.createdAt - a.createdAt })
                        }))
                    }

                    // Sets the latestMessage to the new message
                    firebase.database().ref('messages').child(chatID).update({
                        latestMessage: value.val()
                    })
                })
        }
        return () => mounted = false;
    }

    // Sends the message that is passed as a parameter
    sendMessage = (message) => {
        if (message.length > 0) {
            const chatID = this.chatID(this.state.id)
            console.log('sending message')

            // Adds the message to messages/chatID
            firebase.database().ref('messages').child(chatID + '/' + (JSON.stringify(message[0]._id)).replace(/"/g, "")).set({
                _id: message[0]._id,
                createdAt: new Date().getTime(),
                text: message[0].text,
                user: message[0].user
            })
        }
    };

    // Creates a chatID by joining the current user's UID and the other user's UID
    chatID = () => {
        const chatterID = firebase.auth().currentUser.uid;
        const chateeID = this.props.navigation.getParam('id', 'no id');
        const chatIDpre = [];
        chatIDpre.push(chatterID);
        chatIDpre.push(chateeID);
        chatIDpre.sort();

        return chatIDpre.join('_');
    };

    // Renders the send icon
    renderSend(props) {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <Icon
                        name="send"
                        color='#6646ee'
                        size={32}
                        style={{ marginRight: 5 }}
                    />
                </View>
            </Send>
        );
    }

    // Renders the loading icon
    renderLoading() {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#6646ee' />
            </View>
        );
    }

    // Renders the messages and the header bar with the recipient's name
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Header
                    leftComponent={<Icon
                        name="arrow-left"
                        color='white'
                        size={25}
                        onPress={() => this.props.navigation.goBack()}
                    />}
                    centerComponent={<Text style={{ color: 'white' }} onPress={() => this.props.navigation.navigate('UserProfile', { uid: this.props.navigation.getParam('id', 'no id') })}>{this.state.name}</Text>}
                    containerStyle={{
                        backgroundColor: '#2C2061',
                        justifyContent: 'space-around',
                    }}
                />
                <GiftedChat
                    messages={this.state.messages}
                    onSend={newMessage => this.sendMessage(newMessage)}
                    user={{ _id: firebase.auth().currentUser.uid, name: firebase.auth().currentUser.displayName }}
                    renderSend={this.renderSend}
                    scrollToBottom
                    renderLoading={this.renderLoading}
                    onPressAvatar={() => this.props.navigation.navigate('UserProfile', { uid: this.props.navigation.getParam('id', 'no id') })}
                />
            </View>
        );
    }
}
export default MessageScreen

const styles = StyleSheet.create({
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    }
});