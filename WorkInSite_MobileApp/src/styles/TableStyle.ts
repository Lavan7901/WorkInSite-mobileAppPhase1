import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e6e6e6',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  tableActionHeader: {
    width: 80,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  tableEvenRow: {
    backgroundColor: '#f9f9f9',
  },
  tableOddRow: {
    backgroundColor: '#ffffff',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  tableCellPerson: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  tableActionButton: {
    width: 40,
    alignItems: 'center',
  },
  tableListItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginBottom: 8,
    alignItems: 'center',
  },
  tableActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  tableSpaceActions: {
    flexDirection: 'row',
    gap: 8,
  },
});

// import {StyleSheet} from 'react-native';

// export default StyleSheet.create({
//   tableContainer: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   tableHeaderRow: {
//     flexDirection: 'row',
//     backgroundColor: '#e6e6e6',
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//   },
//   tableHeaderText: {
//     fontWeight: 'bold',
//     color: '#333',
//     fontSize: 16,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//   },
//   tableEvenRow: {
//     backgroundColor: '#f9f9f9',
//   },
//   tableOddRow: {
//     backgroundColor: '#ffffff',
//   },
//   tableCell: {
//     fontSize: 16,
//     color: '#333',
//   },
//   tableCellSub: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   tableActionButton: {
//     padding: 4,
//   },

//   // === COLUMN STYLES ===
//   colRole: {
//     flex: 2,
//     justifyContent: 'center',
//   },
//   colNumber: {
//     flex: 1,
//     // alignItems: 'center',
//     // justifyContent: 'center',
//   },
//   colAction: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },
// });
