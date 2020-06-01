import {createAppContainer, createSwitchNavigator, SwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack'

import Ion from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Home from './src/screens/Home';
import Following from './src/screens/Following';
import Add from './src/screens/Add';
import Groups from './src/screens/Groups';
import MyProfile from './src/screens/MyProfile';
import Loading from './src/screens/Loading';
import SignUpIndividual from './src/screens/SignUpIndividual';
import SignUpOrganisation from './src/screens/SignUpOrganisation';
import SetupProfileIndividual from './src/screens/SetupProfileIndividual'
import SetupProfileOrganisation from './src/screens/SetupProfileOrganisation'
import Login from './src/screens/Login';
import Offer from './src/screens/Offer';  
import SearchResults from './src/screens/SearchResults'
import CategorySelector from './src/screens/CategorySelector'
import LocationSelector from './src/screens/LocationSelector'
import SortSelector from './src/screens/SortSelector'
import Categories from './src/screens/Categories'
import ChatScreen from './src/screens/ChatScreen'
import UserProfile from './src/screens/UserProfile'

import React, { Component } from 'react';

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
    MyProfile: {
      screen: MyProfile,
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
  const stackNavigator = createStackNavigator(
      { 
        Loading: {
          screen: Loading,
          navigationOptions: {
            headerShown: false,
            headerBackTitle: 'Back'
          }
        },
        SignUpIndividual: {
          screen: SignUpIndividual,
          navigationOptions: {
            headerShown: false,
            headerBackTitle: 'Back',
            animationEnabled: false,
            gestureEnabled: false
          },
        },
        SignUpOrganisation: {
          screen: SignUpOrganisation,
          navigationOptions: {
            headerShown: false,
            headerBackTitle: 'Back',
            animationEnabled: false,
            gestureEnabled: false
          }
        },
        SetupProfileIndividual: {
          screen: SetupProfileIndividual,
          navigationOptions: {
            headerShown: false,
            headerBackTitle: 'Back',
            animationEnabled: false,
            gestureEnabled: false
          }
        },
        SetupProfileOrganisation: {
          screen: SetupProfileOrganisation,
          navigationOptions: {
            headerShown: false,
            headerBackTitle: 'Back',
            animationEnabled: false,
            gestureEnabled: false
          }
        },
        Login: {
          screen: Login,
          navigationOptions: {
            headerShown: false,
            headerBackTitle: 'Back',
            animationEnabled: false,
            gestureEnabled: false
          }
        },
        MainTabs: {
          screen: MainTabs,
          navigationOptions: {
            headerShown: false,
            headerStyle: { backgroundColor: 'white'},
            headerBackTitle: 'Back',
            gestureEnabled: false
        }
        },
        Offer: {
          screen: Offer,
          navigationOptions: {
            headerShown: false,
            headerBackTitle: 'Back'
          }
        },
        SearchResults: {
          screen: SearchResults,
          navigationOptions: {
            headerShown: false,
            headerStyle: { backgroundColor: 'white'},
            headerBackTitle: 'Back'
          }
        },
        CategorySelector: {
          screen: CategorySelector,
          navigationOptions: {
            headerShown: false,
            headerBackTitle: 'Back'
          }
        },
        LocationSelector: {
          screen: LocationSelector,
          navigationOptions: {
            headerShown: false,
            headerBackTitle: 'Back'
          }
        },
        SortSelector: {
          screen: SortSelector,
          navigationOptions: {
            headerShown: false,
            headerBackTitle: 'Back'
          }
        },
        Categories: {
          screen: Categories,
          navigationOptions: {
            headerShown: false,
            headerBackTitle: 'Back'
          }
        },
        ChatScreen: {
          screen: ChatScreen,
          navigationOptions: {
            headerShown: false,
            headerBackTitle: 'Back'
          }
        },
        UserProfile: {
          screen: UserProfile,
            navigationOptions: {
              headerShown: false,
              headerBackTitle: 'Back'
            }
        }
      },
      { initialRouteName: "Loading"}
  )

const App = createAppContainer(stackNavigator);
export default App;