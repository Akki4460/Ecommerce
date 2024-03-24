import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { cleanCart } from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";

const ConfirmationScreen = () => {

    const steps = [
        { title: "Address", content: "Address Form" },
        { title: "Delivery", content: "Delivery Options" },
        { title: "Payment", content: "Payment Details" },
        { title: "Place Order", content: "Order Summary" },
    ];

    const [currentStep, setCurrentStep] = useState(0);

    const { userId, setUserId } = useContext(UserType);

    const [addresses, setAddresses] = useState([]);

    const [option, setOption] = useState(false);

    const cart = useSelector((state) => state.cart.cart);
    const total = cart
        ?.map((item) => item.price * item.quantity)
        .reduce((curr, prev) => curr + prev, 0);


    useEffect(() => {
        fetchAddresses();
    }, []);
    const fetchAddresses = async () => {
        try {
            const response = await axios.get(
                `http://192.168.1.10:8000/addresses/${userId}`

            );
            const { addresses } = response.data;

            setAddresses(addresses);
        } catch (error) {
            console.log("error", error);
        }
    };


    const [selectedAddress, setSelectedAdress] = useState("");

    const [selectedOption, setSelectedOption] = useState("");



    console.log(addresses)

    return (
        <ScrollView style={{ marginTop: 55 }}>
            <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 20,
                        justifyContent: "space-between",
                    }}
                >
                    {steps?.map((step, index) => (
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            {index > 0 && (
                                <View
                                    style={[
                                        { flex: 1, height: 2, backgroundColor: "green" },
                                        index <= currentStep && { backgroundColor: "green" },
                                    ]}
                                />
                            )}
                            <View
                                style={[
                                    {
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        backgroundColor: "#ccc",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    },
                                    index < currentStep && { backgroundColor: "green" },
                                ]}
                            >
                                {index < currentStep ? (
                                    <Text
                                        style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                                    >
                                        &#10003;
                                    </Text>
                                ) : (
                                    <Text
                                        style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                                    >
                                        {index + 1}
                                    </Text>
                                )}
                            </View>
                            <Text style={{ textAlign: "center", marginTop: 8 }}>
                                {step.title}
                            </Text>
                        </View>
                    ))}

                </View>
            </View>


            {currentStep == 0 && (
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        Select Delivery Address
                    </Text>
                    <Pressable>
                        {addresses?.map((item, index) => (
                            <Pressable
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#D0D0D0",
                                    padding: 10,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 5,
                                    paddingBottom: 17,
                                    marginVertical: 7,
                                    borderRadius: 6,
                                }}
                            >
                                {selectedAddress && selectedAddress._id === item?._id ? (
                                    <FontAwesome5 name="dot-circle" size={20} color="#a767ff" />
                                ) : (
                                    <Entypo
                                        onPress={() => setSelectedAdress(item)}
                                        name="circle"
                                        size={20}
                                        color="gray"
                                    />
                                )}

                                <View style={{ marginLeft: 6 }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 3,
                                        }}
                                    >
                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                            {item?.name}
                                        </Text>
                                        <Entypo name="location-pin" size={24} color="red" />
                                    </View>

                                    <Text style={{ fontSize: 15, color: "#181818" }}>
                                        {item?.houseNo}, {item?.landmark}
                                    </Text>

                                    <Text style={{ fontSize: 15, color: "#181818" }}>
                                        {item?.street}
                                    </Text>

                                    <Text style={{ fontSize: 15, color: "#181818" }}>
                                        India, Bangalore
                                    </Text>

                                    <Text style={{ fontSize: 15, color: "#181818" }}>
                                        phone No : {item?.mobileNo}
                                    </Text>
                                    <Text style={{ fontSize: 15, color: "#181818" }}>
                                        pin code : {item?.postalCode}
                                    </Text>

                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 10,
                                            marginTop: 7,
                                        }}
                                    >
                                        <Pressable
                                            style={{
                                                backgroundColor: "#F5F5F5",
                                                paddingHorizontal: 10,
                                                paddingVertical: 6,
                                                borderRadius: 5,
                                                borderWidth: 0.9,
                                                borderColor: "#D0D0D0",
                                            }}
                                        >
                                            <Text>Edit</Text>
                                        </Pressable>

                                        <Pressable
                                            style={{
                                                backgroundColor: "#F5F5F5",
                                                paddingHorizontal: 10,
                                                paddingVertical: 6,
                                                borderRadius: 5,
                                                borderWidth: 0.9,
                                                borderColor: "#D0D0D0",
                                            }}
                                        >
                                            <Text>Remove</Text>
                                        </Pressable>

                                        <Pressable
                                            style={{
                                                backgroundColor: "#F5F5F5",
                                                paddingHorizontal: 10,
                                                paddingVertical: 6,
                                                borderRadius: 5,
                                                borderWidth: 0.9,
                                                borderColor: "#D0D0D0",
                                            }}
                                        >
                                            <Text>Set as Default</Text>
                                        </Pressable>
                                    </View>

                                    <View>
                                        {selectedAddress && selectedAddress._id === item?._id && (
                                            <Pressable
                                                onPress={() => setCurrentStep(1)}
                                                style={{
                                                    backgroundColor: "#a767ff",
                                                    padding: 10,
                                                    borderRadius: 20,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: 10,
                                                }}
                                            >
                                                <Text style={{ textAlign: "center", color: "white", fontWeight: 'bold' }}>
                                                    Deliver to this Address
                                                </Text>
                                            </Pressable>
                                        )}
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </Pressable>
                </View>
            )}
            {currentStep == 1 && (
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                        Choose your delivery options
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "white",
                            padding: 8,
                            gap: 7,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                        }}
                    >
                        {option ? (
                            <FontAwesome5 name="dot-circle" size={20} color="#a767ff" />
                        ) : (
                            <Entypo
                                onPress={() => setOption(!option)}
                                name="circle"
                                size={20}
                                color="gray"
                            />
                        )}

                        <Text style={{ flex: 1 }}>
                            <Text style={{ color: "green", fontWeight: "500" }}>
                                Tomorrow by 10pm
                            </Text>{" "}
                            - FREE delivery with your Prime membership
                        </Text>
                    </View>

                    <Pressable
                        onPress={() => setCurrentStep(2)}
                        style={{
                            backgroundColor: "#FFC72C",
                            padding: 10,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 15,
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Continue</Text>
                    </Pressable>
                </View>
            )}


        </ScrollView>
    )
}

export default ConfirmationScreen

const styles = StyleSheet.create({})