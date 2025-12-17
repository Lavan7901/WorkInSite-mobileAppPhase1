

import {StyleSheet} from 'react-native';
import {Theme} from '../context/ThemeContext'; 
import { Colors } from '../utils';

export const getVerificationScreenStyles = (theme: Theme) =>
  StyleSheet.create({
subtextContainer: {
  marginBottom: 20,
},
subtext: {
  fontSize: 16,
  color: theme.secondaryColor,
  marginBottom: 6, 
},
numtext:{
    fontSize: 16,
   color: theme.secondaryColor,
   marginBottom: 6, 
    fontWeight: '600',
},
  resendRow: { 
    flexDirection: 'row', 
    alignItems: 'center' ,
    textAlign: 'right',
    justifyContent: 'flex-end',
},
  resendText:{ 
    color: theme.secondaryColor, 
   },
  resendLink: { 
    marginLeft: 5, 
    color: theme.secondaryColor, 
    fontWeight: '600' 
  },
  headerContainer: {
    backgroundColor: Colors.white, 
    paddingHorizontal: 10,
    paddingVertical:20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconButton: {
    marginRight: 10,
  },

  headerLabel: {
    color: Colors.black,
    fontSize: 32,
    fontWeight: '700',
  },
});