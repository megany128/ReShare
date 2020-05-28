import React, { Component } from 'react'
import { View, Text, KeyboardAvoidingView, TextInput, Animated, Keyboard, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableWithoutFeedback, FlatList } from 'react-native-gesture-handler';
import firebase from 'firebase'

const isIOS = Platform.OS === 'ios'

import { db } from '../config';

// Adapted from https://www.youtube.com/watch?v=omKU24SmBUM (date of retrieval: May 27)

export default class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            person: {
                id: props.navigation.getParam('id', 'no id'),
                name: props.navigation.getParam('author', 'no author')
            },
            message: '',
            messageList: []
        }
        this.keyboardHeight = new Animated.Value(0)
        this.bottomPadding = new Animated.Value(60)
    }

    componentDidMount = () => {
        console.log(this.state.person)
        this.keyboardShowListener = Keyboard.addListener(isIOS ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => this.keyboardEvent(e, true))
        this.keyboardHideListener = Keyboard.addListener(isIOS ? 'keyboardWillHide' : 'keyboardDidHide',
            (e) => this.keyboardEvent(e, false))
        firebase.database().ref('messages').child(firebase.auth().currentUser.uid).child(this.state.person.id)
            .on('child_added', (value) => {
                this.setState((prevState) => {
                    return {
                        messageList: [...prevState.messageList, value.val()]
                    }
                })
            })
    }

    keyboardEvent = (event, isShow) => {
        let heightOS = isIOS ? 0 : 80
        let bottomOS = isIOS ? 90 : 120
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: isShow ? heightOS : 0
            }),
            Animated.timing(this.bottomPadding, {
                duration: event.duration,
                toValue: isShow ? bottomOS : 60
            }),
        ]).start()
    }

    componentWillUnmount() {
        this.keyboardShowListener.remove()
        this.keyboardHideListener.remove()
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    sendMessage = async () => {
        if (this.state.message.length > 0) {
            let msgId = firebase.database().ref('messages').child(firebase.auth().currentUser.uid).child(this.state.person.id).push().key
            let updates = {};
            let message = {
                message: this.state.message,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: firebase.auth().currentUser.uid
            }
            updates['messages/' + firebase.auth().currentUser.uid + '/' + this.state.person.id + '/' + msgId] = message;
            updates['messages/' + this.state.person.id + '/' + firebase.auth().currentUser.uid + '/' + msgId] = message;
            firebase.database().ref().update(updates)
            this.setState({ message: '' })
        }
    }

    renderRow = ({ item }) => {
        return (
            <View style={{
                flexDirection: 'row',
                maxWidth: '60%',
                alignSelf: item.from === firebase.auth().currentUser.uid ? 'flex-end' : 'flex-start',
                backgroundColor: item.from === firebase.auth().currentUser.uid ? '#00897b' : '#7cb342',
                borderRadius: 5,
                marginBottom: 10
            }}>
                <Text style={{ color: '#fff', padding: 7, fontSize: 16 }}>
                    {item.message}
                </Text>
                <Text style={{ color: '#eee', padding: 3, fontSize: 12 }}>
                    {this.convertTime(item.time)}
                </Text>
            </View>
        )
    }

    convertTime = (time) => {
        let d = new Date(time)
        let c = new Date()
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':'
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()

        if (c.getDay() != d.getDay()) {
            result = d.getDay() + '' + d.getMonth() + '' + result
        }
        return result
    }

    render() {
        let { height } = Dimensions.get('window')
        return (
            <KeyboardAvoidingView behavior="height" style={{ flex: 1, backgroundColor: "white" }}>
                <View
                    style={{
                        flexDirection: "row",
                        backgroundColor: "white",
                        height: 70,
                        borderBottomWidth: 1,
                        borderBottomColor: "#dddddd",
                        marginTop: height * 0.03
                    }}>

                    <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()} hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
                        <Icon
                            name="ios-arrow-back"
                            color='grey'
                            size={20}
                            style={{ marginHorizontal: 15, marginVertical: 20 }}
                        />
                    </TouchableWithoutFeedback>
                    <Text style={{ marginHorizontal: 5, marginVertical: 15, fontWeight: 'bold', fontSize: 25 }}>{this.state.person.name}</Text>
                </View>

                <Animated.View style={[styles.bottomBar, { bottom: this.keyboardHeight }]}>
                    <TextInput
                        style={styles.inputMessage}
                        value={this.state.message}
                        placeholder="Type message..."
                        onChangeText={this.handleChange('message')}
                    />

                    <TouchableOpacity onPress={this.sendMessage} style={ styles.sendButton }>
                        <Icon
                            name="ios-send"
                            color='white'
                            size={25}
                            style={{ marginRight: 5 }}
                        />
                    </TouchableOpacity>
                </Animated.View>

                <FlatList
                    ref = {ref => this.flatList = ref}
                    onContentSizeChange = {() => this.flatList.scrollToEnd({animated: true})}
                    onLayout = {() => this.flatList.scrollToEnd({animated: true})}
                    style={{ paddingTop: 5, paddingHorizontal: 5, height }}
                    data={this.state.messageList}
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent = {<Animated.View style={{ height: this.bottomPadding }}/>}
                />
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '80%',
        marginBottom: 10,
        borderRadius: 5
    },
    inputMessage: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '85%',
        marginBottom: 10,
        borderRadius: 20
    },
    btnText: {
        color: 'darkblue',
        fontSize: 20
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: 60,
        backgroundColor: '#fff'
    },
    sendButton: {
        marginBottom: 10,
        marginLeft: 10,
        paddingTop: 8,
        paddingLeft: 5,
        backgroundColor: '#2C2061',
        borderRadius: 20,
        height: 40,
        width: 40,
        alignItems: 'center'
    }
})