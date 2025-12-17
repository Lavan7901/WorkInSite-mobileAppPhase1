import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  title?: string;
  subtitle?: string;
  onCameraPress: () => void;
  onGalleryPress: () => void;
};

const CameraGalleryChooser: React.FC<Props> = ({
  title = 'Select an Option',
  subtitle = 'Choose to capture a new photo or pick from gallery',
  onCameraPress,
  onGalleryPress,
}) => {
  const { theme } = useTheme()
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.container}>
        <TouchableOpacity style={styles.option} onPress={onCameraPress}>
          <View style={styles.iconWrapper}>
            <Icon name="photo-camera" size={60} color={theme.secondaryColor} />
          </View>
          <Text style={styles.text}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={onGalleryPress}>
          <View style={styles.iconWrapper}>
            <Icon name="photo-library" size={60} color={theme.secondaryColor} />
          </View>
          <Text style={styles.text}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CameraGalleryChooser;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  option: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  iconWrapper: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 50,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  text: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },

});