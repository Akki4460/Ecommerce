import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'

import { MaterialIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage'

import axios from 'axios';
import { IpType } from '../IpContext';

const LoginScreen = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { ip, setIp } = useContext(IpType);


  const navigation = useNavigation();

  // Check login status
  useEffect(()=>{
    const checkLoginStatus = async () =>{
      try{
        

        const token = await AsyncStorage.getItem("authToken")
        const userEmail = await AsyncStorage.getItem("userEmail");

        if (token && userEmail) {
          if (userEmail === "akkibhosale4460@gmail.com") {
            navigation.replace("Admin");
          } else {
            navigation.replace("Main");
          }
        }
        

      }catch(err){
        console.log("Error message",err)
      }
    }
    checkLoginStatus();
  },[])

  const handleLogin = () => {
    const user = {
      email: email,
      password: password
    }

    axios.post(`http://${ip}:8000/login`, user).then((response) => {
      console.log(response);

      const token = response.data.token

      // Use of asyncStorage for storing token till login
      AsyncStorage.setItem("authToken", token)
      AsyncStorage.setItem("userEmail", user.email);


      //  CHANGE THIS EMAIL AFTER REGISTERING ADMIN TO CREATE AND ACCESS YOUR ADMIN
      if(user.email == "akkibhosale4460@gmail.com"){
        navigation.replace("Admin")
        // console.log(user.email)
      }else{
        navigation.replace("Main")
      }


    }).catch((err) => {
      Alert.alert("Login error", "Invalid Email");
      console.log(err)
    })

  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <View style={{ marginTop: 100 }}>
        <Image
          style={{ width: 150, height: 100 }}
          source={
            require('../assets/Lft.png')
          }
        ></Image>
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 50, color: "#041e42" }}>Login in Your Account</Text>
        </View>

        <View style={{
          marginTop: 40,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          backgroundColor: "#F3F3F9",
          paddingVertical: 5,
          borderRadius: 5,
          marginTop: 30
        }}>
          <MaterialIcons style={{ marginLeft: 8 }} name="email" size={24} color="grey" />
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={{ color: 'grey', marginVertical: 8, width: 250, fontSize: email ? 16 : 14 }} placeholder='Enter Your Email' />
        </View>

        <View style={{
          marginTop: 40,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          backgroundColor: "#F3F3F9",
          paddingVertical: 5,
          borderRadius: 5,
          marginTop: 30
        }}>
          <Fontisto style={{ marginLeft: 8 }} name="locked" size={24} color="grey" />
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            style={{ color: 'grey', marginVertical: 8, width: 250, fontSize: password ? 16 : 14 }} placeholder='Enter Your Password' />

        </View>

        <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text>Keep me logged in</Text>
          <Text style={{ color: '#378CE7', fontWeight: 500 }}>Forgot Password</Text>
        </View>

        <View style={{ marginTop: 50 }} />

        <Pressable
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "#525CEB",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </Pressable>

        <Pressable
          onPress={() => { navigation.navigate('Register') }}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "grey", fontSize: 16 }}>
            Don't have an account? Sign Up
          </Text>
        </Pressable>

      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})