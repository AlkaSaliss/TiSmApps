import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Image, Icon, Text, Button } from 'react-native-elements'
import { Paragraph } from 'react-native-paper'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'

export default ({ navigation }) => {

  const cameraOptions = {
    mediaType: 'photo',
    // maxWidth: 224,
    // maxHeight: 224,
    includeBase64: true,
  }

  const uploadImage = () => {
    launchImageLibrary(cameraOptions,
      response => {
        if (response.assets) {
          navigation.navigate('WatermelonPredict', {
            'data': response.assets[0]
          })
        }
      }
    )
  }

  const takePicture = () => {
    launchCamera(cameraOptions,
      response => {
        if (response.assets) {
          navigation.navigate('WatermelonPredict', {
            'data': response.assets[0]
          })
        }
      }
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#e0e0eb' }}>
      <View style={{ flex: 5 }}>
        <Image
          source={require('../assets/images/watermelon.png')}
          style={{ width: "100%", height: '100%', borderRadius: 2 }}
        />
      </View>
      <View style={{ flex: 2 }}>
        <Paragraph
          style={{
            fontSize: 15,
            fontWeight: "bold",
            textAlign: "center",
            paddingHorizontal: 3,
            paddingTop: 10
          }}>
          Upload/Capture an image to detect 🍉Watermelons in it.
        </Paragraph>
      </View>

      <View style={{flex: 3}}>
        <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
          <Button
            icon={<Icon name='folder-upload' color='#ffffff' type='material-community' />}
            buttonStyle={{ backgroundColor: '#009900', borderRadius: 5, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
            title='Upload Image'
            onPress={uploadImage} />
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
          <Button
            icon={<Icon name='camera' color='#ffffff' type='material-community' />}
            buttonStyle={{ backgroundColor: '#009900', borderRadius: 5, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
            title='Take Picture'
            onPress={takePicture} />
        </View>
      </View>
    </View >

  )
}
