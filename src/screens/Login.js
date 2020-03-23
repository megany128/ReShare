import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity} from 'react-native'
import firebase from 'firebase'

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }
  handleLogin = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('Home'))
      .catch(error => this.setState({ errorMessage: error.message }))
      console.log('handleLogin')
  }

  forgotPassword = () => {
    const { email} = this.state
    firebase.auth().sendPasswordResetEmail(email)
      .then(function (user) {
        alert('Please check your email...')
      }).catch(function (e) {
        alert('Please enter a valid email')
        console.log(e)
      })
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
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Email" 
          placeholderTextColor="#003f5c"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput  
          style={styles.inputText}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          placeholder="Password" 
          placeholderTextColor="#003f5c"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          />
        </View>

        <TouchableOpacity onPress={this.forgotPassword}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={this.handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
          <Text style={styles.loginText}>Signup</Text>
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
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#8FD5F5",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
})
