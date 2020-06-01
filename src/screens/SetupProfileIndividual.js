import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, TouchableOpacity, Image, Dimensions } from 'react-native'
import firebase from 'firebase'
import { AsyncStorage } from "react-native"
import { db } from '../config'
import { Keyboard } from 'react-native'

import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import 'firebase/storage';
import uuid from 'react-native-uuid';

export default class SetupProfileIndividual extends React.Component {
    state = { bio: '', phoneNumber: '', imageUri: '' }

    setUpProfile = (bio, phoneNumber) => {
        console.log('setting up user profile')
        console.log(firebase.auth().currentUser.uid)
        console.log(bio)
        console.log(phoneNumber)
        db.ref('users/' + firebase.auth().currentUser.uid).update({
            bio: bio,
            phoneNumber: phoneNumber
        })
        AsyncStorage.setItem('profileSetUp', JSON.stringify('set up')),
            AsyncStorage.setItem('userStatus', JSON.stringify('logged in')),
            this.props.navigation.navigate('Home')
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <Text style={styles.setup}>Setup your profile</Text>
                    {this.state.errorMessage &&
                        <Text style={{ color: 'red' }}>
                            {this.state.errorMessage}
                        </Text>}

                    <View style={{ flexDirection: 'row', marginTop: 100, marginHorizontal: 35, marginBottom: 20 }}>
                        <Image
                            source={require('../icons/addpfp.png')}
                            style={{ width: 125, height: 125, borderRadius: 400 / 2 }}
                        />
                        <View style={{ flexDirection: 'column', marginLeft: 20, marginTop: 25 }}>
                            <Text style={styles.individual}>INDIVIDUAL</Text>
                            <Text style={styles.name}>{firebase.auth().currentUser.displayName}</Text>
                            <Text style={styles.email}>{firebase.auth().currentUser.email}</Text>
                        </View>
                    </View>

                    <View style={styles.bio}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Add a biography"
                            autoCapitalize="sentences"
                            autoCorrect={true}
                            onChangeText={bio => this.setState({ bio })}
                            value={this.state.bio}
                            multiline={true}
                            maxLength={150}
                            clearButtonMode='while-editing'
                        />
                    </View>

                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Phone number (optional)"
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={phoneNumber => this.setState({ phoneNumber })}
                            value={this.state.phoneNumber}
                            keyboardType={'phone-pad'}
                            textContentType='telephoneNumber'
                        />
                    </View>

                    <TouchableOpacity style={styles.signUpBtn} onPress={() => this.setUpProfile(this.state.bio, this.state.phoneNumber)}>
                        <Text style={styles.signUpText}>CONTINUE</Text>
                    </TouchableOpacity>

                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    setup: {
        fontWeight: "bold",
        fontSize: 30,
        color: "#2C2061",
        alignSelf: 'flex-start',
        marginLeft: 20,
        position: 'absolute',
        top: 40
    },
    inputView: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 25,
        marginBottom: 20,
        paddingLeft: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        alignSelf: 'center',
    },
    bio: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 25,
        height: 150,
        margin: 20,
        padding: 20,
        justifyContent: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        alignSelf: 'center',
    },
    inputText: {
        height: 50,
        color: "#2C2061"
    },
    signUpBtn: {
        width: "50%",
        backgroundColor: "#2C2061",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginTop: 50,
        alignSelf: 'center',
    },
    signUpText: {
        color: "#CFC8EF",
        fontWeight: 'bold',
        fontSize: 17
    },
    filterBtn:
    {
        borderRadius: 25,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        marginVertical: 20
    },
    pfp: {
        width: 120,
        height: 120,
        borderRadius: 60
    },
    individual: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#84DAC1'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#4b4c4c'
    },
    email: {
        marginTop: 10,
        fontSize: 16,
        color: '#a9a9a9'
    }
})