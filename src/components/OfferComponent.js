import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");

class OfferComponent extends Component {
  render() {
    return (
      <View>
        <View style={[styles.flex, styles.column, styles.recommendation]}>
          <View style={[styles.flex, styles.recommendationHeader, styles.shadow]}>
            <Image style = {styles.recommendationImage} source={require('../icons/exampleOfferImg.jpeg')}/>
          </View>
        </View>
        <View style={[styles.flex, styles.column, { justifyContent: 'space-evenly', paddingHorizontal: 12, flexDirection: 'row' }]}>
          <Text style={{ fontSize: 16 * 1.25, fontWeight: '500', paddingBottom: 36 / 4.5, flexWrap: 'wrap', flex: 1 }}>{this.props.item.name} </Text>
          <Text style={{ color: '#BCCCD4' }}>{this.props.item.category} </Text>
        </View>
      </View>  
    );
  }
}
export default OfferComponent;

const styles = StyleSheet.create({
    recommendation: {
        width: (width - (36 * 2)) / 2,
        marginHorizontal: 8,
        backgroundColor: 'white',
        overflow: 'hidden',
        borderRadius: 12,
        marginVertical: 36 * 0.5,
      },
      recommendationImage: {
        width: (width - (36* 2)) / 2,
        height: (width - (36 * 2)) / 2
      },
      recommendationHeader: {
      overflow: 'hidden',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
    },
    flex: {
        flex: 1,
    },
    column: {
        flexDirection: 'column'
    }
})