import { StyleSheet } from "react-native";
import { Colors } from "../utils";

export default StyleSheet.create({
    getStartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      getStartCard: {
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      },
      getStartContent: {
        alignItems: 'center',
      },
      getStartImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
      },
      getStartTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
      },
      getStartDescription: {
        fontSize: 16,
        color: Colors.grayColor,
        textAlign: 'center',
        marginBottom: 20,
      },
});