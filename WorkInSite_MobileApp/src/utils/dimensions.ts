import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

export const SW = (dimension: number) => {
  return scale(dimension); // Horizontal scaling
};

export const SH = (dimension: number) => {
  return verticalScale(dimension); // Vertical scaling
};

export const SF = (dimension: number) => {
  return moderateScale(dimension); // Font scaling
};

export const heightPercent = (percent: number) => {
  return verticalScale((percent / 100) * 812); // Replace 812 with base height
};

export const widthPercent = (percent: number) => {
  return scale((percent / 100) * 375); // Replace 375 with base width
};

export const fontPercent = (percent: number) => {
  return moderateScale((percent / 100) * 812); // Font scaling with moderateScale
};
