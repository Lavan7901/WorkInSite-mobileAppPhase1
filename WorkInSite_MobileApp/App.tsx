// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet } from 'react-native';
// import NetInfo from '@react-native-community/netinfo';
// import { NavigationContainer } from '@react-navigation/native';
// import DrawerNavigator from './src/navigation/DrawerNavigator';
// import OfflineScreen from './src/screens/OfflineScreen.tsx/OfflineScreen';
// import { ThemeProvider } from './src/context/ThemeContext';
// import { LanguageProvider } from './src/context/LanguageContext';

// const App = () => {
//   const [isConnected, setIsConnected] = useState<boolean>(true);
//   useEffect(() => {
//     // Subscribe to network state changes
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected ?? false);
//     });
//     // Cleanup subscription
//     return () => unsubscribe();
//   }, []);
//   return (
//       <View style={styles.container}>
//         <LanguageProvider>
//           <ThemeProvider>
//             <>
//               {isConnected ? (
//                 <NavigationContainer>
//                   <DrawerNavigator />
//                 </NavigationContainer>
//               ) : (
//                 <OfflineScreen />
//               )}</>
//           </ThemeProvider>
//         </LanguageProvider>
//       </View>

//   );
// };
// export default App;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// }); 


import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import OfflineScreen from './src/screens/OfflineScreen.tsx/OfflineScreen';
import { AppProviders } from './src/context/AppProviders';

const App = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <AppProviders>
        {isConnected ? (
          <NavigationContainer>
            <DrawerNavigator />
          </NavigationContainer>
        ) : (
          <OfflineScreen />
        )}
      </AppProviders>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({ container: { flex: 1 } });

