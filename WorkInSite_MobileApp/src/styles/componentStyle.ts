import {StyleSheet} from 'react-native';
import {Colors, SW} from '../utils';
import {SF, SH} from '../utils';

const componentStyle = StyleSheet.create({
  // 📌 INPUT STYLES

  inputContainer: {
    height: 50,
  },
  textAreaInputContainer: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: Colors.grayColor,
    padding: 12,
    borderRadius: SH(7),
    backgroundColor: Colors.white,
  },
  inputPadding: {
    padding: 12,
  },
  inputWithIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputFocusedBorder: {
    borderColor: Colors.primaryColor,
  },
  inputBlurredBorder: {
    borderColor: Colors.grayColor,
  },
  inputDisabled: {
    // backgroundColor: Colors.lightGray,
    // borderColor: Colors.lightGray,
    backgroundColor: Colors.disabledBg,
    borderColor: Colors.disabledBg,
    opacity: 0.6,
  },

  // 🏷️ LABEL / TEXT STYLES

  label: {
    fontSize: SF(16),
    color: Colors.black,
    fontWeight: '500',
    paddingBottom: SH(2),
  },
  headerLabel: {
    fontSize: SF(18),
    color: Colors.white,
    fontWeight: 'bold',
  },
  requiredAsterisk: {
    color: Colors.dangerColor,
    fontSize: 16,
  },
  inputText: {
    fontSize: SF(16),
    color: Colors.grayColor,
  },
  errorMessage: {
    marginTop: SH(2),
    color: Colors.dangerColor,
    fontSize: SF(14),
  },
  textDisabled: {
    color: Colors.grayColor,
    opacity: 0.6,
  },
  textCount: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    fontSize: 12,
    color: Colors.grayColor,
  },

  // 🎯 ICON STYLES

  iconPadding: {
    padding: 8,
  },
  iconDisabled: {
    color: Colors.lightGray,
    opacity: 0.6,
  },
  typeIconRightSpacing: {
    marginRight: 8,
  },
  typeIconLeftSpacing: {
    marginLeft: 8,
  },
  typeIconBottomSpacing: {
    marginBottom: 10,
  },

  // 📥 DROPDOWN STYLES

  dropdownBox: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: SH(7),
    borderColor: Colors.grayColor,
    backgroundColor: Colors.white,
  },
  selectedItem: {
    backgroundColor: Colors.selecthoverbgcolor,
  },

  // 📊 RADIO BUTTON STYLES

  radioGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingRight: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  selectedRadioCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // ℹ️ TOOLTIP / OVERLAY STYLE

  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainer: {
    backgroundColor: '#fff',
    borderRadius: SH(7),
    padding: 16,
    width: 200,
    elevation: 4,
  },

  // 📦 MISCELLANEOUS / LAYOUT STYLES

  typeRowBetweenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  typeRowIconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 16,
    color: Colors.grayColor,
    flexShrink: 1,
  },
  typeLinkText: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  typeColumnSpacerContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  topSpacing: {
    marginTop: SH(5),
  },
  paddingHorizontal: {
    paddingHorizontal: 10,
  },
  marginHorizontal: {
    marginHorizontal: 5,
  },

  // Pin Component Styles
  directionColumn: {
    flexDirection: 'column',
  },
  pinContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pinCodeContainer: {
    borderBottomWidth: 2,
    borderColor: Colors.grayColor,
    width: SW(60),
    height: SH(50),
    marginHorizontal: SW(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCodeText: {
    fontSize: SF(24),
    color: Colors.black,
  },
  focusStick: {
    width: 2,
    height: 25,
    marginTop: 4,
  },

  filledPinCodeContainer: {
    // borderColor: Colors.successColor,
  },
  disabledPinCodeContainer: {
    borderColor: Colors.grayColor,
    backgroundColor: '#f2f2f2',
  },
  placeholderText: {
    color: Colors.lightGray,
    fontSize: SF(24),
  },

  // Custom Bottom Sheet Styles

  customSheetContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetTitle: {
    fontSize: SF(20),
    fontWeight: 'bold',
    color: Colors.black,
  },

  // Search Bar Styles

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.grayColor,
    borderWidth: 1,
    borderRadius: SH(7),
    paddingHorizontal: 10,
    height: 50,
    margin: 16,
  },
  searchInputText: {
    flex: 1,
    fontSize: SF(16),
    color: Colors.black,
  },
  searchResultText: {
    fontSize: SF(16),
    color: Colors.grayColor,
    flexShrink: 1,
  },
});

export default componentStyle;
