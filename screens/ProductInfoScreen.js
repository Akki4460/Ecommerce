import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    ImageBackground,
    Dimensions,
} from "react-native";
import React from 'react';


import { AntDesign, Feather } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";



const ProductInfoScreen = () => {

    const route = useRoute();

    const { width } = Dimensions.get("window");
    const navigation = useNavigation();
    const height = (width * 100) / 100;


    return (
        <ScrollView
            style={{ marginTop: 22, flex: 1, backgroundColor: "white" }}
            showsVerticalScrollIndicator={false}
        >
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

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {route.params.carouselImages.map((item, index) => (

                    <ImageBackground
                        style={{ width, height, marginTop: 25, resizeMode: "contain" }}
                        source={{ uri: item }}
                        key={index}
                    >
                        <View
                            style={{
                                padding: 20,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                            {/* Offer tag */}
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: "#C60C30",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        textAlign: "center",
                                        fontWeight: "600",
                                        fontSize: 12,
                                    }}
                                >
                                    20%
                                    off
                                </Text>
                            </View>
                            {/* Share button */}
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: "#e0E0E0",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                }}
                            >
                                <AntDesign name="sharealt" size={24} color="black" />
                            </View>
                        </View>
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: "#E0E0E0",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                                marginTop: "auto",
                                marginLeft: 20,
                                marginBottom: 20,
                            }}
                        >
                            <AntDesign name="hearto" size={24} color="black" />
                        </View>
                    </ImageBackground>
                ))}
            </ScrollView>

            {/* Name & price */}
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: "500", textAlign: "justify" }}>
                    {route?.params?.title}
                </Text>

                <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 6 }}>
                    ₹{route?.params?.price}
                </Text>
            </View>

            <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />


            {/* Color and size */}
            <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                <Text>Color: </Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {route?.params?.color}
                </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                <Text>Size: </Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {route?.params?.size}
                </Text>
            </View>

            <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />

            {/* location, Adress, Instock */}
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: "bold", marginVertical: 5 }}>
                    Total : ₹{route.params.price}
                </Text>
                <Text style={{ color: "#a767ff" }}>
                    FREE delivery Tomorrow by 3 PM.Order within 10hrs 30 mins
                </Text>

                <View
                    style={{
                        flexDirection: "row",
                        marginVertical: 5,
                        alignItems: "center",
                        gap: 5,
                    }}
                >
                    <Ionicons name="location" size={24} color="black" />

                    <Text style={{ fontSize: 15, fontWeight: "500" }}>
                        Deliver To Akki - Kolhapur 416002
                    </Text>
                </View>
            </View>

            <Text style={{ color: "green", marginHorizontal: 10, fontWeight: "500" }}>
                IN Stock
            </Text>

            <Pressable
                // onPress={() => addItemToCart(route?.params?.item)}
                style={{
                    backgroundColor: "#a387ff",
                    padding: 10,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 20,
                    marginVertical: 20,
                }}
            >
                {/* {addedToCart ? (
                    <View>
                        <Text>Added to Cart</Text>
                    </View>
                ) : ( */}
                    <Text style={{color:"white", fontWeight:"bold"}}>Add to Cart</Text>
                {/* )} */}
            </Pressable>

            <Pressable
                style={{
                    backgroundColor: "#a767ff",
                    padding: 10,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 20,
                    marginVertical: 5,
                }}
            >
                <Text style={{color:"white", fontWeight:"bold"}}>Buy Now</Text>
            </Pressable>

        </ScrollView>
    )
}

export default ProductInfoScreen

const styles = StyleSheet.create({})