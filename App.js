import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import StackNavigation from './navigation/StackNavigation';
import { Provider } from 'react-redux';
import store from './store';
import { ModalPortal } from 'react-native-modals';
import { UserContext } from './UserContext';
import { IpContext } from './IpContext';


export default function App() {
  return (
    <>
      <Provider store={store}>
        <IpContext>
          <UserContext>
            <StackNavigation />
            <ModalPortal />
          </UserContext>
        </IpContext>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



// 0.0.0.0/0 IP for mongoDB