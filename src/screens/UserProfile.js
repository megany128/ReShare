import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Dimensions, FlatList, TouchableHighlight, TouchableOpacity } from 'react-native';
import firebase from 'firebase'
import _ from 'lodash';

import { db } from '../config';
let offersRef = db.ref('/offers');

import { byAuthor } from "/Users/meganyap/Desktop/ReShare/ReShare/index.js"
import OfferComponent from "../components/OfferComponent"
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { AsyncStorage } from "react-native"

export default class UserProfile extends React.Component {
    state = {
        uid: '',
        name: '',
        type: '',
        offers: [],
        fullData: [],
        bio: '',
        category: '',
        followed: '',
        url: '../icons/exampleOfferImg.jpeg'
    }

    // Gets the profile picture of the current user
    getProfilePicture = () => {
        db.ref('/users').child(firebase.auth().currentUser.uid).once("value")
            .then((snapshot) => {
                console.log(snapshot)
                const imageID = snapshot.child('pfp').val();

                AsyncStorage.getItem('profileLoaded').then(data => {
                    if (data === 'loaded') {
                        const ref = firebase.storage().ref('profile/' + { imageID }.imageID + '.jpg');
                        this.getURL(ref)
                    }
                })
            });
    }

    // Gets the URL of the image ref
    getURL = async (ref) => {
        const url = await ref.getDownloadURL();
        this.setState({ url })
    }

    componentDidMount() {
        let mounted = true;
        if (mounted) {
            AsyncStorage.setItem('profileLoaded', 'loaded')

            // Gets the UID of the user whose profile we want to look at from props
            const { navigation } = this.props;
            const uid = navigation.getParam('uid', 'uid');
            this.setState({ uid })

            // Gets all the offers from Firebase
            offersRef.on('value', snapshot => {
                let data = snapshot.val();
                if (data) {
                    let fullData = Object.values(data);
                    this.setState({ fullData })

                    // Filters the offers and only returns those by the specified user
                    let offers = _.filter(fullData, offer => {
                        return byAuthor(offer, uid)
                    });

                    this.setState({ offers });
                }
            });

            // Gets the name, bio, type, and category of the user with the UID passed in
            var ref = firebase.database().ref("users/" + uid);
            ref.once("value")
                .then((snapshot) => {
                    const name = snapshot.child("name").val();
                    this.setState({ name: name })
                    console.log('You are viewing ' + name + '\'s profile')
                    console.log('======================================')

                    const type = snapshot.child("type").val();
                    this.setState({ type: type })
                    console.log('Type of account: ' + type)

                    const category = snapshot.child("category").val();
                    this.setState({ category: category })
                    if (category) console.log('Category of organisation: ' + category)

                    const bio = snapshot.child("bio").val();
                    console.log('Biography: ' + bio + '\n')
                    if (bio) this.setState({ bio: bio })
                    else this.setState({ bio: 'This user has no biography' })
                });

            // Checks if the current user is following the specified user
            db.ref('/users/' + firebase.auth().currentUser.uid + '/following').on('value', snapshot => {
                let data = snapshot.val();
                if (data) {
                    let following = Object.values(data);

                    if (following && this.checkIfFollowing(following, uid)) {
                        this.setState({ followed: "followed" })
                        console.log('You are following this user')
                    }
                    else {
                        this.setState({ followed: "not following" })
                        console.log('You are not following this user')
                    }
                }
                else {
                    this.setState({ followed: "not following" })
                    console.log('You are not following this user')
                }
            });

            this.getProfilePicture(uid)
        }
        return () => mounted = false;

    }

    // Gets the key of the offer and passes it to the screen Offer along with the other characteristics of the offer
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

    // Renders the profile header
    renderHeader = () => {
        let mounted = true;
        if (mounted) {
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
                                    source={{
                                        uri: this.state.url,
                                    }}
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
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.displayName}>{this.state.name}</Text>
                                    <Icon
                                        name="ios-chatboxes"
                                        color='white'
                                        size={25}
                                        style={{ position: 'absolute', right: 0, top: 10 }}
                                        onPress={() => this.props.navigation.navigate('MessageScreen', { id: this.state.uid, name: this.state.name })}
                                    />
                                </View>
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
        return () => mounted = false;
    }

    // Adds the specified user to the list of people the current user is following
    followUser = (uid) => {
        let mounted = true;
        if (mounted) {
            this.setState({ followed: "followed" })
            db.ref('users/' + firebase.auth().currentUser.uid + '/following/' + uid).set({
                uid: uid
            })
            console.log('\nYou are now following ' + this.state.name)
        }
        return () => mounted = false;
    }

    // Removes the specified user from the list of people the current user is following
    unfollowUser = (uid) => {
        let mounted = true;
        if (mounted) {
            this.setState({ followed: "not followed" })
            db.ref('users/' + firebase.auth().currentUser.uid + '/following/' + uid).remove()
            console.log('\nYou have unfollowed ' + this.state.name)
        }
        return () => mounted = false;
    }

    // Standard linear search algorithm
    // Checks every UID in the current user's following list to compare it with the specified user's UID
    checkIfFollowing = (arr, uid) => {
        let mounted = true;
        if (mounted) {
            arr = this.selectionSort(arr)
            this.binarySearch(arr, uid)
        }
        return () => mounted = false;
    }

    // Binary search
    binarySearch = (array, uid) => {
        let startIndex = 0;
        let endIndex = array.length - 1;
        while (startIndex <= endIndex) {
            let middleIndex = Math.floor((startIndex + endIndex) / 2);
            if (uid === array[middleIndex]) {
                return true
            }
            if (uid > array[middleIndex]) {
                console.log("Searching the right side of array")
                startIndex = middleIndex + 1;
            }
            if (uid < array[middleIndex]) {
                console.log("Searching the left side of array")
                endIndex = middleIndex - 1;
            }
            else {
                console.log("Not Found this loop iteration. Looping another iteration.")
            }
        }
        return false
    }

    // Selection sort
    selectionSort = (arr) => {
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            let min = i;
            for (let j = i + 1; j < len; j++) {
                if (arr[min] > arr[j]) {
                    min = j;
                }
            }
            if (min !== i) {
                let tmp = arr[i];
                arr[i] = arr[min];
                arr[min] = tmp;
            }
        }
        return arr;
    }

    // Renders the offers by the specified user
    render() {
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
        color: 'white',
        width: 240
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