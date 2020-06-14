import React, { useState, useEffect } from 'react'
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/Ionicons";

const ProfileImagePicker = ({ image, onImagePicked }) => {

  const [selectedImage, setSelectedImage] = useState();

  // Sets the selected image
  useEffect(() => {
    if (image) {
      console.log("useEffect: " + image);
      setSelectedImage({ uri: image });
    }
  }, [image])

  // Allows the user to pick an image from their camera roll and sets it as the selected image
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
    // Renders a square showing the image chosen
    <View style={styles.container}>
      <Icon
        name="ios-add"
        color='white'
        size={40}
        style={{ position: 'absolute', left: 55, top: 60, zIndex: 999 }}
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
    borderRadius: 200,
    width: 125,
    height: 125,
    marginVertical: 20
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    borderRadius: 200,
  }
})

export default ProfileImagePicker;