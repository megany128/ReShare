import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class Following extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Following</Text>
      </View>
    );
  }
}
export default Following;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});