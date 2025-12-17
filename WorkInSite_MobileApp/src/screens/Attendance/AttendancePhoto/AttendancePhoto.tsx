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
import { usePermission } from '../../../hook/usePermission';


type UploadedImage = { uri: string };
type ViewImage = { id: number; imagePath: string; staticBaseUrl: string };
type RemoveImage = { id: number; imagePath: string };

interface Props {
    uploadedImages: UploadedImage[];
    setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
    viewImages?: ViewImage[];
    setViewImages?: React.Dispatch<React.SetStateAction<ViewImage[]>>;
    removeImages?: RemoveImage[];
    setRemoveImages?: React.Dispatch<React.SetStateAction<RemoveImage[]>>;
    permissionKey?: string;
}

export default function AttendancePhoto({
    uploadedImages,
    setUploadedImages,
    viewImages,
    setViewImages,
    // removeImages,
    setRemoveImages,
    permissionKey
}: Props) {
    const { canEdit } = usePermission()
    const hasPermission = permissionKey ? canEdit(permissionKey) : true;

    const [selected, setSelected] = useState<{
        type: 'uploaded' | 'view';
        data: UploadedImage | ViewImage | null;
    }>({ type: 'uploaded', data: null });

    // ✅ Works for both new & old images
    const getImageUri = () => {
        if (!selected.data) return '';

        if (selected.type === 'uploaded') {
            return (selected.data as UploadedImage).uri;
        }

        const img = selected.data as ViewImage;
        return `${img.staticBaseUrl}${img.imagePath}`;
    };

    // const handleShare = async () => {
    //     try {
    //         await Share.open({ url: getImageUri() });
    //     } catch (error: any) {
    //         // If user closes the share menu, do nothing (prevent unwanted alerts)
    //         if (error?.message?.includes('User did not share')) return;
    //         // Otherwise show error feedback
    //         ToastAndroid.show('Failed to share image ❌', ToastAndroid.SHORT);
    //     }
    // };


    const handleShare = async () => {
        try {
            const uri = getImageUri();
            if (!uri) return;

            let localPath = uri;

            // ✅ 1. If server image → download it first
            if (uri.startsWith('http')) {
                const fileName = `SHARE_IMG_${Date.now()}.jpg`;
                localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

                await RNFS.downloadFile({
                    fromUrl: uri,
                    toFile: localPath,
                }).promise;
            }

            // ✅ 2. If Base64 → convert to file
            if (uri.startsWith('data:image/')) {
                const base64 = uri.split(',')[1];
                const fileName = `SHARE_IMG_${Date.now()}.jpg`;
                localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
                await RNFS.writeFile(localPath, base64, 'base64');
            }

            // ✅ 3. If local image path → ensure file:// prefix
            if (!localPath.startsWith('file://')) {
                localPath = `file://${localPath}`;
            }

            // ✅ Share actual image file (not URL)
            await Share.open({
                url: localPath,
                type: 'image/jpeg',
            });

        } catch (error: any) {
            if (error?.message?.includes('User did not share')) return;
            ToastAndroid.show('Failed to share image ❌', ToastAndroid.SHORT);
        }
    };

    const downloadImage = async () => {
        try {
            const uri = getImageUri();

            if (!uri) return;

            // ✅ Permissions
            if (Platform.OS === 'android') {
                const sdkInt = parseInt(Platform.Version.toString());
                let permissionGranted = false;

                if (sdkInt >= 33) {
                    const mediaPermission = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                    );
                    permissionGranted = mediaPermission === PermissionsAndroid.RESULTS.GRANTED;
                } else {
                    const writePermission = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                    );
                    permissionGranted = writePermission === PermissionsAndroid.RESULTS.GRANTED;
                }

                if (!permissionGranted) {
                    ToastAndroid.show('Permission Denied', ToastAndroid.SHORT);
                    return;
                }
            }

            let localPath = uri;

            // ✅ If image is remote (server URL), download first
            if (uri.startsWith('https')) {
                const fileName = `IMG_${Date.now()}.jpg`;
                localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

                await RNFS.downloadFile({
                    fromUrl: uri,
                    toFile: localPath,
                }).promise;
            }

            // ✅ Save to gallery
            await CameraRoll.save(localPath, { type: 'photo' });
            ToastAndroid.show('Saved to Gallery!', ToastAndroid.SHORT);

        } catch (error: any) {
            console.log(error);

            ToastAndroid.show('Download Failed', ToastAndroid.SHORT);
        }
    };


    const handleDelete = () => {
        if (!selected.data) return;

        Alert.alert('Delete Image', 'Are you sure want to delete this image?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    if (selected.type === 'uploaded') {
                        setUploadedImages(prev => prev.filter(img => img.uri !== (selected.data as UploadedImage).uri));
                    } else if (setViewImages && setRemoveImages) {
                        const img = selected.data as ViewImage;
                        setRemoveImages(prev => [...prev, { id: img.id, imagePath: img.imagePath }]);
                        setViewImages(prev => prev.filter(v => v.id !== img.id));
                    }
                    setSelected({ type: 'uploaded', data: null });
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal contentContainerStyle={styles.previewContainer} showsHorizontalScrollIndicator={false}>

                {/* NEW (Uploaded) Images */}
                {uploadedImages.map((item, i) => (
                    <TouchableOpacity key={i} onPress={() => setSelected({ type: 'uploaded', data: item })}>
                        <View>
                            <Image source={{ uri: item.uri }} style={styles.previewImage} />
                            <View style={styles.newBadge}><Text style={styles.badgeText}>NEW</Text></View>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* OLD (Server) Images */}
                {viewImages && viewImages.map((item, i) => (
                    <TouchableOpacity key={i} onPress={() => setSelected({ type: 'view', data: item })}>
                        <View>
                            <Image source={{ uri: item.staticBaseUrl + item.imagePath }} style={styles.previewImage} />
                        </View>
                    </TouchableOpacity>
                ))}

            </ScrollView>

            {/* Fullscreen Image View */}
            <Modal visible={!!selected.data} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <Image source={{ uri: getImageUri() }} style={styles.fullImage} />

                    <View style={styles.modalControls}>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setSelected({ ...selected, data: null })}>
                            <Ionicons name="close" size={28} color="#fff" />
                            <Text style={styles.modalText}>Close</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalButton, !hasPermission && { opacity: 0.4 }]} onPress={handleShare}>
                            <Ionicons name="share-social-outline" size={28} color="#fff" />
                            <Text style={styles.modalText}>Share</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalButton, !hasPermission && { opacity: 0.4 }]} onPress={downloadImage}>
                            <Ionicons name="download-outline" size={28} color="#fff" />
                            <Text style={styles.modalText}>Download</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalButton, !hasPermission && { opacity: 0.4 }]} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={28} color="red" />
                            <Text style={[styles.modalText, { color: 'red' }]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { paddingVertical: 10 },
    previewContainer: { paddingHorizontal: 10 },
    previewImage: { width: 100, height: 100, borderRadius: 8, marginRight: 8 },
    newBadge: { position: 'absolute', bottom: 5, left: 5, backgroundColor: 'green', paddingHorizontal: 6, borderRadius: 5 },
    badgeText: { color: '#fff', fontSize: 10 },
    modalContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    fullImage: { width: '100%', height: '70%', resizeMode: 'contain' },
    modalControls: { width: '100%', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 },
    modalButton: { alignItems: 'center' },
    modalText: { color: '#fff', marginTop: 6, fontSize: 12 },
});
