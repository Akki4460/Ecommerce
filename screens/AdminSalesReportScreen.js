import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, Modal, Pressable } from 'react-native'
import { React, useState, useContext, Pick } from 'react'
import axios from 'axios';
import { IpType } from '../IpContext';

import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { ScrollView } from 'react-native-gesture-handler';

const AdminSalesReportScreen = () => {


  const { ip, setIp } = useContext(IpType);

  // const [users, setUsers] = useState([]);
  // const [orders, setOrders] = useState([]);

  const [reportData, setReportData] = useState([]);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Months are zero-based

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const generateReport = async () => {
    try {
      const response = await axios.get(`http://${ip}:8000/orders/${selectedYear}/${selectedMonth}`);
      setReportData(response.data.orders);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };
  // console.log(startDate)
  // console.log(endDate)

  const handlePrintAndShare = async () => {
    try {
      const html = generateHtml(reportData);
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

  // Function to generate HTML content for the report

  const generateHtml = (data) => {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sample Report</title>
        <style>
          body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
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
      
          .report-info h1,
          .report-info p {
            margin: 0;
          }
      
          .order-details {
            width: 100%;
          }
      
          table {
            width: 100%;
            border-collapse: collapse;
          }
      
          th,
          td {
            padding: 8px;
            border: 1px solid #ddd;
          }
      
          th {
            background-color: #f2f2f2;
          }
      
          .order-details tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="report-header">
            <div class="report-logo">
              <h1>Lucifer</h1>
            </div>
            <div class="report-info">
              <h1>Sales Report</h1>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div class="order-details">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${data.map((order, index) => {
      return `
                    <tr>
                      <td rowspan="${order.products.length}">${order._id}</td>
                      ${order.products.map((product, productIndex) => {
        if (productIndex === 0) {
          return `
                            <td>${product.name}</td>
                            <td>${product.quantity}</td>
                            <td>${product.price}</td>
                            <td rowspan="${order.products.length}">${order.totalPrice}</td>
                            <td rowspan="${order.products.length}">${new Date(order.createdAt).toLocaleDateString()}</td>
                          `;
        } else {
          return `
                            <tr>
                              <td>${product.name}</td>
                              <td>${product.quantity}</td>
                              <td>${product.price}</td>
                            </tr>
                          `;
        }
      }).join('')}
                    </tr>
                  `;
    }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </body>
      </html>`;
  };


  const toggleMonthPicker = () => {
    setShowMonthPicker(!showMonthPicker);
  };

  const toggleYearPicker = () => {
    setShowYearPicker(!showYearPicker);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setShowYearPicker(false);
  };



  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.header}>Generate Report</Text>
          <View style={styles.pickerContainer}>
            <Text>Select Month:</Text>
            <TouchableOpacity onPress={toggleMonthPicker} style={styles.pickerButton}>
              <Text>{selectedMonth}</Text>
            </TouchableOpacity>
            <Modal visible={showMonthPicker} animationType="slide">
              <View style={styles.modalContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "all"].map(month => (
                  <TouchableOpacity key={month} style={styles.modalItem} onPress={() => handleMonthSelect(month)}>
                    <Text>{month}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Modal>
          </View>
          <View style={styles.pickerContainer}>
            <Text>Select Year:</Text>
            <TouchableOpacity onPress={toggleYearPicker} style={styles.pickerButton}>
              <Text>{selectedYear}</Text>
            </TouchableOpacity>
            <Modal visible={showYearPicker} animationType="slide">
              <View style={styles.modalContainer}>
                {[2022, 2023, 2024].map(year => (
                  <TouchableOpacity key={year} style={styles.modalItem} onPress={() => handleYearSelect(year)}>
                    <Text>{year}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Modal>
          </View>
          <View style={styles.buttonContainer}>
            {/* <Pressable style={styles.btn} title="Generate Report" onPress={generateReport} /> */}
            {/* <Pressable style={styles.btn} title="Print and Share Report" onPress={handlePrintAndShare} /> */}
            <Pressable style={{
              padding: 10,
              backgroundColor: "#232323",
              borderRadius: 5,
              alignSelf: 'center'
            }}
              onPress={generateReport}><Text style={{  color: "#fff",
              fontSize: 16,
              fontWeight:'bold'}}>Generate Report</Text></Pressable>
            <Pressable
              style={{
                padding: 10,
                backgroundColor: "#232323",
                borderRadius: 5,
              }} onPress={handlePrintAndShare}><Text style={{  color: "#fff",
              fontSize: 16,
              fontWeight:'bold'}}>Print and Share Report</Text></Pressable>
          </View>
          {/* Display report data */}
          {reportData.map((order, index) => (
            <View
              key={index}
              style={styles.orderContainer}
            >
              <Text style={{fontWeight:'bold', textAlign:'center'}}>OrderId:{order._id}</Text>
              <Text style={{fontWeight:'400', textAlign:'center'}}>-------------------</Text>
              {/* Render the order information */}
              {order.products.map((product, productIndex) => (
                <View style={styles.productContainer} key={productIndex}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                  />
                  <View>
                    <Text>{product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name}</Text>
                    <Text>Price: Rs {product.price}</Text>
                    <Text>Quantity: {product.quantity}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

    </>
  )
}

export default AdminSalesReportScreen

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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItem: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  buttonContainer: {
    marginBottom: 10,
    gap: 10,
    marginTop: 10,
  },
  orderContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d0d0",
  },
  productContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});