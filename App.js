// Imports the necessary navigators
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack'

// Imports the necessary icons and fonts
import Ion from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Imports the screens used
import Home from './src/screens/Home';
import Following from './src/screens/Following';
import Add from './src/screens/Add';
import Messages from './src/screens/Messages';
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
import UserProfile from './src/screens/UserProfile'
import MessageScreen from './src/screens/MessageScreen'
import Edit from './src/screens/Edit'

import React from 'react';

// Sets up the bottom tabs (Home, Following, Add, Messages, and Profile)
const MainTabs = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "HOME",
        labelStyle: { fontFamily: 'gilroy' },
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="home" color={tintColor} size={24} />
        ),
      }
    },
    Following: {
      screen: Following,
      navigationOptions: {
        tabBarLabel: "FOLLOWING",
        labelStyle: { fontFamily: 'gilroy' },
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
        ),
        ...TransitionPresets.ModalSlideFromBottomIOS
      }
    },
    Messages: {
      screen: Messages,
      navigationOptions: {
        tabBarLabel: "MESSAGES",
        labelStyle: { fontFamily: 'gilroy' },
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="message" color={tintColor} size={30} />
        )
      }
    },
    MyProfile: {
      screen: MyProfile,
      navigationOptions: {
        labelStyle: { fontFamily: 'gilroy' },
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

// Sets up the other screens that can be navigated to
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
        headerStyle: { backgroundColor: 'white' },
        headerBackTitle: 'Back',
        gestureEnabled: false,
        animationEnabled: false
      }
    },
    Offer: {
      screen: Offer,
      navigationOptions: {
        headerShown: false,
        headerBackTitle: 'Back',
        gestureEnabled: false
      }
    },
    SearchResults: {
      screen: SearchResults,
      navigationOptions: {
        headerShown: false,
        headerStyle: { backgroundColor: 'white' },
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
    UserProfile: {
      screen: UserProfile,
      navigationOptions: {
        headerShown: false,
        headerBackTitle: 'Back',
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }
    },
    MessageScreen: {
      screen: MessageScreen,
      navigationOptions: {
        headerShown: false,
        headerBackTitle: 'Back',
      }
    },
    Edit: {
      screen: Edit,
      navigationOptions: {
        headerShown: false,
        headerBackTitle: 'Back',
      }
    }
  },
  { initialRouteName: "Loading" }
)

// Exports the app
const AppContainer = createAppContainer(stackNavigator);
export default AppContainer