import { StyleSheet, Text, View, TouchableOpacity, Platform, Button,Alert } from 'react-native'
import { React, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';


const AdminReportScreen = () => {

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleStartDateChange = (event, date) => {
    setShowStartDatePicker(false);
    if (date !== undefined) {
      if (date <= endDate) {
        setStartDate(date);
      } else {
        Alert.alert('Invalid Date', 'Start date cannot be greater than end date');
      }
    }
  };

  const handleEndDateChange = (event, date) => {
    setShowEndDatePicker(false);
    if (date !== undefined) {
      if (date >= startDate) {
        setEndDate(date);
      } else {
        Alert.alert('Invalid Date', 'End date cannot be less than start date');
      }
    }
  };

  // console.log(startDate)
  // console.log(endDate)

  return (
    <>
      <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }}>Generate Report</Text>
      <Text style={{ fontSize: 15, color: 'grey' }}>Note : Generate Overall Report or Select date to generate specific period report</Text>
      <View style={{margin:15}}>
        <View>
          <Button title="Select Start Date" onPress={() => setShowStartDatePicker(true)} />
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              onChange={handleStartDateChange}
            />
          )}
          <Text>Start Date: {startDate.toDateString()}</Text>
        </View>
        <View>
          <Button title="Select End Date" onPress={() => setShowEndDatePicker(true)} />
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              onChange={handleEndDateChange}
            />
          )}
          <Text>End Date: {endDate.toDateString()}</Text>
        </View>
      </View>
      <View>
        {/* <Text>{startDate.toDateString()}</Text> */}
      </View>
    </>
  )
}

export default AdminReportScreen

const styles = StyleSheet.create({
  
})