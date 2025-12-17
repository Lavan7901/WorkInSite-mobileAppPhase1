import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    Platform,
    PermissionsAndroid,
    ScrollView,
    Linking,
    TouchableOpacity,
} from 'react-native';
import {
    Camera,
    useCameraDevice,
    CameraPermissionStatus,
} from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { useIsForeground } from './useIsForeground';
import Geolocation from 'react-native-geolocation-service';
import RNFS from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import Icon from '../../../utils/VectorIcons';
import CircleIconButton from './CircleIconButton';
import PhotoPreviewList from './PhotoPreviewList';
import DynamicModal from '../DynamicModal/DynamicModal';

export type PhotoMeta = {
    uri: string;
};

export type PhotoMetas = {
    uri: string;
    latitude?: number | null;
    longitude?: number | null;
    timestamp?: string;
};

type Props = {
    onClose: () => void;
    onCapture: (uris: PhotoMeta[]) => void;
};


const MAX_SESSION_PHOTOS = 5;

const DynamicCamera: React.FC<Props> = ({ onClose, onCapture }) => {
    const cameraRef = useRef<Camera>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const isFocussed = useIsFocused();
    const isForeground = useIsForeground();
    const isActive = isFocussed && isForeground;

    const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
    const [flash, setFlash] = useState<'on' | 'off'>('off');
    const [photoMeta, setPhotoMeta] = useState<PhotoMeta[]>([]);
    const [cameraPermissionStatus, setCameraPermissionStatus] =
        useState<CameraPermissionStatus>('not-determined');
    const [locationPermission, setLocationPermission] = useState<
        boolean | null
    >(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const device = useCameraDevice(cameraType);

    // ask permissions
    const requestCameraAndLocationPermission = useCallback(async () => {
        const permission = await Camera.requestCameraPermission();
        setCameraPermissionStatus(permission);
        if (permission === 'denied') setShowPermissionModal(true);

        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            setLocationPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
            if (granted !== 'granted') setShowPermissionModal(true);
        } else {
            const auth = await Geolocation.requestAuthorization('whenInUse');
            setLocationPermission(auth === 'granted');
        }
    }, []);

    useEffect(() => {
        if (isFocussed) requestCameraAndLocationPermission();
    }, [isFocussed]);

    useEffect(() => {
        if (cameraType === 'front' && flash === 'on') setFlash('off');
    }, [cameraType, flash]);

    // get location
    const getLocation = (): Promise<{
        latitude: number | null;
        longitude: number | null;
    }> => {
        return new Promise((resolve) => {
            Geolocation.getCurrentPosition(
                (pos) => {
                    resolve({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    });
                },
                (error) => {
                    Alert.alert('Location Error', error.message);
                    resolve({ latitude: null, longitude: null });
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
            );
        });
    };

    const isPhotoLimitReached = () => {
        if (photoMeta.length >= MAX_SESSION_PHOTOS) {
            Alert.alert(
                'Limit Reached',
                `You can only take up to ${MAX_SESSION_PHOTOS} photos in a session.`
            );
            return true;
        }
        return false;
    };

    // take photo
    const takePhoto = async () => {
        if (!cameraRef.current || isPhotoLimitReached()) return;
        try {
            const photo = await cameraRef.current.takePhoto({
                flash: flash,
            });
            const originalUri = `file://${photo.path}`;

            const compressed = await ImageResizer.createResizedImage(
                originalUri,
                1080,
                1920,
                'WEBP',
                100,
                0
            );
            await RNFS.unlink(originalUri).catch((err: any) => {
                console.warn('Failed to delete original image:', err);
            });

            setPhotoMeta((prev) => [...prev, { uri: compressed.uri }]);

            setTimeout(
                () => scrollViewRef.current?.scrollToEnd({ animated: true }),
                100
            );
        } catch (err) {
            console.error('Photo capture/compression failed:', err);
        }
    };

    // handle done
    const handleDone = async () => {
        if (isPhotoLimitReached() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const { latitude, longitude } = await getLocation();
            const timestamp = new Date().toLocaleString();
            const enriched = photoMeta.map((p) => ({
                ...p,
                latitude,
                longitude,
                timestamp,
            }));
            onCapture(photoMeta);
        } catch (err) {
            console.warn('Final location error:', err);
            onCapture(photoMeta);
        } finally {
            setIsSubmitting(false);
            onClose();
        }
    };


    const missingCamera = cameraPermissionStatus !== 'granted';
    const missingLocation = locationPermission === false;

    if (missingCamera || missingLocation) {
        const title = `${missingCamera ? 'Camera' : ''}${missingCamera && missingLocation ? ' & ' : ''
            }${missingLocation ? 'Location' : ''} Permission${missingCamera && missingLocation ? 's' : ''
            } Needed`;
        const message = `This app needs access to your ${missingCamera && missingLocation
            ? 'camera and location'
            : missingCamera
                ? 'camera'
                : 'location'
            }. Please enable it in settings.`;

        return (
            <View style={styles.center}>
                <DynamicModal
                    visible={showPermissionModal}
                    title={title}
                    message={message}
                    confirmText="Go to Settings"
                    cancelText="Cancel"
                    onClose={() => {
                        setShowPermissionModal(false);
                        onClose();
                    }}
                    onConfirm={() => {
                        setShowPermissionModal(false);
                        onClose();
                        Linking.openSettings();
                    }}
                />
            </View>
        );
    }

    if (!device) {
        return (
            <View style={styles.center}>
                <Text>No camera device found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isActive}
                photo
                photoQualityBalance="balanced"
            />

            {/* Flash toggle */}
            <CircleIconButton
                icon="Ionicons"
                name={flash === 'on' ? 'flash' : 'flash-off'}
                onPress={() => setFlash((prev) => (prev === 'on' ? 'off' : 'on'))}
                disabled={cameraType === 'front'}
                style={{
                    position: 'absolute',
                    top: 40,
                    right: 20,
                    opacity: cameraType === 'front' ? 0.4 : 1,
                }}
            />

            {/* Close */}
            <CircleIconButton
                icon="Ionicons"
                name="close"
                onPress={onClose}
                style={{ position: 'absolute', top: 40, left: 20 }}
            />

            {/* Bottom controls */}
            <View style={styles.bottomControls}>
                <CircleIconButton
                    icon="MaterialIcons"
                    name="flip-camera-android"
                    onPress={() =>
                        setCameraType((c) => (c === 'back' ? 'front' : 'back'))
                    }
                />

                <TouchableOpacity
                    style={[
                        styles.captureButton,
                        photoMeta.length >= MAX_SESSION_PHOTOS && { opacity: 0.4 },
                    ]}
                    onPress={takePhoto}
                    disabled={photoMeta.length >= MAX_SESSION_PHOTOS}
                >
                    <Icon icon="Ionicons" name="camera" size={34} color="#000" />
                </TouchableOpacity>

                {photoMeta.length > 0 ? (
                    <CircleIconButton
                        icon="Ionicons"
                        name="checkmark-outline"
                        onPress={handleDone}
                        style={{ opacity: isSubmitting ? 0.5 : 1 }}
                        disabled={isSubmitting}
                    />
                ) : (
                    <View style={[styles.disabledCircle]}>
                        <Icon
                            icon="Ionicons"
                            name="checkmark-outline"
                            size={26}
                            color="#aaa"
                        />
                    </View>
                )}
            </View>

            {/* Preview list */}
            {photoMeta.length > 0 && (
                <PhotoPreviewList
                    photoMeta={photoMeta}
                    onDelete={(index) =>
                        setPhotoMeta((p) => p.filter((_, i) => i !== index))
                    }
                    scrollViewRef={scrollViewRef}
                />
            )}
        </View>
    );
};

export default DynamicCamera;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    bottomControls: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    captureButton: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 50,
        elevation: 8,
    },
    disabledCircle: {
        backgroundColor: '#00000088',
        padding: 12,
        borderRadius: 30,
        opacity: 0.5,
    },
});