import React, { Component } from 'react';
import { View, Button, Text, StyleSheet, Image, SafeAreaView, Dimensions, FlatList, TouchableHighlight, TouchableOpacity } from 'react-native';
import firebase from 'firebase'
import { AsyncStorage } from "react-native"
import _ from 'lodash';

import { db } from '../config';
let offersRef = db.ref('/offers');

import { byAuthor } from "/Users/meganyap/Desktop/ReShare/ReShare/index.js"
import OfferComponent from "../components/OfferComponent"
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default class UserProfile extends React.Component {
    state = {
        uid: '',
        name: '',
        type: '',
        offers: [],
        fullData: [],
        bio: '',
        category: '',
        followed: ''
    }
    componentDidMount() {
        let mounted = true;
        if (mounted) {
            const { navigation } = this.props;
            const uid = navigation.getParam('uid', 'uid');
            this.setState({ uid })
            console.log('uid: ' + uid)

            offersRef.on('value', snapshot => {
                let data = snapshot.val();
                if (data) {
                    let fullData = Object.values(data);
                    this.setState({ fullData })

                    let offers = _.filter(fullData, offer => {
                        return byAuthor(offer, uid)
                    });

                    this.setState({ offers });
                }
            });

            var ref = firebase.database().ref("users/" + uid);
            ref.once("value")
                .then((snapshot) => {
                    const name = snapshot.child("name").val();
                    console.log('name: ' + name)
                    this.setState({ name: name })

                    const type = snapshot.child("type").val();
                    console.log('type of account: ' + type)
                    this.setState({ type: type })

                    const category = snapshot.child("category").val();
                    console.log('category: ' + category)
                    this.setState({ category: category })

                    const bio = snapshot.child("bio").val();
                    console.log('bio: ' + bio)
                    if (bio) this.setState({ bio: bio })
                    else this.setState({ bio: 'This user has no biography' })
                });

            db.ref('/users/' + firebase.auth().currentUser.uid + '/following').on('value', snapshot => {
                let data = snapshot.val();
                let following = Object.values(data);
                console.log('following: ' + following)

                if (following && this.checkIfFollowing(following, uid)) {
                    this.setState({ followed: "followed" })
                    console.log('followed')
                }
                else {
                    this.setState({ followed: "not following" })
                    console.log('not following')
                }


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
        const uid = this.state.uid
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <SafeAreaView style={[this.state.type === 'individual' ? styles.individualProfile : styles.organisationProfile, { flexDirection: 'column', height: 250 }]}>
                    <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()} hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
                        <Icon
                            name="ios-arrow-back"
                            color='white'
                            size={30}
                            style={{ transform: [{ rotate: '270deg' }], alignSelf: 'center' }}
                        />
                    </TouchableWithoutFeedback>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Image
                                source={require('../icons/exampleOfferImg.jpeg')}
                                style={[styles.inProfile, { width: 125, height: 125, borderRadius: 400 / 2 }]}
                            />

                            {this.state.followed === "followed" ? (
                                <TouchableOpacity onPress={() => this.unfollowUser(uid)} style={[styles.followBtn, { backgroundColor: '#2C2061', borderColor: '#2C2061', width: 120 }]}>
                                    <Text style={{ color: "white", textTransform: 'uppercase' }}>
                                        ✓ FOLLOWED
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                    <TouchableOpacity onPress={() => this.followUser(uid)} style={[styles.followBtn, { borderColor: '#2C2061', width: 100 }]}>
                                        <Text style={{ color: '#2C2061' }}>
                                            + FOLLOW
                                    </Text>
                                    </TouchableOpacity>
                                )}
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.displayName}>{this.state.name}</Text>
                            {this.state.type === 'organisation' ?
                                <Text style={{ color: 'white', marginVertical: 5 }}>Category: {this.state.category}</Text>
                                :
                                <Text> </Text>
                            }
                            <View style={{ flexDirection: 'row', width: Dimensions.get('window').width * 0.55 }}>
                                <Text style={styles.biography}>{this.state.bio}</Text>
                            </View>
                            <Text style={{ position: 'absolute', right: 0, bottom: 0, textAlign: 'right', color: 'white', fontSize: 18, textTransform: 'uppercase' }}>{this.state.type}</Text>
                        </View>
                    </View>
                </SafeAreaView>

                <View>
                    <Text style={{ marginHorizontal: 20, marginTop: 15, fontWeight: 'bold', fontSize: 25 }}>{this.state.name}'s Listings</Text>
                </View>
            </View>
        )
    }

    followUser = (uid) => {
        let mounted = true;
        if (mounted) {
            this.setState({ followed: "followed" })
            db.ref('users/' + firebase.auth().currentUser.uid + '/following/' + uid).set({
                uid: uid
            })
        }
        return () => mounted = false;
    }

    unfollowUser = (uid) => {
        let mounted = true;
        if (mounted) {
            this.setState({ followed: "not followed" })
            db.ref('users/' + firebase.auth().currentUser.uid + '/following/' + uid).remove()
        }
        return () => mounted = false;
    }

    // Standard linear search algorithm
    checkIfFollowing = (arr, uid) => {
        let mounted = true;
        if (mounted) {
            for (var i = 0; i < arr.length; i++) {
                console.log(arr[i].uid)
                if (arr[i].uid === uid) {
                    return true
                }
            }
            return false
        }
        return () => mounted = false;
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
    individualProfile: {
        height: Dimensions.get('window').height * 0.25,
        width: '100%',
        backgroundColor: "#84DAC1",
        flexDirection: 'row'
    },
    organisationProfile: {
        height: Dimensions.get('window').height * 0.25,
        width: '100%',
        backgroundColor: "#F288AF",
        flexDirection: 'row'
    },
    inProfile: {
        marginHorizontal: 20
    },
    displayName: {
        marginTop: 10,
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
    },
    followBtn:
    {
        borderRadius: 25,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 0,
        borderWidth: 1,
        height: 28,
        alignSelf: 'center',
        marginTop: 10
    },
});