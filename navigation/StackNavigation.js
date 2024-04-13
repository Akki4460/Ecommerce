import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import React from 'react'
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import 'react-native-gesture-handler';


import { Foundation } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import ProductInfoScreen from '../screens/ProductInfoScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import AddressScreen from '../screens/AddressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/CartScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import OrderScreen from '../screens/OrderScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';

import AsyncStorage from "@react-native-async-storage/async-storage";


// import * as Reanimated from 'react-native-reanimated';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import AdminReportScreen from '../screens/AdminReportScreen';
// import { MaterialCommunityIcons } from '@expo/vector-icons';



function CustomDrawerContent(props) {
  const { navigation } = props;

  const logout = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("auth token cleared");
    navigation.replace("Login");
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
      <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
        <DrawerItemList {...props} />
      </SafeAreaView>
      <TouchableOpacity onPress={logout} style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end', backgroundColor: '#FFC700' }} >
        <MaterialCommunityIcons name="logout" size={24} color="white" />
        <Text style={{ margin: 16, fontWeight: 'bold', color: '#ffffff' }}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>

  );


}




const Drawer = createDrawerNavigator();


function MyDrawer() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props}  />}
    screenOptions={{
      // drawerStyle: {
      //   backgroundColor: 'purple', // Change to the desired color
      // },
      drawerActiveBackgroundColor:'#FFC700',
      drawerActiveTintColor:'white'
    }}
    >
      <Drawer.Screen name="Dashboard" component={AdminDashboardScreen} options={{ headerStyle: { backgroundColor: '#FFC700' }, headerTintColor: '#fff' }} />
      <Drawer.Screen name="Reports" component={AdminReportScreen} options={{ headerStyle: { backgroundColor: '#FFC700' }, headerTintColor: '#fff' }}/>
      {/* <Drawer.Screen name="Article" component={Article} /> */}
    </Drawer.Navigator>
  );
}

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: "#a767ff",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Foundation name="home" size={24} color="#a767ff" />
            ) : (
              <AntDesign name="home" size={24} color="#a767ff" />
            )
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarLabelStyle: "#525CEB",
          // headerShown:false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome name="user" size={24} color="#a767ff" />
            ) : (
              <FontAwesome name="user-o" size={24} color="#a767ff" />
            )
        }}
      />
      <Tab.Screen name="Cart" component={CartScreen}
        options={{
          tabBarLabel: "Cart",
          tabBarLabelStyle: "#525CEB",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
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
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Admin" component={MyDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="Info" component={ProductInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Address" component={AddAddressScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Add" component={AddressScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Confirm" component={ConfirmationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigation

const styles = StyleSheet.create({})