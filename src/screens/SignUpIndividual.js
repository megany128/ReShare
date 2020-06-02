import React from 'react'
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
import { AsyncStorage } from "react-native"
import { db } from '../config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class SignUpIndividual extends React.Component {
  state = { email: '', password: '', name: '', errorMessage: null }

  componentDidMount = () => {
    AsyncStorage.setItem('profileSetUp', JSON.stringify('not set up'))
  }

  handleSignUp = () => {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredentials) => {
        this.addUser(this.state.name, userCredentials.user.uid)
        console.log("created user")
        if (userCredentials.user) {
          console.log("updating profile")
          userCredentials.user.updateProfile({
            displayName: this.state.name
          }).then((s) => {
            console.log('handleSignUp')
            console.log(userCredentials.user)
            this.props.navigation.navigate('SetupProfileIndividual');
          })
        }
      })
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  addUser(name, uid) {
    console.log('adding user to db')
    db.ref('users/' + uid).set({
      name: name,
      type: 'individual',
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
          <TouchableOpacity style={[styles.filterBtn, { backgroundColor: '#84DAC1', borderColor: '#84DAC1', width: 150 }]}>
            <Text style={{ color: "white", textTransform: "uppercase", fontWeight: 'bold' }}>
              INDIVIDUAL
                </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUpOrganisation')} style={[styles.filterBtn, { backgroundColor: 'white', borderColor: '#F288AF', width: 150, marginLeft: 30 }]}>
            <Text style={{ color: "#F288AF", textTransform: "uppercase", fontWeight: 'bold' }}>
              ORGANISATION
              </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Name"
            autoCapitalize="words"
            autoCorrect={true}
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
            textContentType='name'
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
            textContentType='emailAddress'
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
            textContentType='newPassword'
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