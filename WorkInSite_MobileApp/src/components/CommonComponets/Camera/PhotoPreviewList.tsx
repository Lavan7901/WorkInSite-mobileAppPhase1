import React from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PhotoMeta } from './Camera';

type Props = {
  photoMeta: PhotoMeta[];
  onDelete: (index: number) => void;
  scrollViewRef: any,
};

const PhotoPreviewList: React.FC<Props> = ({ photoMeta, onDelete, scrollViewRef }) => (
  <View style={styles.wrapper}>
    <Text style={styles.title}>Captured Photos</Text>
    <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {photoMeta.map((photo, index) => (
        <View key={index} style={styles.imageWrapper}>
          <Image source={{ uri: photo.uri }} style={styles.image} />
          <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(index)}>
            <Ionicons name="close-circle" size={20} color="red" />
          </TouchableOpacity>
          <Text style={styles.label}>#{index + 1}</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', bottom: 120, width: '100%' },
  title: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 20, marginBottom: 5 },
  container: { paddingHorizontal: 20 },
  imageWrapper: { marginRight: 12, alignItems: 'center', position: 'relative' },
  image: { width: 100, height: 100, borderRadius: 12, borderWidth: 1, borderColor: '#fff' },
  deleteButton: { position: 'absolute', top: 5, right: 5, backgroundColor: '#000000aa', borderRadius: 12 },
  label: { color: '#fff', marginTop: 4, fontSize: 12, fontWeight: '500', textAlign: 'center' },
});

export default PhotoPreviewList;
