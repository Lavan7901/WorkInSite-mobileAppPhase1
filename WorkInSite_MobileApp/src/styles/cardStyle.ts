import { StyleSheet } from 'react-native';
import { Colors } from '../utils';
import { Theme } from '../context/ThemeContext';

export const getCardStyle = (theme: Theme) =>
  StyleSheet.create({
  cardContainer: {
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: "center",
    gap: 10,
  }, 
  cardColumn: {
    flexDirection: 'column',
    gap: 5,
  },
  cardRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
  },
  cardFlex: {
    flex: 1,
  },
  cardSpaceBetweenContent:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
   cardDetailSpacer: {
    flex: 1,
    gap: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.secondaryColor,
  },
  cardText: {
    fontSize: 14,
    color: Colors.grayColor,
  },
  cardNumText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.grayColor,
  },
   cardAmountText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.successColor,
  },
  
  cardTextTransform: {
    textTransform: 'uppercase',
  },
  cardLinkText: {
    textDecorationLine: 'underline',
  },
  cardButtonText:{
    color: Colors.white,
    fontWeight: '700',
  },
  cardFlexandRight:{
    textAlign:'right',
    flex: 0.8,
  },
  cardGap:{
    gap:10,
  },
  cardActionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAvatarContainer: {
    position: 'relative',
  },
  cardAvatarIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  cardIconCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    width: 28,
    height: 28,
  },
  cardDetailItemCircle:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
cardDetailWrapSpacer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},
cardFlexItems: {
  width: '48%', 
  justifyContent: 'center', 
},
 cardDivider: { 
    height: 0.5, 
    backgroundColor: "#e1e1e4ff",
    width: '100%',
    marginVertical: 4,
  },
});
