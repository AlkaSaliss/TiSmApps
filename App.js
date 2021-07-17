import React, { useState, useEffect } from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/Ionicons'
import { Avatar, Text } from 'react-native-elements'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-react-native'
import { bundleResourceIO } from '@tensorflow/tfjs-react-native'
import AnimatedLoader from "react-native-animated-loader"
import {
  CustomDrawerContent, HomeStackScreen,
  PastaiStackScreen, WhichFlowerStackScreen
} from './screens/NavigatorsScreens'
import { ModelsContext } from './utils/ModelsContext'


// PATH to models files
const modelPastaiJson = require('./assets/models/pastai_tfjs/model.json')
const modelPastaiWeights = [
  require('./assets/models/pastai_tfjs/group1-shard1of7.bin'),
  require('./assets/models/pastai_tfjs/group1-shard2of7.bin'),
  require('./assets/models/pastai_tfjs/group1-shard3of7.bin'),
  require('./assets/models/pastai_tfjs/group1-shard4of7.bin'),
  require('./assets/models/pastai_tfjs/group1-shard5of7.bin'),
  require('./assets/models/pastai_tfjs/group1-shard6of7.bin'),
  require('./assets/models/pastai_tfjs/group1-shard7of7.bin')
]
const modelWhichFlowerJson = require('./assets/models/whichflower_tfjs/model.json')
const modelWhichFlowerWeights = require('./assets/models/whichflower_tfjs/group1-shard1of1.bin')


const Drawer = createDrawerNavigator()

const App = () => {
  const dimensions = useWindowDimensions()
  const isLargeScreen = dimensions.width >= 768

  const [isTfReady, setIsTfReady] = useState(false)
  const [pastaiModel, setPastaiModel] = useState(null)
  const [whichFlowerModel, setWhichFlowerModel] = useState(null)

  useEffect(() => {

    const loadTf = async () => {
      await tf.ready()
      const _pastaiModel = await tf.loadGraphModel(bundleResourceIO(modelPastaiJson, modelPastaiWeights))
      const _whichFlowerModel = await tf.loadLayersModel(bundleResourceIO(modelWhichFlowerJson, modelWhichFlowerWeights))
      setPastaiModel(_pastaiModel)
      setWhichFlowerModel(_whichFlowerModel)
      setIsTfReady(true)
    }
    loadTf()

  }, [])

  return (
    (!isTfReady) ?
      <AnimatedLoader
        visible={true}
        overlayColor="rgba(255,255,255,0.75)"
        source={require("./assets/images/7597-loader-animation.json")}
        animationStyle={{ width: 100, height: 100 }}
        speed={2.5}
      >
        <Text>Exploring universe {'&'} loading models ...</Text>
      </AnimatedLoader>
      :
      <NavigationContainer>
        <ModelsContext.Provider value={{tf, whichFlowerModel, pastaiModel }}>
          <Drawer.Navigator
            initialRouteName='Home'
            drawerContentOptions={{
              style: {
                backgroundColor: '#e6ffe6',
                flex: 1
              }
            }}
            drawerStyle={isLargeScreen ? null : { width: '65%' }}
            drawerContent={props => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen name='Home' component={HomeStackScreen}
              options={{
                drawerLabel: ({ focused, color }) => <Text style={styles.drawerLabel}>Home</Text>,
                drawerIcon: () => (<Icon name='home' size={25} style={styles.homeIcon} />)
              }} />

            <Drawer.Screen name='Pastai' component={PastaiStackScreen}
              options={{
                drawerLabel: ({ focused, color }) => <Text style={styles.drawerLabel} >Pastai</Text>,
                drawerIcon: () => (<Avatar source={require('./assets/images/watermelon.png')} />)
              }} />

            <Drawer.Screen name='WhichFlower' component={WhichFlowerStackScreen}
              options={{
                drawerLabel: ({ focused, color }) => <Text style={styles.drawerLabel} >WhichFlower</Text>,
                drawerIcon: () => (<Avatar source={require('./assets/images/whichflower.png')} />)
              }} />
          </Drawer.Navigator>
        </ModelsContext.Provider>
      </NavigationContainer>
  )
}


const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#009999'
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fafffb'

  },
  homeIcon: {
    color: '#00b300',
  },
  drawerLabel: {
    fontSize: 15,
    color: '#32324e',
    fontWeight: 'bold',
    marginVertical: 2
  }
})

export default App