import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { cleanCart } from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";
import RazorpayCheckout from "react-native-razorpay";
import { IpType } from "../IpContext";

import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

const ConfirmationScreen = () => {

    // const html = `
    // <!DOCTYPE html>
    // <html lang="en">
    // <head>
    //   <meta charset="UTF-8">
    //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //   <title>Sample Invoice</title>
    //   <style>
    //     body {
    //       font-family: sans-serif;
    //       margin: 0;
    //       padding: 0;
    //     }

    //     .invoice-container {
    //       width: 80%;
    //       margin: auto;
    //       padding: 30px;
    //       border: 1px solid #ddd;
    //       border-radius: 4px;
    //     }

    //     .invoice-header {
    //       display: flex;
    //       justify-content: space-between;
    //       margin-bottom: 30px;
    //     }

    //     .invoice-logo {
    //       width: 200px;
    //     }

    //     .invoice-info {
    //       text-align: right;
    //     }

    //     .invoice-info h1,
    //     .invoice-info p {
    //       margin: 0;
    //     }

    //     .billing-shipping {
    //       display: flex;
    //       justify-content: space-between;
    //       margin-bottom: 30px;
    //     }

    //     .billing-shipping h3 {
    //       margin-bottom: 10px;
    //     }

    //     .table-container {
    //       width: 100%;
    //     }

    //     table {
    //       width: 100%;
    //       border-collapse: collapse; /* Keep collapse for rounded corners */
    //       border-radius: 4px; /* Add border radius for curved corners */
    //     }

    //     th,
    //     td {
    //       padding: 8px;
    //       /* Remove table borders */
    //       border: none;
    //       text-align: left;
    //     }

    //     th {
    //       background-color: #f2f2f2;
    //     }

    //     .table-container tr:nth-child(even) {
    //       background-color: #f9f9f9;
    //     }

    //     .total {
    //       text-align: right;
    //       font-weight: bold;
    //     }

    //     /* Responsive Styles */
    //     @media only screen and (max-width: 600px) {
    //       .invoice-container {
    //         width: 90%;
    //         padding: 20px;
    //       }

    //       .invoice-header {
    //         flex-direction: column;
    //         align-items: center;
    //       }

    //       .invoice-logo {
    //         width: 150px;
    //         margin-bottom: 20px;
    //       }

    //       .billing-shipping {
    //         flex-direction: column;
    //       }
    //     }
    //   </style>
    // </head>
    // <body>
    //   <div class="invoice-container">
    //     <div class="invoice-header">
    //       <div class="invoice-logo">
    //         <h1>Your Company Name</h1>
    //       </div>
    //       <div class="invoice-info">
    //         <h1>Sample Invoice</h1>
    //         <p>Invoice No.: <span id="invoice-number">INVO-005</span></p>
    //         <p>Date: <span id="invoice-date">06/10/2021</span></p>
    //       </div>
    //     </div>
    //     <div class="billing-shipping">
    //       <div>
    //         <h3>Billing Information</h3>
    //         <p>Company Name: <span id="billing-company">LFT</span></p>
    //         <p>Address: <span id="billing-address">111 Pine Street, Suite 1815, San Francisco, CA, 94111</span></p>
    //         <p>Phone Number: <span id="billing-phone">(123) 123-1232</span></p>
    //         <p>Email: <span id="billing-email">John@example.com</span></p>
    //       </div>
    //       <div>
    //         <h3>Shipping Information</h3>
    //         <p>Company Name: <span id="shipping-company">Sam K. Smith</span></p>
    //         <p>Address: <span id="shipping-address">111 Pine Street, Suite 1815, San Francisco, CA, 94111</span></p>
    //       </div>
    //     </div>
    //     <div class="table-container">
    //       <table>
    //         <thead>
    //           <tr>
    //             <th>Description</th>
    //             <th>Quantity</th>
    //             <th>Unit Price</th>
    //             <th>Total</th>
    //           </tr>
    //         </thead>
    //         <tbody>

    //             <tr>
    //             <td>Product/Service 1</td>
    //             <td>2</td>
    //             <td>$100.00</td>
    //             <td>$200.00</td>
    //           </tr>
    //           <tr>
    //             <td>Nest Smart Filter</td>
    //             <td>1</td>
    //             <td><span class="math-inline">150\.00</td\>
    // <td\></span>
    //         </tbody>
    //       </table>
    //     </div>
    //     <div class="total">
    //       <p>Total: $350.00</p>
    //     </div>
    //   </div>
    // </body>
    // </html>

    // `;

    const [invoiceData, setInvoiceData] = useState(null); // State to hold the invoice data


    const steps = [
        { title: "Address", content: "Address Form" },
        { title: "Delivery", content: "Delivery Options" },
        { title: "Payment", content: "Payment Details" },
        { title: "Place Order", content: "Order Summary" },
    ];

    const navigation = useNavigation();

    const [currentStep, setCurrentStep] = useState(0);

    const [addresses, setAddresses] = useState([]);

    const { userId, setUserId } = useContext(UserType);
    const { ip, setIp } = useContext(IpType);

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
                `http://${ip}:8000/addresses/${userId}`

            );
            const { addresses } = response.data;

            setAddresses(addresses);
        } catch (error) {
            console.log("error", error);
        }
    };

    const dispatch = useDispatch();

    const [selectedAddress, setSelectedAdress] = useState("");

    const [option, setOption] = useState(false);

    const [selectedOption, setSelectedOption] = useState("");



    const handlePlaceOrder = async () => {
        try {
            const orderData = {
                userId: userId,
                cartItems: cart,
                totalPrice: total,
                shippingAddress: selectedAddress,
                paymentMethod: selectedOption,
            };

            const response = await axios.post(
                `http://${ip}:8000/orders`,
                orderData
            );
            if (response.status === 200) {
                navigation.navigate("Order");
                dispatch(cleanCart());
                console.log("order created successfully", response.data);
            } else {
                console.log("error creating order", response.data);
            }

            handlePrintAndShare();

        } catch (error) {
            console.log("errror", error);
        }
    };

    const pay = async () => {
        try {
            const options = {
                description: "Adding To Wallet",
                currency: "INR",
                name: "LFT",
                key: "rzp_test_6PxrUSkDyW3HUj",
                amount: total * 100,
                prefill: {
                    email: "void@razorpay.com",
                    contact: "9191919191",
                    name: "RazorPay Software",
                },
                theme: { color: "#F37254" },

            };
            const data = await RazorpayCheckout.open(options);
            console.log(data)

            const orderData = {
                userId: userId,
                cartItems: cart,
                totalPrice: total,
                shippingAddress: selectedAddress,
                paymentMethod: "card",
            };

            const response = await axios.post(
                `http://${ip}:8000/orders`,
                orderData
            );
            if (response.status === 200) {
                navigation.navigate("Order");
                handlePrintAndShare();
                dispatch(cleanCart());
                console.log("order created successfully", response.data);
            } else {
                console.log("error creating order", response.data);
            }

        } catch (error) {
            console.log("error", error);
        }
    };


    useEffect(() => {
        generateInvoiceData(); // Generate invoice data when component mounts
    }, [selectedAddress]);

    const generateInvoiceData = async () => {
        try {
            const response = await axios.get(`http://${ip}:8000/orders/${userId}`);
            const  addresses  = response.data;
            // const selectedAddresss = addresses[addresses.length()-1]; // Assuming the first address is selected

            // Constructing invoice data object
            const invoiceData = {
                invoiceNumber: "INVO",
                invoiceDate: `${new Date().toLocaleDateString("de-DE")}`,
                billingCompany: "LFT",
                billingAddress: "111 Pine Street, Suite 1815, San Francisco, CA, 94111",
                billingPhone: "(123) 123-1232",
                billingEmail: "John@example.com",
                shippingCompany: selectedAddress.name,
                shippingAddress: `${selectedAddress.houseNo}, ${selectedAddress.landmark}, ${selectedAddress.street}, India`,
                cartItems: cart.map((item) => ({
                    description: item.title,
                    quantity: item.quantity,
                    unitPrice: item.price.toFixed(2),
                    total: (item.price * item.quantity).toFixed(2),
                })),
                total: total.toFixed(2),
            };

            setInvoiceData(invoiceData); // Update the state with invoice data
        } catch (error) {
            console.log("Error fetching invoice data:", error);
        }
    };
    const handlePrintAndShare = async () => {
        try {
            if (invoiceData) {
                const html = generateHtml(invoiceData); // Generate HTML content for the invoice

                // Print the invoice to a file
                const file = await printToFileAsync({
                    html: html,
                    base64: false
                });

                // Share the printed invoice
                await shareAsync(file.uri);
            }
        } catch (error) {
            console.log("Error printing and sharing invoice:", error);
        }
    };

    // Function to generate HTML content for the invoice
    const generateHtml = (data) => {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sample Invoice</title>
          <style>
            body {
              font-family: sans-serif;
              margin: 0;
              padding: 0;
            }
        
            .invoice-container {
              width: 80%;
              margin: auto;
              padding: 30px;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
        
            .invoice-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
        
            .invoice-logo {
              width: 200px;
            }
        
            .invoice-info {
              text-align: right;
            }
        
            .invoice-info h1,
            .invoice-info p {
              margin: 0;
            }
        
            .billing-shipping {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
        
            .billing-shipping h3 {
              margin-bottom: 10px;
            }
        
            .table-container {
              width: 100%;
            }
        
            table {
              width: 100%;
              border-collapse: collapse; /* Keep collapse for rounded corners */
              border-radius: 4px; /* Add border radius for curved corners */
            }
        
            th,
            td {
              padding: 8px;
              /* Remove table borders */
              border: none;
              text-align: left;
            }
        
            th {
              background-color: #f2f2f2;
            }
        
            .table-container tr:nth-child(even) {
              background-color: #f9f9f9;
            }
        
            .total {
              text-align: right;
              font-weight: bold;
            }
        
            /* Responsive Styles */
            @media only screen and (max-width: 600px) {
              .invoice-container {
                width: 90%;
                padding: 20px;
              }
        
              .invoice-header {
                flex-direction: column;
                align-items: center;
              }
        
              .invoice-logo {
                width: 150px;
                margin-bottom: 20px;
              }
        
              .billing-shipping {
                flex-direction: column;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div class="invoice-logo">
                <h1>LFT</h1>
              </div>
              <div class="invoice-info">
                <h1>Sample Invoice</h1>
                <p>Invoice No.: <span id="invoice-number">${invoiceData.invoiceNumber}</span></p>
                <p>Date: <span id="invoice-date">${invoiceData.invoiceDate}</span></p>
              </div>
            </div>
            <div class="billing-shipping">
              <div>
                <h3>Billing Information</h3>
                <p>Company Name: <span id="billing-company">ABC Company</span></p>
                <p>Address: <span id="billing-address">111 Pine Street, Suite 1815, San Francisco, CA, 94111</span></p>
                <p>Phone Number: <span id="billing-phone">(123) 123-1232</span></p>
                <p>Email: <span id="billing-email">John@example.com</span></p>
              </div>
              <div>
                <h3>Shipping Information</h3>
                <p>Name: <span id="shipping-company">${invoiceData.shippingCompany}</span></p>
                <p>Address: <span id="shipping-address">${invoiceData.shippingAddress}</span></p>
              </div>
            </div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.cartItems.map((item) => `
                    <tr>
                        <td>${item.description}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.unitPrice}</td>
                        <td>$${item.total}</td>
                    </tr>
                `).join('')}
                </tbody>
              </table>
            </div>
            <div class="total">
              <p>Total: $${data.total}</p>
            </div>
          </div>
        </body>
        </html>
        `;
    };


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



 
            { currentStep == 0 && (
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
            { currentStep == 1 && (
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
            {currentStep == 2 && (
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                        Select your payment Method
                    </Text>

                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 8,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 7,
                            marginTop: 12,
                        }}
                    >
                        {selectedOption === "cash" ? (
                            <FontAwesome5 name="dot-circle" size={20} color="#a767ff" />
                        ) : (
                            <Entypo
                                onPress={() => setSelectedOption("cash")}
                                name="circle"
                                size={20}
                                color="gray"
                            />
                        )}

                        <Text>Cash on Delivery</Text>
                    </View>

                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 8,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 7,
                            marginTop: 12,
                        }}
                    >
                        {selectedOption === "card" ? (
                            <FontAwesome5 name="dot-circle" size={20} color="#a767ff" />
                        ) : (
                            <Entypo
                                onPress={() => {
                                    setSelectedOption("card");
                                    Alert.alert("UPI/Debit card", "Pay Online", [
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel is pressed"),
                                        },
                                        {
                                            text: "OK",
                                            onPress: () => pay(),
                                        },
                                    ]);
                                }}
                                name="circle"
                                size={20}
                                color="gray"
                            />
                        )}

                        <Text>UPI / Credit or debit card</Text>
                    </View>
                    <Pressable
                        onPress={() => setCurrentStep(3)}
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
            {currentStep === 3 && selectedOption === "cash"&& (
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Order Now</Text>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                            backgroundColor: "white",
                            padding: 8,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                        }}
                    >
                        <View>
                            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                                Save 5% and never run out
                            </Text>
                            <Text style={{ fontSize: 15, color: "gray", marginTop: 5 }}>
                                Turn on auto deliveries
                            </Text>
                        </View>

                        <MaterialIcons
                            name="keyboard-arrow-right"
                            size={24}
                            color="black"
                        />
                    </View>

                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 8,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                        }}
                    >
                        <Text>Shipping to {selectedAddress?.name}</Text>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 8,
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                                Items
                            </Text>

                            <Text style={{ color: "gray", fontSize: 16 }}>₹{total}</Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 8,
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                                Delivery
                            </Text>

                            <Text style={{ color: "gray", fontSize: 16 }}>₹0</Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 8,
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                                Order Total
                            </Text>

                            <Text
                                style={{ color: "#C60C30", fontSize: 17, fontWeight: "bold" }}
                            >
                                ₹{total}
                            </Text>
                        </View>
                    </View>


                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 8,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 16, color: "gray" }}>Pay With</Text>

                        <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 7 }}>
                            Pay on delivery (Cash)
                        </Text>
                    </View>
                    {invoiceData && (
                        <Pressable
                            onPress={handlePlaceOrder}
                            style={{
                                backgroundColor: "#FFC72C",
                                padding: 10,
                                borderRadius: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 20,
                            }}
                        >
                            <Text>Place your order</Text>
                        </Pressable>
                    )}
                </View>
            )}


        </ScrollView>
    )
}

export default ConfirmationScreen

const styles = StyleSheet.create({})