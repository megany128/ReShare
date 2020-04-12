import {createAppContainer, createSwitchNavigator, SwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Ion from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Home from './src/screens/Home';
import Following from './src/screens/Following';
import Add from './src/screens/Add';
import Groups from './src/screens/Groups';
import Profile from './src/screens/Profile';
import Loading from './src/screens/Loading';
import SignUp from './src/screens/SignUp';
import Login from './src/screens/Login';
import Offer from './src/screens/Offer';  
import SearchResults from './src/screens/SearchResults'


import React, {Component} from 'react';

const MainTabs = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "HOME",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="home" color={tintColor} size={24} />
        )
      }
    },
    Following: {
      screen: Following,
      navigationOptions: {
        tabBarLabel: "FOLLOWING",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name="user-friends" color={tintColor} size={24} />
        )
      }
    },
    Add: {
      screen: Add,
      navigationOptions: {
        tabBarLabel: () => null,
        tabBarIcon: () => (
          <Ion name="ios-add-circle" color="white" size={50} />
        )
      }
    },
    Groups: {
      screen: Groups,
      navigationOptions: {
        tabBarLabel: "GROUPS",
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="group-work" color={tintColor} size={30} />
        )
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: "PROFILE",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name="user-circle" color={tintColor} size={24} />
        )
      }
  },
},

{
  tabBarOptions: {
    activeTintColor: "white",
    inactiveTintColor: "#CFC8EF",
    style: {
      backgroundColor: "#2C2061",
      borderTopWidth: 0,
      shadowOffset: { width: 5, height: 3 },
      shadowColor: "black",
      shadowOpacity: 0.5,
      elevation: 5
    }
  }
},
);

const switchNavigator = createSwitchNavigator(
  { Loading, SignUp, Login, MainTabs, Offer, SearchResults},
  { initialRouteName: "Loading" }
  );

const App = createAppContainer(switchNavigator);
export default App;