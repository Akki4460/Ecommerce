import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import { Foundation } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import ProductInfoScreen from '../screens/ProductInfoScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import AddressScreen from '../screens/AddressScreen';


const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function BottomTabs(){
  return(
    <Tab.Navigator >
      <Tab.Screen name="Home" component={HomeScreen} 
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle:"#a767ff",
          headerShown:false,
          tabBarIcon:({focused})=>
          focused ? (
            <Foundation name="home" size={24} color="#a767ff" />
          ) : (
            <AntDesign name="home" size={24} color="#a767ff" />
          )
        }}
      />
      <Tab.Screen name="Profile" component={HomeScreen} 
        options={{
          tabBarLabel: "Profile",
          tabBarLabelStyle:"#525CEB",
          headerShown:false,
          tabBarIcon:({focused})=>
          focused ? (
            <FontAwesome name="user" size={24} color="#a767ff" />
          ) : (
            <FontAwesome name="user-o" size={24} color="#a767ff" />
          )
        }}
      />
      <Tab.Screen name="Cart" component={HomeScreen} 
        options={{
          tabBarLabel: "Cart",
          tabBarLabelStyle:"#525CEB",
          headerShown:false,
          tabBarIcon:({focused})=>
          focused ? (
            <MaterialCommunityIcons name="shopping" size={24} color="#a767ff" />
          ) : (
            <MaterialCommunityIcons name="shopping-outline" size={24} color="#a767ff" />
          )
        }}
      />
      {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
    </Tab.Navigator>
  )
}

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Main" component={BottomTabs} options={{headerShown:false}}/>
        {/* <Stack.Screen name="Main" component={HomeScreen} options={{headerShown:false}}/> */}
        <Stack.Screen name="Info" component={ProductInfoScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Address" component={AddAddressScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Add" component={AddressScreen} options={{headerShown:false}}/>

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigation

const styles = StyleSheet.create({})