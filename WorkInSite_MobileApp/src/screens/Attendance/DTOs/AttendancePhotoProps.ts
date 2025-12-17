import {GestureResponderEvent} from 'react-native';

interface UploadedImage {
  uri: string;
  type: string;
  name: string;
}
interface AttendancePhotoProps {
  setUploadedImages: (images: UploadedImage[]) => void;
  uploadedImages: UploadedImage[];
  handleImageUpload: (event: GestureResponderEvent) => void;
  deleteImage: (index: number) => void;
}

export type {AttendancePhotoProps};
