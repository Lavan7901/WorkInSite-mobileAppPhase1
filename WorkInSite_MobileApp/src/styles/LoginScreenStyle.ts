import { StyleSheet } from "react-native";
import { Colors } from "../utils";

export default StyleSheet.create({
    scrollviewstyles: {
        width: '100%',
        height: 'auto',
      },
      imageContainer: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        zIndex: 1,
      },
      gradientBackground: {
        ...StyleSheet.absoluteFillObject,
      },
      topImage: {
        width: '70%',
        height: 180,
        resizeMode: 'contain',
        marginBottom: 10,
      },
      loginLogo: {
        width: '50%',
        height: 130,
        resizeMode: 'contain',
        marginBottom: 20,
      },
      loginScreen: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        zIndex: 2,
      },
      loginLink: {
        color: Colors.grayColor,
        fontWeight: '500',
        fontSize: 16,
      },
      text: {
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
      },

});