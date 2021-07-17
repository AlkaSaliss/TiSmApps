import React, { useState } from 'react'
import { View, BackHandler, TouchableOpacity, StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { Drawer as DrawerPaper } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons'
import { Overlay, Text } from 'react-native-elements'
import HomeScreen from './HomeScreen'
import WhichFlowerScreen from './WhichFlowerScreen'
import PastaiScreen from './PastaiScreen'
import FlowerPredictScreen from './FlowerPredictScreen'
import PastaiPredictScreen from './PastaiPredictScreen'


const HomeStack = createStackNavigator()
const PastaiStack = createStackNavigator()
const WhichFlowerStack = createStackNavigator()


export const CustomDrawerContent = (props) => {
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
          labelStyle={styles.exitButton}
          icon={() => (<IconMC name='exit-run' color='red' size={30} />)}
          onPress={toggleOverlay} />
      </DrawerPaper.Section>

      <Overlay isVisible={exitVisible} onBackdropPress={toggleOverlay}
        overlayStyle={styles.exitDialog}
      >
        <Text style={styles.exitText}>Confirm exit?</Text>
        <View style={styles.exitView}>
          <TouchableOpacity onPress={toggleOverlay} style={{ width: 100, }}>
            <Text style={{...styles.exitDecisionText, backgroundColor: '#009900'}}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 100, }} onPress={() => BackHandler.exitApp()}>
            <Text style={{...styles.exitDecisionText, backgroundColor: '#cc0000'}}>Exit</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    </View>
  )

}

export const HomeStackScreen = ({ navigation }) => (
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

export const PastaiStackScreen = ({ navigation }) => (
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

export const WhichFlowerStackScreen = ({ navigation }) => (
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
  },
  exitButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  exitDialog: {
    justifyContent: 'space-between',
    width: 300,
    height: 150,
    backgroundColor: 'black',
    paddingVertical: 20
  },
  exitText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white'
  },
  exitView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 25,
  },
  exitDecisionText: {
    fontSize: 15,
    fontWeight: 'bold',
    backgroundColor: '#e0e0d1',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 10,
    color: 'white',
    height: 30
  }
})