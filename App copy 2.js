/* eslint-disable semi */
/**
 *
 * @format
 * @flow strict-local
 */

import React from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import { Title } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
// import { Icon, Container } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons'
import { Avatar } from 'react-native-elements'
import { Text } from 'react-native-elements'
import HomeScreen from './screens/HomeScreen'
import WhichFlowerScreen from './screens/WhichFlowerScreen'
import PastaiScreen from './screens/PastaiScreen'


const Drawer = createDrawerNavigator()

const HomeStack = createStackNavigator()
const PastaiStack = createStackNavigator()
const WhichFlowerStack = createStackNavigator()

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
    headerTitleStyle: styles.headerTitle
  }}>
    <PastaiStack.Screen name='Pastai' component={PastaiScreen} options={{
      title: 'Watermelon Detection',
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
    headerTitleStyle: styles.headerTitle
  }}>
    <WhichFlowerStack.Screen name='WhichFlower' component={WhichFlowerScreen} options={{
      title: 'Flower Species Recognition',
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
    fontWeight: 'normal',
    textAlign: 'center',
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