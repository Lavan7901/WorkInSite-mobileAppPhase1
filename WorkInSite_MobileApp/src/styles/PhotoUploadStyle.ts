import {StyleSheet} from 'react-native';
import { Colors } from '../utils';

export default StyleSheet.create({
    uploadButton: {
           flexDirection: 'row',
           alignItems: 'center',
           backgroundColor: '#f1f1f1',
           padding: 4,
           borderRadius: 8,
           justifyContent: 'center',
           marginBottom: 16,
       },
       uploadText: {
           marginLeft: 8,
           fontSize: 14,
           fontWeight: 'bold',
       },
        imageContainer: {
           width: '100%',
         },
         imageGrid: {
           flexDirection: 'row',
           flexWrap: 'wrap',
           justifyContent: 'flex-start',
           alignItems: 'center',
           gap: 10,
         },
         imageWrapper: {
           position: 'relative',
           marginBottom: 10,
           width: '30%',
         },
         gridImage: {
           width: '100%',
           height: 100,
           borderRadius: 10,
         },
         deleteButton: {
           position: 'absolute',
           top: -8,
           right: -8,
           backgroundColor: Colors.white,
           borderRadius: 12,
           padding: 2,
         },
         menuButton: {
            position: 'absolute',
            top: -1,
            right: -1,
           padding:1,
            borderRadius: 0,
            elevation: 2,
            backgroundColor: Colors.white,
          },
          
          popupMenu: {
            position: 'absolute',
            top: -20,
            right: -90,
            backgroundColor: Colors.white,
            padding: 8,
            borderRadius: 8,
            elevation: 5,
            zIndex: 999,
          },
          
          menuOption: {
            paddingVertical: 4,
            paddingHorizontal: 10,
            fontSize: 14,
            color: Colors.black,
          },
          
});
