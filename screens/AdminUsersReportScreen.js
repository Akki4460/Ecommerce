import { StyleSheet, Text, View,ScrollView, Pressable,Alert } from 'react-native'
import {React, useContext,useState,useEffect} from 'react'
import axios from 'axios';

import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

import { IpType } from '../IpContext';


const AdminUsersReportScreen = () => {
    const { ip } = useContext(IpType);
    const [userData, setUserData] = useState([]);
  
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://${ip}:8000/users`);
        setUserData(response.data.users);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    useEffect(() => {
      fetchUserData();
    }, []);
  
    const handlePrintAndShare = async () => {
        try {
          const html = generateHtml(userData);
          const file = await printToFileAsync({
            html: html,
            base64: false
          });
          await shareAsync(file.uri);
        } catch (error) {
          console.log("Error printing and sharing report:", error);
          Alert.alert("Error", "Failed to print and share report");
        }
      };
      const generateHtml = (data) => {
        let html = '<html><head><style>';
        html += `
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            width:80%;
            margin:auto;
          }
          .report-container {
            width: 80%;
            margin: auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .report-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .report-logo {
            width: 200px;
          }
          .report-info {
            text-align: right;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
          }
          h2 {
            font-size: 20px;
            margin-bottom: 10px;
          }
          h3 {
            font-size: 16px;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        `;
        html += '</style></head><body>';
      
        // Generate user report
        html += `<div class="report-container"><div class="report-header"><div class="report-logo"><h1>Lucifer</h1></div><div class="report-info"><h1>Users Data</h1><p>Date: ${new Date().toLocaleDateString()}</p></div></div></div>`;
        data.forEach(user => {
          html += `<div><h2>Name: ${user.name}</h2><h3>Email: ${user.email}</h3>`;
          if (user.addresses.length > 0) {
            html += '<table><tr><th>Name</th><th>Mobile No</th><th>House No</th><th>Street</th><th>Landmark</th><th>Postal Code</th></tr>';
            user.addresses.forEach(address => {
              html += `<tr><td>${address.name}</td><td>${address.mobileNo}</td><td>${address.houseNo}</td><td>${address.street}</td><td>${address.landmark}</td><td>${address.postalCode}</td></tr>`;
            });
            html += '</table>';
          }else{
            html+='<h3>Addresses: Not Added</h3>'
          }
          html += '</div><hr>';
        });
      
        html += '</body></html>';
        return html;
      };
      
            
  return (
    <>
       <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Users Report</Text>
        {/* Display user data */}
        {userData.map((user, index) => (
          <View key={index} style={styles.userContainer}>
            <Text style={{fontWeight:'bold'}}>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Addresses:</Text>
            {user.addresses.map((address, addressIndex) => (
              <View key={addressIndex} style={styles.addressContainer}>
                <Text>{address.name}</Text>
                <Text>{address.mobileNo}</Text>
                <Text>{address.houseNo}, {address.street}</Text>
                <Text>{address.landmark}</Text>
                <Text>{address.postalCode}</Text>
              </View>
            ))}
            <Text>CreatedAt: {new Date(user.createdAt).toLocaleDateString()}</Text>
          </View>
        ))}
        <Pressable onPress={handlePrintAndShare} style={styles.printButton}>
          <Text style={styles.printButtonText}>Print User Report</Text>
        </Pressable>
      </View>
    </ScrollView>
    </>
  )
}

export default AdminUsersReportScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    header: {
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
    userContainer: {
      marginBottom: 20,
      padding: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      width:'80%'
    },
    printButton: {
      backgroundColor: "#232323",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginTop: 20,
      marginBottom:20,
    },
    printButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight:'bold'
    },
  });