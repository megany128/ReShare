import React, { useState, useEffect } from 'react'
import {
  View,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/Ionicons";

const ResourceImagePicker = ({ image, onImagePicked }) => {

  const [selectedImage, setSelectedImage] = useState();

  useEffect(() => {
    if (image) {
      console.log("useEffect: " + image);
      setSelectedImage({ uri: image });
    }
  }, [image])

  _pickImageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });
    console.log(result)
    if (result.error) {
      console.log("image error");
    } else {
      setSelectedImage({ uri: result.uri });
      onImagePicked({ uri: result.uri });
    }
  }
  return (
    <View style={styles.container}>
      <Icon
        name="ios-add"
        color='white'
        size={100}
        style={{ position: 'absolute', left: 300 / 2, top: 300 / 2, zIndex: 999 }}
        onPress={_pickImageHandler}
      />
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={_pickImageHandler}>
          <Image source={selectedImage} style={styles.previewImage} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  imageContainer: {
    borderWidth: 1,
    backgroundColor: '#ECECEC',
    borderWidth: 0,
    borderRadius: 20,
    width: 350,
    height: 350,
    marginVertical: 20
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    borderRadius: 20,
  }
})

export default ResourceImagePicker;