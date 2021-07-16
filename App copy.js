/* eslint-disable semi */
/**
 *
 * @format
 * @flow strict-local
 */

import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, ScrollView, FlatList} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator, DrawerItemList, DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer'
import { Icon, Container } from 'native-base'
import HomeScreen from './screens/HomeScreen'
import WhichFlowerScreen from './screens/WhichFlowerScreen'
import PastaiScreen from './screens/PastaiScreen'

const Drawer = createDrawerNavigator()

const CustomDrawerComponent = (props) => {
  <SafeAreaView>
    <ScrollView>

    </ScrollView>
  </SafeAreaView>
}


export default () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home" drawerContent={props => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label="Logout" onPress={() => props.navigation.navigate("Login")} />
          </DrawerContentScrollView>
        )
      }}>
        <Drawer.Screen name='Home' component={HomeScreen}
          options={{
            title: "Home Page",
            drawerIcon: () => (<Icon name='home' />)
          }} />
        <Drawer.Screen name="WhichFlower" component={WhichFlowerScreen} />
        <Drawer.Screen name="Pastai" component={PastaiScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  homeIcon: {
    color: '#42f5ec'
  }
})
