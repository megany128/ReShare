import { Dimensions } from 'react-native'

// Adapted from https://github.com/nattatorn-dev/react-native-user-profile (date of retrieval: May 18)

export default {
  authorProfile: {
    width: 25,
    height: 25,
    borderRadius: 50,
    justifyContent: 'center',
  },
  authorText: {
    marginBottom: 4,
    color: 'grey',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 1,
    marginLeft: 10,
    justifyContent: 'center'
  },
  categoryText: {
    marginBottom: 4,
    color: 'grey',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  cardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  coverContainer: {
    position: 'relative',
  },
  coverImage: {
    height: Dimensions.get('window').width * (3 / 4),
    width: Dimensions.get('window').width,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  scroll: {
    backgroundColor: '#FFF',
    flex: 1,
    marginBottom: 55,
  },
  productRow: {
    marginHorizontal: 25,
  },
  mainviewStyle: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  coverMetaContainer: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'flex-end',
    // marginBottom: 15,
    // marginRight: 15,
  },
  footer: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2C2061',
    flexDirection: 'row',
    height: 65,
    alignItems: 'center',
  },
  buttonFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navigatorButton: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
  navigatorText: {
    color: 'green',
    fontWeight: 'bold',
    alignItems: 'flex-start',
    justifyContent: 'center',

    fontSize: 16,
  },
  borderCenter: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#FFA890',
  },
  textFooter: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 18,
  },
  priceText: {
    marginBottom: 5,
    letterSpacing: 1,

    color: 'black',
    fontSize: 36,
    fontWeight: '400',
  },
  detailText: {
    marginBottom: 4,
    color: 'grey',
    fontSize: 20
  },
  subDetailText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '100',
    lineHeight: 28,
    letterSpacing: 0.5,
  },
  descriptionText: {
    marginBottom: 4,
    color: 'grey',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 1,
  },
}