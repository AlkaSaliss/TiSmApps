/* eslint-disable semi */
/**
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react'
import { StyleSheet, useWindowDimensions, View, BackHandler, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { Drawer as DrawerPaper } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons'
import { Avatar, Overlay } from 'react-native-elements'
import { Text } from 'react-native-elements'
import HomeScreen from './screens/HomeScreen'
import WhichFlowerScreen from './screens/WhichFlowerScreen'
import PastaiScreen from './screens/PastaiScreen'
import FlowerPredictScreen from './screens/FlowerPredictScreen'
import PastaiPredictScreen from './screens/PastaiPredictScreen'


const Drawer = createDrawerNavigator()

const HomeStack = createStackNavigator()
const PastaiStack = createStackNavigator()
const WhichFlowerStack = createStackNavigator()

const ExitApp = () => {
  const [visible, setVisible] = useState(false)

}

const CustomDrawerContent = (props) => {
  const [exitVisible, setExitVisible] = useState(false)

  const toggleOverlay = () => {
    setExitVisible(!exitVisible);
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <DrawerPaper.Section style={{ backgroundColor: '#e6ffe6', }}>
        <DrawerItem
          style={{ backgroundColor: '#b3ffb3', }}
          label="Exit"
          labelStyle={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}
          icon={() => (<IconMC name='exit-to-app' color='red' size={30} />)}
          onPress={toggleOverlay} />
      </DrawerPaper.Section>

      <Overlay isVisible={exitVisible} onBackdropPress={toggleOverlay}
        overlayStyle={{
          justifyContent: 'space-between',
          width: 250,
          height: 100,
          backgroundColor: 'black'
        }}
      >
        <Text style={{ fontSize: 20, textAlign: 'center', color: 'white' }}>Confirm exit?</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 25 }}>
          <TouchableOpacity onPress={toggleOverlay} style={{ width: 75 }}>
            <Text style={{
              fontSize: 15,
              fontWeight: 'bold',
              backgroundColor: '#e0e0d1',
              textAlign: 'center',
              borderRadius: 10
            }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 75 }} onPress={() => BackHandler.exitApp()}>
            <Text style={{
              fontSize: 15,
              fontWeight: 'bold',
              backgroundColor: '#e0e0d1',
              textAlign: 'center',
              borderRadius: 10
            }}>Exit</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    </View>
  )

}

const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator screenOptions={{
    headerStyle: styles.headerStyle,
    headerTintColor: '#fff',
    headerTitleStyle: styles.headerTitle
  }}>
    <HomeStack.Screen name='Home' component={HomeScreen} options={{
      title: 'Tiny & Smart Apps',
      headerLeft: () => (
        <Icon.Button name='menu' size={25} backgroundColor={styles.headerStyle.backgroundColor}
          onPress={() => navigation.openDrawer()}
        ></Icon.Button>
      )
    }} ></HomeStack.Screen>
  </HomeStack.Navigator>
)

const PastaiStackScreen = ({ navigation }) => (
  <PastaiStack.Navigator screenOptions={{
    headerStyle: styles.headerStyle,
    headerTintColor: '#fff',
    headerTitle: () => (<Text style={styles.headerTitle}>🍉Watermelon Detection🍉</Text>),
  }}>
    <PastaiStack.Screen name='Pastai' component={PastaiScreen} options={{
      headerLeft: () => (
        <Icon.Button name='menu' size={25} backgroundColor={styles.headerStyle.backgroundColor}
          onPress={() => navigation.openDrawer()}
        ></Icon.Button>
      )
    }}></PastaiStack.Screen>
    <PastaiStack.Screen name='WatermelonPredict' component={PastaiPredictScreen} options={{
      eaderTitle: () => (<Text style={styles.headerTitle}>🍉Predictions🍉</Text>),
      headerLeft: () => (
        <Icon.Button name='menu' size={25} backgroundColor={styles.headerStyle.backgroundColor}
          onPress={() => navigation.openDrawer()}
        ></Icon.Button>
      )
    }}></PastaiStack.Screen>
  </PastaiStack.Navigator>
)

const WhichFlowerStackScreen = ({ navigation }) => (
  <WhichFlowerStack.Navigator screenOptions={{
    headerStyle: styles.headerStyle,
    headerTintColor: '#fff',
    headerTitle: () => (<Text style={styles.headerTitle}>🌹Flower Species Recognition🌻</Text>),
  }}>
    <WhichFlowerStack.Screen name='WhichFlower' component={WhichFlowerScreen} options={{
      headerLeft: () => (
        <Icon.Button name='menu' size={25} backgroundColor={styles.headerStyle.backgroundColor}
          onPress={() => navigation.openDrawer()}
        ></Icon.Button>
      )
    }}></WhichFlowerStack.Screen>
    <WhichFlowerStack.Screen name='FlowerPredict' component={FlowerPredictScreen} options={{
      headerTitle: () => (<Text style={styles.headerTitle}>🌹Predictions🌻</Text>),
      headerLeft: () => (
        <Icon.Button name='menu' size={25} backgroundColor={styles.headerStyle.backgroundColor}
          onPress={() => navigation.openDrawer()}
        ></Icon.Button>
      )
    }}></WhichFlowerStack.Screen>

  </WhichFlowerStack.Navigator>
)

const App = () => {
  const dimensions = useWindowDimensions()
  const isLargeScreen = dimensions.width >= 768

  return (
    <NavigationContainer>
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