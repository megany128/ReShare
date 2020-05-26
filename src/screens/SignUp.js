import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity} from 'react-native'
import firebase from 'firebase'
import { AsyncStorage } from "react-native"

export default class SignUp extends React.Component {
  state = { email: '', password: '', name: '', errorMessage: null }

  handleSignUp = () => {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((userCredentials)=>{
      console.log("created user")
        if(userCredentials.user){
          console.log("updating profile")
          userCredentials.user.updateProfile({
            displayName: this.state.name
          }).then((s)=> {
            AsyncStorage.setItem('userStatus', JSON.stringify('logged in'))
            console.log('handleSignUp')
            console.log(userCredentials.user)
            this.props.navigation.navigate('stackNavigator');
          })
        }
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>ReShare</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        
        <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Name/Organisation Name"
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
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>

        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2061',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#8FD5F5",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"#CFC8EF",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"#2C2061"
  },
  loginText:{
    color:"white",
    fontSize:11
  },
  signUpBtn:{
    width:"80%",
    backgroundColor:"#8FD5F5",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  signUpText:{
    color:"white"
  }
})