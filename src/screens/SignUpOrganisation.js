import React from 'react'
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
import { AsyncStorage } from "react-native"
import { db } from '../config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class SignUpOrganisation extends React.Component {
  state = { email: '', password: '', name: '', errorMessage: null }

  componentDidMount = () => {
    AsyncStorage.setItem('profileSetUp', JSON.stringify('not set up'))
  }

  // Creates an account in Firebase Authentication with the user's email and password
  handleSignUp = () => {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredentials) => {
        this.addUser(this.state.name, userCredentials.user.uid)
        console.log("created user")

        // Adds a display name
        if (userCredentials.user) {
          console.log("updating profile")
          userCredentials.user.updateProfile({
            displayName: this.state.name
          }).then((s) => {
            console.log('handleSignUp')
            console.log(userCredentials.user)

            // Navigates to the profile setup page to add more details
            this.props.navigation.navigate('SetupProfileOrganisation');
          })
        }
      })
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  // Adds an entry for the user in Firebase Database (instead of Firebase Authentication) to add other details
  addUser(name, uid) {
    console.log('adding user to db')
    db.ref('users/' + uid).set({
      name: name,
      type: 'organisation',
      bio: '',
      phoneNumber: '',
      category: '',
      following: ''
    })
  };

  render() {
    return (
      <KeyboardAwareScrollView
        style={{ backgroundColor: 'white' }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        scrollEnabled={false}
      >
        <Image style={{ width: 192, height: 160 }} source={require('../icons/signup.png')} />
        <Text style={styles.logo}>Sign up</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}

        <View style={{ flexDirection: 'row', marginLeft: 0, alignItems: 'flex-start' }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUpIndividual')} style={[styles.filterBtn, { backgroundColor: 'white', borderColor: '#84DAC1', width: 150 }]}>
            <Text style={{ color: "#84DAC1", textTransform: "uppercase", fontWeight: 'bold' }}>
              INDIVIDUAL
                </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.filterBtn, { backgroundColor: '#F288AF', borderColor: '#F288AF', width: 150, marginLeft: 30 }]}>
            <Text style={{ color: "white", textTransform: "uppercase", fontWeight: 'bold' }}>
              ORGANISATION
              </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ marginBottom: 15, alignSelf: 'center', color: '#6C63FF', fontWeight: 'bold' }}>Organisations can donate and receive resources</Text>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Organisation name"
            autoCapitalize="words"
            autoCorrect={true}
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            keyboardType={'email-address'}
          />
        </View>


        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
        </View>

        <TouchableOpacity style={styles.signUpBtn} onPress={this.handleSignUp}>
          <Text style={styles.signUpText}>SIGN UP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.loginText}>Already have an account? Login here</Text>
        </TouchableOpacity>


      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    fontWeight: "bold",
    fontSize: 40,
    color: "#2C2061",
    alignSelf: 'flex-start',
    marginLeft: 45
  },
  inputView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.2,
    shadowRadius: 3.84
  },
  inputText: {
    height: 50,
    color: "#2C2061"
  },
  loginText: {
    color: "#6C63FF",
    fontSize: 15,
    marginTop: 20
  },
  signUpBtn: {
    width: "50%",
    backgroundColor: "#2C2061",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10
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
  }
})