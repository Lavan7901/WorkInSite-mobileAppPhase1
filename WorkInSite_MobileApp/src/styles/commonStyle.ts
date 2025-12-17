import {StyleSheet} from 'react-native';
import {Colors, SH} from '../utils';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  spaceBelow:{
   marginBottom: 20,
  },
  alignContent: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },

  description: {
    fontSize: 14,
    color: Colors.grayColor,
  },
  labelText: {
    fontSize: 16,
    color: Colors.grayColor,
  },
   label: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },
   labelStyle: {
    fontSize: 18,
    fontWeight: '700',
     color: Colors.grayColor,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
   titleStyle: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    marginTop: 40,
  },
  pointerDisableInput:{
    pointerEvents: "none",
    opacity: 0.7,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toast: {
    position: 'absolute',
    zIndex: 9999,
    top: 1,
    right: 1,
    left: 1,
  },
  inputfieldContainer: {
    padding: SH(12),
    gap: 8,
  },
  customSheetInputfieldSpacer: {
    gap: 12,
  },
  spacer: {
    gap: 16,
  },
  flexContainer: {
    flexGrow: 1,
    backgroundColor:Colors.white,
  },
  gapContainer:{
    gap:10,
  },
  error:{
    fontSize: 16,
    color: Colors.dangerColor
  }
});