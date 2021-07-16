import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Image, Icon, Text, Button } from 'react-native-elements'
import { Paragraph } from 'react-native-paper'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import targets from '../assets/models/targets.json'


const renderItem = ({ item }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={[styles.items, { paddingRight: 0 }]}>{item.emoji + '    '}</Text>
      <Text style={[styles.items, { paddingLeft: 0 }]}>{item.key}</Text>
    </View>
  )
}

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
          navigation.navigate('FlowerPredict', {
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
          navigation.navigate('FlowerPredict', {
            'data': response.assets[0]
          })
        }
      }
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#e0e0eb' }}>
      <View style={{ flex: 3 }}>
        <Image
          source={require('../assets/images/flower2.jpg')}
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
          Upload/Capture a flower image to predict its name. {'\n'} Currently supported flower species include :
        </Paragraph>
      </View>

      <View style={{ flex: 3, alignItems: "center" }}>
        <FlatList
          data={targets}
          renderItem={renderItem}
        />
      </View>

      <View style={{flex: 3}}>
        <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
          <Button
            icon={<Icon name='folder-upload' color='#ffffff' type='material-community' />}
            buttonStyle={{ backgroundColor: '#009900', borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
            title='Upload Image'
            onPress={uploadImage} />
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
          <Button
            icon={<Icon name='camera' color='#ffffff' type='material-community' />}
            buttonStyle={{ backgroundColor: '#009900', borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
            title='Take Picture'
            onPress={takePicture} />
        </View>
      </View>
    </View >

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#F4FBFB',
  },
  photoButton: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10
  },
  buttonsContainer: {
    padding: 10
  },
  text: {
    flex: 1,
    color: 'teal',
    fontSize: 25,
    textAlign: 'center',
    alignSelf: 'center'
  },
  image: {
    flex: 7,
    borderRadius: 15,
  },
  items: {
    color: 'green',
    fontSize: 15,
    fontWeight: 'bold',
    padding: 0
  }
})
