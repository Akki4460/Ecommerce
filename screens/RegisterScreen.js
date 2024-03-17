import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'

import { MaterialIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import axios from "axios"

const RegisterScreen = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigation = useNavigation();

    const handleRegister = ()=>{
        const user = {
            name:name,
            email:email,
            password:password
        }

        // Send a post request to backend API
        axios.post("http://192.168.1.3:8000/register",user).then((response) =>{
            console.log("Registration successful");
            console.log(response);
          
            Alert.alert("Registration Successful","You have registered successfully")
          
            setName("");
            setEmail("");
            setPassword("");
       
        }).catch((error)=>{
            Alert.alert("Registration error","an error occurred during registration");
            console.log("Registration failed",error);
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
                    <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 50, color: "#041e42" }}>Register to Your Account</Text>
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
                    <FontAwesome style={{ marginLeft: 8 }} name="user" size={24} color="grey" />
                    <TextInput
                        value={name}
                        onChangeText={(text) => setName(text)}
                        style={{ color: 'grey', marginVertical: 8,marginLeft:4, width: 250, fontSize: email ? 16 : 14 }} placeholder='Enter Your Name' />
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
                    onPress={handleRegister}
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
                        Register
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => { navigation.goBack() }}
                    style={{ marginTop: 15 }}
                >
                    <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
                        Already have an account? Sign In
                    </Text>
                </Pressable>

            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({})