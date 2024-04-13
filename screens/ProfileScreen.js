import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useLayoutEffect, useEffect, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IpType } from "../IpContext";

import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

const ProfileScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const { ip, setIp } = useContext(IpType);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#a767ff",
      },
      headerLeft: () => (
        <Image
          style={{ width: 140, height: 120, resizeMode: "contain" }}
          source={
            require('../assets/Lft3.png')
          }
        />
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginRight: 12,
          }}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />

          <AntDesign name="search1" size={24} color="black" />
        </View>
      ),
    });
  }, []);
  const [user, setUser] = useState();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://${ip}:8000/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.log("error", error);
      }
    };

    
    fetchUserProfile();
  }, []);
  console.log(user)
  const logout = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("auth token cleared");
    navigation.replace("Login");
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://${ip}:8000/orders/${userId}`
        );
        const orders = response.data.orders;
        setOrders(orders);

        setLoading(false);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchOrders();
  }, []);
  // console.log("orders", orders);


  const [invoiceData, setInvoiceData] = useState(null); // State to hold the invoice data
  const [userData, setUserData] = useState(null); // State to hold the user data


  useEffect(() => {
    generateInvoiceData(); // Generate invoice data when component mounts
    // generateUserDataHtml();
  }, []);

  // Add a state to hold the HTML content for the user data
const [userDataHtml, setUserDataHtml] = useState('');

// Function to generate HTML content for the user data
const generateUserDataHtml = (userData) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>User Account</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        
        .user-info {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
          font-size: 24px;
          margin-bottom: 10px;
        }
        
        p {
          margin: 0;
        }
        
        ul {
          padding: 0;
          margin: 10px 0;
          list-style-type: none;
        }
        
        li {
          padding: 10px;
          margin-bottom: 10px;
          background: #f9f9f9;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="user-info">
        <h1>User Account Information</h1>
        <p>Name: ${userData.name}</p>
        <p>Email: ${userData.email}</p>
        <p>Addresses:</p>
        <ul>
          ${userData.addresses.map((address, index) => `
            <li key=${index}>
              <p><strong>House No:</strong> ${address.houseNo}</p>
              <p><strong>Street:</strong> ${address.street}</p>
              <p><strong>Landmark:</strong> ${address.landmark}</p>
              <p><strong>Postal Code:</strong> ${address.postalCode}</p>
              <p><strong>Mobile No:</strong> ${address.mobileNo}</p>
            </li>
          `).join('')}
        </ul>
      </div>
    </body>
    </html>`;
};

// Function to handle printing user account information
const handlePrintUserData = async () => {
  try {
    if (user) {
      const html = generateUserDataHtml(user); // Generate HTML content for the user data
      console.log("Printing user data...");

      // Print the user data to a file
      const file = await printToFileAsync({
        html: html,
        base64: false
      });

      // Share the printed user data
      await shareAsync(file.uri);
    }
  } catch (error) {
    console.log("Error printing user data:", error);
  }
};

  const generateInvoiceData = async () => {
    try {
      const response = await axios.get(`http://${ip}:8000/orders/${userId}`);
     
      const orders = response.data.orders;

      setOrders(orders);
      
      setLoading(false);

      // Constructing invoice data object
      // var count = 0;
      const invoiceData = {
        invoiceDate: `${new Date().toLocaleDateString("de-DE")}`,
        billingCompany: "LFT",
        // count: parseInt(count+1),
        cartItems: orders.map((item) => ({
          products: item.products.map((product) => ({
            description: product.name.substring(0, 30) + '...',
            price: product.price,
            iquantity: product.quantity,
          })),
          quantity: item.products.length,
          paymentMethod: item.paymentMethod,
          date: item.createdAt,
          total: item.totalPrice.toFixed(2),
        })),
        // total: total.toFixed(2),
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
            <h1>Orders Data</h1>
            <p>Date: <span id="invoice-date">${invoiceData.invoiceDate}</span></p>
          </div>
        </div>
        
        <div class="table-container">
        <table>
        <thead>
            <tr>
                <th>Sr. No.</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Unit Quantity</th>
                <th>Total Price</th>
                <th>PaymentMethod</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            ${data.cartItems.map((item, index) => {
                let count = index + 1;
                return `
                    <tr>
                        <td>${count}</td>
                        <td colspan="3">
                            <table>
                                ${item.products.map(product => `
                                    <tr>
                                        <td>${product.description}</td>
                                        <td>${product.iquantity}</td>
                                        <td>$${product.price}</td>
                                    </tr>
                                `).join('')}
                            </table>
                        </td>
                        <td>${item.quantity}</td>
                        <td>$${item.total}</td>
                        <td>${item.paymentMethod}</td>
                        <td>${new Date(item.date).toLocaleDateString()}</td>
                    </tr>
                `;
            }).join('')}
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
    <ScrollView style={{ padding: 10, flex: 1, backgroundColor: "white" }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
        Welcome {user?.name}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
        }}
      >
        <Pressable
          onPress={handlePrintAndShare}
          style={{
            padding: 10,
            backgroundColor: "#E0E0E0",
            borderRadius: 25,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center" }}>Your orders</Text>
        </Pressable>

        <Pressable
          onPress={handlePrintUserData}
          style={{
            padding: 10,
            backgroundColor: "#E0E0E0",
            borderRadius: 25,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center" }}>Your Account</Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
        }}
      >
        <Pressable
          style={{
            padding: 10,
            backgroundColor: "#E0E0E0",
            borderRadius: 25,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center" }}>Buy Again</Text>
        </Pressable>

        <Pressable
          onPress={logout}
          style={{
            padding: 10,
            backgroundColor: "#E0E0E0",
            borderRadius: 25,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center" }}>Logout</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading ? (
          <Text>Loading...</Text>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <Pressable
              style={{
                marginTop: 20,
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#d0d0d0",
                marginHorizontal: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              key={order._id}
            >
              {/* Render the order information here */}
              {order.products.slice(0, 1)?.map((product) => (
                <View style={{ marginVertical: 10 }} key={product._id}>
                  <Image
                    source={{ uri: product.image }}
                    style={{ width: 100, height: 100, resizeMode: "contain" }}
                  />
                </View>
              ))}
            </Pressable>
          ))
        ) : (
          <Text>No orders found</Text>
        )}
      </ScrollView>
    </ScrollView>
  );
}

export default ProfileScreen

const styles = StyleSheet.create({})