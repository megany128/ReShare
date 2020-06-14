import React from 'react'
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
import { AsyncStorage } from "react-native"

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }

  // Signs in to Firebase with the email and password the user inputs
  handleLogin = () => {
    const { email, password } = this.state
    firebase
      .auth().signInWithEmailAndPassword(email, password)
      .then(() => 
      console.log('logging in'),
      console.log(firebase.auth().currentUser.uid),
      AsyncStorage.setItem('userStatus', 'logged in'),
      AsyncStorage.setItem('profileSetUp', 'set up'),
      this.props.navigation.navigate('Home'))
      .catch(error => this.setState({ errorMessage: error.message }))
    console.log('handleLogin')
  }

  // Sends an email to the user to reset their password
  forgotPassword = () => {
    const { email } = this.state
    firebase.auth().sendPasswordResetEmail(email)
      .then(function (user) {
        alert('Please check your email...')
      }).catch(function (e) {
        alert('Please enter a valid email')
        console.log(e)
      })
  }

  render() {
    // Renders the login screen
    return (
      <View style={styles.container}>
        <Image style={{ width: 264, height: 220 }} source={require('../icons/login.png')} />
        <Text style={styles.logo}>Log in</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Email"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            keyboardType={'email-address'}
            autoCompleteType='email'
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            autoCompleteType='password'
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={this.handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.forgotPassword}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUpIndividual')}>
          <Text style={styles.signupText}>Don't have an account? Sign up here</Text>
        </TouchableOpacity>

      </View>
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
    marginLeft: 45,
    marginBottom: 20,
    marginTop: 20
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
  signupText: {
    color: "#6C63FF",
    fontSize: 15,
    marginTop: 20
  },
  forgot: {
    color: "grey",
    fontSize: 13,
    marginTop: 10
  },
  loginBtn: {
    width: "50%",
    backgroundColor: "#2C2061",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10
  },
  loginText: {
    color: "#CFC8EF",
    fontWeight: 'bold',
    fontSize: 17
  }
})
