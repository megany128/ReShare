import React, { useState, useEffect } from 'react'
import {
  View,
  Button,
  Image,
  StyleSheet
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

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
          <View style={styles.imageContainer}>
            <Image source = {selectedImage} style={styles.previewImage}/>
          </View>

          <View>
            <Button title="Pick Image" onPress={this._pickImageHandler} />
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center'
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: 'black',
    width: 200,
    height: 200
  },
  previewImage: {
    width: '100%',
    height: '100%'
  }
})

export default ResourceImagePicker;