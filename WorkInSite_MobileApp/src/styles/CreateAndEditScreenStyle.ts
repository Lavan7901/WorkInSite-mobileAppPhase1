import {StyleSheet} from 'react-native';
import {Colors} from '../utils';
import {Theme} from '../context/ThemeContext'; // Your theme type

 export const getCreateAndEditScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    moreDetails: {
      fontWeight: 'bold',
      marginTop: 6,
      fontSize: 16,
      color: theme.secondaryColor,
      textDecorationLine: 'underline',
    },
    PinConatiner: {
      alignItems: 'flex-end',
    },
    PinButton: {
      borderBottomWidth: 1,
      borderColor: theme.secondaryColor,
    },
    PinLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.secondaryColor,
      textAlign: 'center',
    },
    spaceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    badge: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    buttonWidht: {
      width: '100%',
    },
    iconAndLabel: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 3,
      marginTop: 8,
    },
    labelStyle: {
      marginLeft: 8,
      fontSize: 16,
      color: Colors.grayColor,
      flex: 1,
    },
    flexendContainer: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'flex-end',
    },
    iconSpacer: {
      flexDirection: 'row',
      gap: 10,
    },
  });





// import { StyleSheet } from "react-native";
// import { Colors } from "../utils";

// export default StyleSheet.create({
//     moreDetails: {
//         fontWeight:'bold',
//         marginTop: 6,
//         fontSize: 16,
//         color: Colors.secondaryColor,
//         textDecorationLine: 'underline',
//       },
//       PinConatiner: {
//         alignItems: 'flex-end',
//       },
//       PinButton: {
//         borderBottomWidth: 1,
//         borderColor: Colors.secondaryColor,
//       },
//       PinLabel: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: Colors.secondaryColor,
//         textAlign: 'center',
//       },
//       spaceContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//       },
//       badge: {
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//         backgroundColor: Colors.primaryColor,
//         justifyContent: 'center',
//         alignItems: 'center',
//       },
//       badgeText: {
//         color: '#fff',
//         fontWeight: 'bold',
//       },
//       iconContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap:10,
//       },
//       itemContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'flex-start',
//       },
//       buttonWidht: {
//         width: '100%',
//       },
//       iconAndLabel: {
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         flex: 3,
//         marginTop: 8,
//       },
//       labelStyle: {
//         marginLeft: 8,
//         fontSize: 16,
//         color: Colors.grayColor,
//         flex: 1,
//       },
//       flexendContainer: {
//         flexDirection: 'row',
//         flex: 1,
//         justifyContent: 'flex-end',
//       },
//       iconSpacer: {
//         flexDirection: 'row',
//         gap: 10,
//       },
// });