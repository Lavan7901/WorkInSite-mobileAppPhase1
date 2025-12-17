import React from 'react';
import {Image, StyleSheet} from 'react-native';
import images from '../../../..';
import Icon from '../../../../utils/VectorIcons';
import { Colors } from '../../../../utils';

const styles = StyleSheet.create({
  image: {
    width: 35,
    height: 20,
  },
});

const Icons: {[key: string]: JSX.Element} = {
  AADHAAR: (
    <Image
      source={images.aadhar_img}
      style={styles.image}
      resizeMode="contain" 
    />
  ),
  PAN: (
    <Image
      source={images.pan_img}
      style={styles.image}
      resizeMode="contain" 
    />
  ),
  GST: (
    <Image
      source={images.gst_img}
      style={styles.image}
      resizeMode="contain" 
    />
  ),
  DEFAULT: <Icon icon="Feather" name="info" size={24} color={Colors.black}  />,
};

export {Icons};
