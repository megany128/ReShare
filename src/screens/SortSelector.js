import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import _ from 'lodash';
import { AsyncStorage } from "react-native"

class SortSelector extends Component {
  state = {
    sorts: [
      { title: 'Recent', key: 'Most recent' },
      { title: 'Expiry', key: 'Expiry date: near to far' },
      { title: 'Trusted', key: 'Most trusted users' }
    ],
    currentSort: ""
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE"
        }}
      />
    );
  };

  componentDidMount() {
    let mounted = true;
    if (mounted) {
      console.log('SortSelector')
      try {
        // Gets the currently selected sort
        AsyncStorage.getItem('sortState').then(data => {
          if (data) {
            const currentSort = JSON.parse(data);
            this.setState({ currentSort })
          }
        });
      }
      catch (err) {
        console.log('Failed to load current sort')
      }
    }
    return () => mounted = false;
  }


  FlatListItemSeparator = () => <View style={styles.line} />;

  // Sets the sort to the one the user has chosen and navigates back to SearchResults
  selectSort(item) {
    console.log(item)
    AsyncStorage.setItem('sortState',
      JSON.stringify(item));
    this.props.navigation.navigate('SearchResults')
  }

  // Resets the sort and navigates back to SearchResults
  clearSort() {
    AsyncStorage.setItem('sortState',
      JSON.stringify(""));
    this.props.navigation.navigate("SearchResults")
  }

  render() {
    // Renders a list of sorts for the user to select
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 0 }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              height: 70,
              borderBottomWidth: 1,
              borderBottomColor: "#dddddd",
            }}
          >
            <Icon
              name="ios-close"
              color='grey'
              size={40}
              style={{ marginHorizontal: 20, marginVertical: 10 }}
              onPress={() => this.props.navigation.navigate('SearchResults')}
              hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            />
            <Text style={{ marginHorizontal: 5, marginVertical: 15, fontWeight: 'bold', fontSize: 25 }}>Sort Selector</Text>
          </View>
          <FlatList
            style={styles.listStyle}
            data={this.state.sorts}
            scrollEnabled={false}
            // Renders the sort as bold if it is currently selected
            renderItem={({ item }) => (
              <TouchableHighlight style={styles.listItemStyle} onPress={this.selectSort.bind(this, item.title)}>
                {item.title === this.state.currentSort ? (
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    {item.key}
                  </Text>
                ) : (
                    <Text style={{ fontSize: 15 }}>
                      {item.key}
                    </Text>
                  )}
              </TouchableHighlight>
            )}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
      </SafeAreaView>
    );
  }
}
export default SortSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listStyle:
  {
    marginVertical: 10,
    marginHorizontal: 10
  },
  listItemStyle:
  {
    marginVertical: 10
  },
  clearBtn:
  {
    borderRadius: 25,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 15,
    marginTop: 30,
    marginLeft: 135,
    width: 150,
    backgroundColor: "#d3d3d3"
  },
  listStyle:
  {
    marginVertical: 10,
    marginHorizontal: 10
  },
  listItemStyle:
  {
    marginVertical: 10
  }
});