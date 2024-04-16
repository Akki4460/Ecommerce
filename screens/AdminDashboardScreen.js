import { StyleSheet, Text, View, ImageBackground, ScrollView } from 'react-native'
import { React, useContext, useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { IpType } from '../IpContext';
import axios from 'axios';

const AdminDashboardScreen = () => {

  const { ip, setIp } = useContext(IpType);

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [orderMonthCount, setOrderMonthCount] = useState(0);
  const [orderYearCount, setOrderYearCount] = useState(0);




  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://${ip}:8000/users`);
        setUsers(response.data.users);

        const count = response.data.users.length;
        setUserCount(count);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://${ip}:8000/orders`);
        setOrders(response.data.orders);

        const count = response.data.orders.length;
        setOrderCount(count);

      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const fetchMonthOrders = async (year, month) => {
    try {
      const response = await axios.get(`http://${ip}:8000/orders/${year}/${month}`);
      setOrders(response.data.orders);

      const count = response.data.orders.length;
      setOrderMonthCount(count);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  const fetchYearOrders = async (year, month) => {
    try {
      const response = await axios.get(`http://${ip}:8000/orders/${year}/${month}`);
      setOrders(response.data.orders);

      const count = response.data.orders.length;
      setOrderYearCount(count);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Example: Fetch orders for April 2024
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 to adjust the zero-based value
    const currentYear = currentDate.getFullYear();
    fetchMonthOrders(2024, currentMonth); // Specify the year and month here
    fetchYearOrders(currentYear,"all")
  }, []);



  return (
    <>

      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
        <View>
          <View style={styles.container}>
            <LinearGradient
              colors={['#ec008c', '#fc6767']}
              style={styles.linearGradient}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', alignSelf: 'flex-start', paddingHorizontal: 10 }}>Users</Text>
              <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-end', paddingHorizontal: 10, paddingTop: 25 }}>{userCount}</Text>
            </LinearGradient>
          </View>

          <View style={styles.container}>
            <LinearGradient
              colors={['#00B4DB', '#0083B0']}
              style={styles.linearGradient}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', alignSelf: 'flex-start', paddingHorizontal: 10 }}> Yearly Sales</Text>
              <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-end', paddingHorizontal: 10, paddingTop: 25 }}>{orderYearCount}</Text>
            </LinearGradient>
          </View>
        </View>

        <View>
          <View style={styles.container}>
            <LinearGradient
              colors={['#56ab2f', '#a8e063',]}
              style={styles.linearGradient}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', alignSelf: 'flex-start', paddingHorizontal: 10 }}>Total Sales</Text>
              <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-end', paddingHorizontal: 10, paddingTop: 25 }}>{orderCount}</Text>
            </LinearGradient>
          </View>

          <View style={styles.container}>
            <LinearGradient
              colors={['#F7971E', '#FFD200']}
              style={styles.linearGradient}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', alignSelf: 'flex-start', paddingHorizontal: 10 }}>Monthly Sales</Text>
              <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-end', paddingHorizontal: 10, paddingTop: 25 }}>{orderMonthCount}</Text>
            </LinearGradient>
          </View>
        </View>

      </View>
    </>
  )
}

export default AdminDashboardScreen

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginVertical: 10
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 100,
    width: 150,
  },
})