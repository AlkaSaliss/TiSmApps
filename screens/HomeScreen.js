import React from 'react'
import { View, StyleSheet, FlatList, SafeAreaView, Image, Text } from 'react-native'
import {
  Paragraph,
  TouchableRipple
} from 'react-native-paper'
import { Card, Button, Icon } from 'react-native-elements'


const viewsData = [
  {
    id: 'main',
    title: '',
    description: '',
    imgSource: ''
  },
  {
    id: 'pastai',
    title: '🍉Pastai🍉',
    description: 'Watermelon fruits detection & counting',
    imgSource: require('../assets/images/watermelon.png'),
    dest: 'Pastai'
  },
  {
    id: 'whichflower',
    title: '🌹WhichFlower🌻',
    description: 'Flower species classification',
    imgSource: require('../assets/images/whichflower.png'),
    dest: 'WhichFlower'
  },
]


const MainView = () => (
  <View style={{ marginBottom: 50 }}>
    <Image
      source={require('../assets/images/agro2.jpg')}
      style={styles.imageMain}
    />
    <Paragraph style={styles.paragraph}>
      Collections of AI-powered Computer Vision Apps, mainly related to agriculture.
      All models are embedded so that the App doesn't require internet connection.
    </Paragraph>
  </View>
)

const DetailView = (props) => {
  return (
    <TouchableRipple rippleColor='#000' onPress={() => { }} >
      <Card containerStyle={styles.card}>
        <Card.Title>{props.item.title}</Card.Title>
        <Card.Divider />
        <Card.Image source={props.item.imgSource}
          style={styles.imageDetail} >
        </Card.Image>
        <Text style={{ marginVertical: 5, textAlign: 'center' }}>
          {props.item.description}
        </Text>
        <Button
          icon={<Icon name='code' color='#ffffff' />}
          buttonStyle={styles.button}
          title='Go to App'
          onPress={() => props.navigation.navigate(props.item.dest)} />
      </Card>
    </TouchableRipple>
  )
}

const renderItem = ({ item }, navigation) => (
  item.id === 'main' ?
    <MainView />
    :
    <DetailView item={item} navigation={navigation} />
)

const itemSeparator = () => <View style={styles.itemSeparator} />

export default ({ navigation }) => {

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#e0e0eb'
      }}
    >
      <FlatList
        data={viewsData}
        renderItem={(item) => renderItem(item, navigation)}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={itemSeparator}
        extraData={navigation}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  imageMain: {
    height: 250,
    width: '100%',
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 15,
    resizeMode: 'stretch'
  },
  imageDetail: {
    // width: 200,
    height: 200,
    resizeMode: 'stretch',
    marginHorizontal: 20
  },
  paragraph: {
    padding: 10,
    fontFamily: 'Times New Roman',
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
  },
  card: {
    flex: 1,
    backgroundColor: '#b3ffb3',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  itemSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: '#b3daff',
    marginVertical: 5
  },
  button: {
    backgroundColor: '#009900',
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  }
})
