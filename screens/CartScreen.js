import { ScrollView, StyleSheet, Text, View, Pressable, TextInput, Image } from 'react-native'
import React from 'react'

import { Feather } from "@expo/vector-icons";

import { useSelector } from 'react-redux';


const CartScreen = () => {

    const cart = useSelector((state) => state.cart.cart);
    console.log(cart);

    const total = cart
        ?.map((item) => item.price * item.quantity)
        .reduce((curr, prev) => curr + prev, 0);
    console.log(total)

    return (
        <ScrollView style={{ marginTop: 22, flex: 1, backgroundColor: 'white' }}>
            <View
                style={{
                    backgroundColor: "#a767ff",
                    // backgroundColor: "#ff1d58",
                    paddingTop: 20,
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Pressable
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginHorizontal: 7,
                        gap: 10,
                        backgroundColor: "white",
                        borderRadius: 30,
                        height: 38,
                        flex: 1,
                    }}
                >
                    <Feather style={{ paddingLeft: 10 }} name="search" size={24} color="black" />
                    <TextInput placeholder="Search LFT.in" />
                </Pressable>

                <Feather name="mic" size={24} color="black" />
            </View>

            <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "400" }}>Subtotal : </Text>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}> {Math.round(total)}</Text>
            </View>
            <Text style={{ marginHorizontal: 10 }}>EMI details Available</Text>

            <Pressable
                // onPress={() => navigation.navigate("Confirm")}
                style={{
                    backgroundColor: "#FFC72C",
                    padding: 10,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 10,
                    marginTop: 10,
                }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Proceed to Buy ({cart.length}) items</Text>
            </Pressable>

            <Text
                style={{
                    height: 1,
                    borderColor: "#D0D0D0",
                    borderWidth: 1,
                    marginTop: 16,
                }}
            />

            <View style={{ marginHorizontal: 10 }}>
                {cart?.map((item, index) => (
                    <View
                        style={{
                            backgroundColor: "white",
                            marginVertical: 10,
                            borderBottomColor: "#F0F0F0",
                            borderWidth: 2,
                            borderLeftWidth: 0,
                            borderTopWidth: 0,
                            borderRightWidth: 0,
                        }}
                        key={index}
                    >
                        <Pressable
                            style={{
                                marginVertical: 10,
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <View>
                                <Image
                                    style={{ width: 140, height: 140, resizeMode: "contain" }}
                                    source={{ uri: item?.image }}
                                />
                            </View>

                            <View>
                                <Text numberOfLines={3} style={{ width: 150, marginTop: 10 }}>
                                    {item?.title}
                                </Text>
                                <Text
                                    style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}
                                >
                                    {item?.price}
                                </Text>
                                <Image
                                    style={{ width: 40, height: 30, resizeMode: "contain" }}
                                    source={
                                        require("../assets/Lft.png")
                                    }
                                />
                                <Text style={{ color: "green" }}>In Stock</Text>
                                {/* <Text style={{ fontWeight: "500", marginTop: 6 }}>
                  {item?.rating?.rate} ratings
                </Text> */}
                            </View>
                        </Pressable>

                    </View>
                ))}
            </View>




        </ScrollView>
    )
}

export default CartScreen

const styles = StyleSheet.create({})