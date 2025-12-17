import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

interface CustomAvatarProps {
  name: string;
  imageUri?: string | null;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: boolean;
}

const useProfileImage = ({alt}: {alt: string}): {profileText: string} => {
  const sentence = alt.trim();
  if (!sentence.length) return {profileText: ''};
  const words = sentence.split(' ');
  const initials = words.map(word => word[0].toUpperCase()).join('');
  return {profileText: initials.slice(0, 2)};
};

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  name,
  imageUri,
  size = 80,
  backgroundColor = 'gray',
  textColor = 'white',
  borderRadius = false,
}) => {
  const {profileText} = useProfileImage({alt: name});

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: borderRadius ? size / 2 : 10,
          backgroundColor,
        },
      ]}>
      {imageUri ? (
        <Image
          source={{uri: imageUri}}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: borderRadius ? size / 2 : 2,
            },
          ]}
          onError={() => console.warn('Failed to load image')}
        />
      ) : (
        <Text style={[styles.initials, {fontSize: size / 3, color: textColor}]}>
          {profileText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    fontWeight: 'bold',
  },
});

export default CustomAvatar;
