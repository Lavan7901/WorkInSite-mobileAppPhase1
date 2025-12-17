import React from 'react';
import {Image} from 'react-native';
import images from '../../../..';

const Icons: {[key: string]: JSX.Element} = {
  GPAY: (
    <Image
      source={images.google_pay_img}
      style={{width: 40, height: 26}}
      resizeMode="center"
    />
  ),
  PHONEPE: (
    <Image source={images.phonepe_img} style={{width: 40, height: 26}} />
  ),
  UPI_ID: (
    <Image
      source={images.upi_img}
      style={{width: 40, height: 26}}
      resizeMode="center"
    />
  ),
  DEFAULT: (
    <Image
      source={images.logo}
      style={{width: 40, height: 26}}
      resizeMode="center"
    />
  ),
};

export {Icons};
