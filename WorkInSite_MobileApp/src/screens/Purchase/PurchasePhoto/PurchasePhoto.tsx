
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import { Colors } from '../../../utils';
import { useTheme } from '../../../context/ThemeContext';
import { usePermission } from '../../../hook/usePermission';

interface NewImage {
  uri: string;
}

interface OldImage {
  id: number;
  staticBaseUrl: string;
  imagePath: string;
}

interface RemovedImage {
  id: number;
  imagePath: string;
}

interface Props {
  photo: NewImage[];
  setPhoto: React.Dispatch<React.SetStateAction<NewImage[]>>;
  showImages?: OldImage[];
  setShowImages?: React.Dispatch<React.SetStateAction<OldImage[]>>;
  removeImages?: RemovedImage[];
  setRemoveImages?: React.Dispatch<React.SetStateAction<RemovedImage[]>>;
  permissionKey?: string;
}

export default function PurchasePhoto({
  photo,
  setPhoto,
  showImages = [],
  setShowImages,
  removeImages = [],
  setRemoveImages,
   permissionKey,
}: Props) {
  
    const { canEdit } = usePermission()
    const hasPermission = permissionKey ? canEdit(permissionKey) : true;

  
  const [selected, setSelected] = useState<{
    type: 'new' | 'old';
    data: NewImage | OldImage | null;
  }>({ type: 'new', data: null });

  const getImageUri = () => {
    if (!selected.data) return '';
    if (selected.type === 'new') {
      return (selected.data as NewImage).uri;
    }
    const img = selected.data as OldImage;
    // return img.staticBaseUrl + img.imagePath;
    return `${img.staticBaseUrl}${img.imagePath}`;
  };

  const prepareLocalImage = async (uri: string, prefix = 'IMG') => {
    let localPath = uri;

    if (uri.startsWith('http')) {
      const fileName = `${prefix}_${Date.now()}.jpg`;
      localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      await RNFS.downloadFile({
        fromUrl: uri,
        toFile: localPath,
      }).promise;
    }

    if (!localPath.startsWith('file://')) {
      localPath = 'file://' + localPath;
    }

    return localPath;
  };

  const handleShare = async () => {
    try {
      const uri = getImageUri();
      if (!uri) return;

      const localPath = await prepareLocalImage(uri, 'SHARE');

      await Share.open({
        url: localPath,
        type: 'image/jpeg',
      });
    } catch (error: any) {
      if (!error?.message?.includes('User did not share')) {
        ToastAndroid.show('Share failed', ToastAndroid.SHORT);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const uri = getImageUri();
      if (!uri) return;

      if (Platform.OS === 'android') {
        const sdk = Number(Platform.Version);

        const permission =
          sdk >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const granted =
          (await PermissionsAndroid.request(permission)) ===
          PermissionsAndroid.RESULTS.GRANTED;

        if (!granted) {
          ToastAndroid.show('Permission denied', ToastAndroid.SHORT);
          return;
        }
      }

      const localPath = await prepareLocalImage(uri, 'IMG');

      await CameraRoll.save(localPath, { type: 'photo' });

      ToastAndroid.show('Image saved!', ToastAndroid.SHORT);
    } catch {
      ToastAndroid.show('Download failed', ToastAndroid.SHORT);
    }
  };


  const handleDelete = () => {
    if (!selected.data) return;

    Alert.alert('Delete Image', 'Do you want to Delete this image', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (selected.type === 'new') {
            setPhoto(prev =>
              prev.filter(i => i.uri !== (selected.data as NewImage).uri)
            );
          } else {
            const oldImg = selected.data as OldImage;

            setShowImages?.(prev =>
              prev.filter(i => i.id !== oldImg.id)
            );

            setRemoveImages?.(prev => [
              ...prev,
              { id: oldImg.id, imagePath: oldImg.imagePath },
            ]);
          }

          setSelected({ type: selected.type, data: null });
        },
      },
    ]);
  };

  return (
    <View style={{ paddingVertical: 10 }}>
      <ScrollView horizontal contentContainerStyle={styles.previewRow}>

        {photo
        .filter(img => typeof img?.uri === 'string' && img.uri.length > 0)
        .map((img,index) => (
          <TouchableOpacity
           key={`new-${img.uri}-${index}`}

            onPress={() => setSelected({ type: 'new', data: img })}
          >
            <Image source={{ uri: img.uri }} style={styles.previewImg} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>New</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* OLD IMAGES */}
        {showImages
        ?.filter(img => img?.staticBaseUrl && img?.imagePath)
        .map((img,index) => (
          <TouchableOpacity
             key={`old-${img.id}-${index}`}
            onPress={() => setSelected({ type: 'old', data: img })}
          >
            <Image
              source={{ uri: img.staticBaseUrl + img.imagePath }}
              style={styles.previewImg}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selected.data} transparent animationType="fade">
        <View style={styles.modal}>
          <Image source={{ uri: getImageUri() }} style={styles.fullImage} />

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => setSelected({ type: selected.type, data: null })}
            >
              <Ionicons name="close" size={28} color={Colors.white} />
              <Text style={styles.txt}>Closes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              style={[styles.modalButton, !hasPermission && { opacity: 0.4 }]}
            >
              <Ionicons name="share-social-outline" size={28} color={Colors.white} />
              <Text style={styles.txt}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDownload}
              style={[styles.modalButton, !hasPermission && { opacity: 0.4 }]}
            >
              <Ionicons name="download-outline" size={28} color={Colors.white} />
              <Text style={styles.txt}>Download</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDelete} style={[styles.modalButton, !hasPermission && { opacity: 0.4 }]}>
              <Ionicons name="trash-outline" size={28} color="red" />
              <Text style={[styles.txt, { color: Colors.dangerColor }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  previewRow: {
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  previewImg: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    borderColor: Colors.grayColor,
    borderWidth: 0.2,
  },
  badge: {
    position: 'absolute',
    backgroundColor: Colors.successColor,
    bottom: 2,
    right: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12
  },
  modal: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'contain',
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  txt: {
    color: Colors.white,
    marginTop: 6,
    fontSize: 12
  },
  modalButton: {
    alignItems: 'center',
  },
});
