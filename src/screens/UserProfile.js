import React, { Component } from 'react';
import { View, Button, Text, StyleSheet, Image, SafeAreaView, Dimensions, FlatList, TouchableHighlight } from 'react-native';
import firebase from 'firebase'
import { AsyncStorage } from "react-native"
import _ from 'lodash';

import { db } from '../config';
let offersRef = db.ref('/offers');

import { byAuthor } from "/Users/meganyap/Desktop/ReShare/ReShare/index.js"
import OfferComponent from "../components/OfferComponent"

export default class UserProfile extends React.Component {
    state = {
        uid: '',
        name: '',
        type: '',
        offers: [],
        fullData: [],
        bio: ''
    }
    componentDidMount() {
        let mounted = true;
        if (mounted) {
            const { navigation } = this.props;
            const uid = navigation.getParam('uid', 'uid');
            this.setState({ uid })

            var ref = firebase.database().ref("users/" + uid);
            ref.once("value")
                .then((snapshot) => {
                    const name = snapshot.child("name").val();
                    console.log(name)
                    this.setState({ name: name })

                    const type = snapshot.child("type").val();
                    console.log(type)

                    const bio = snapshot.child("bio").val();
                    console.log(bio)
                    this.setState({ bio: bio })
                    if (type) this.setState({ type: type })
                    else this.setState({ bio: 'This user has no biography' })
                });
        }
        return () => mounted = false;

    }

    pressRow(item) {
        console.log(item)
        this.props.navigation.navigate('Offer', {
            name: item.name,
            uid: item.author,
            description: item.description,
            category: item.category,
            expiry: item.expiry,
            location: item.location,
            tags: item.tags,
            time: item.time,
            imageID: item.id
        })
    }

    renderHeader = () => {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <SafeAreaView style={styles.profile}>
                    <Image
                        source={require('../icons/exampleOfferImg.jpeg')}
                        style={[styles.inProfile, { width: 125, height: 125, borderRadius: 400 / 2 }]} />
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.displayName}>{this.state.name}</Text> 
                        <View style={{ flexDirection: 'row', width: Dimensions.get('window').width * 0.55 }}>
                            <Text style={styles.biography}>{this.state.bio}</Text>
                        </View>
                        <Text style={{position: 'absolute', right: 0, bottom: 10, textAlign: 'right'}}>{this.state.type}</Text>
                    </View>
                </SafeAreaView>
                <View>
                    <Text style={{ marginHorizontal: 20, marginTop: 15, fontWeight: 'bold', fontSize: 25 }}>{this.state.name}'s Listings</Text>
                </View>
            </View>
        )
    }

    render() {
        const { currentUser } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <FlatList
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    pagingEnabled={true}
                    scrollEnabled={true}
                    scrollEventThrottle={16}
                    snapToAlignment="center"
                    data={this.state.offers}
                    renderItem={({ item }) => (
                        <TouchableHighlight style={{ marginHorizontal: 10 }} onPress={() => { this.pressRow(item) }}>
                            <OfferComponent
                                item={item}
                            />
                        </TouchableHighlight>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={this.renderHeader}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profile: {
        height: Dimensions.get('window').height * 0.25,
        width: '100%',
        backgroundColor: "#84DAC1",
        flexDirection: 'row'
    },
    inProfile: {
        marginTop: 20,
        marginHorizontal: 20
    },
    displayName: {
        marginTop: 30,
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    biography: {
        marginTop: 5,
        marginLeft: 2,
        fontSize: 10,
        color: 'white',
        flex: 1,
        flexWrap: 'wrap'
    }
});