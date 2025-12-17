import {useState, useRef} from 'react';
import {Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {Material} from '../../Materials/DTOs/MaterialProps';
import {useMaterialService} from '../../../services/MaterialService';
import {ReceivedQualityTypes} from '../DTOs/PurchaseProps';
import {usePurchaseMaterialInputValidate} from '../PurchaseValidation/UsePurchaseMaterialsInputValidation';
import {
  PurchaseMaterialCreationListProps,
  PurchaseMaterialUpdationListProps,
} from '../DTOs/PurchaseMaterialProps';
import {formatDateToString} from '../../../utils/functions';

export type UploadedImage = {
  uri: string;
  name?: string;
  type?: string;
};

interface UsePurchaseMaterialsCreationProps {
  purchaseMaterials: PurchaseMaterialCreationListProps[];
  setPurchaseMaterials: (value: PurchaseMaterialCreationListProps[]) => void;
  Ref?: any;
  addPurchaseMaterial: (item: PurchaseMaterialCreationListProps) => void;
  updatedPurchaseMaterials?: PurchaseMaterialUpdationListProps[];
}

export const usePurchaseMaterialsCreation = ({
  purchaseMaterials,
  setPurchaseMaterials,
  updatedPurchaseMaterials = [],
  Ref,
}: UsePurchaseMaterialsCreationProps) => {
  const [materialId, setMaterialId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState('');
  const [discount, setDiscount] = useState('');
  const [receivedQuality, setReceivedQuality] = useState<
    ReceivedQualityTypes | ''
  >('');
  const [receivedDate, setReceivedDate] = useState('');
  const [receivedQuantity, setReceivedQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [materialList, setMaterialList] = useState<Material[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const today = new Date();
  const formatted = formatDateToString(today);

  const imageSheetRef = useRef<any>();

  const handleImageSheetClose = () => {
    imageSheetRef.current?.close();
  };

  const materialService = useMaterialService();

  const {error, validate, setError, initialError} =
    usePurchaseMaterialInputValidate({
      materialId,
      quantity,
      rate,
      receivedQuality,
      receivedDate,
      receivedQuantity,
    });

  const materialDetails = materialList.map(item => ({
    label: `${item.name} [${item.unit?.name}]`,
    value: item.id.toString(),
  }));

  const fetchMaterials = async (search: string = '') => {
    if (!search) return;
    const materials = await materialService.getMaterials(search);
    if (materials) setMaterialList(materials.slice(0, 3));
  };

  const ReceivedQualityItems = [
    {label: ReceivedQualityTypes.GOOD, value: ReceivedQualityTypes.GOOD},
    {label: ReceivedQualityTypes.DAMAGED, value: ReceivedQualityTypes.DAMAGED},
  ];

  const resetFields = () => {
    setMaterialId('');
    setQuantity('');
    setRate('');
    setAdditionalCharges('');
    setDiscount('');
    setReceivedQuality('');
    setReceivedDate(formatted);
    setReceivedQuantity('');
    setNotes('');
    setUploadedImages([]);
    setError(initialError);
  };

  const prepareImagesForPayload = (images: UploadedImage[]) => {
    return images.map(image => ({
      name: image.name || 'image.webp',
      type: image.type || 'image/webp',
      uri: image.uri,
    }));
  };

  const handleImageUpload = () => {
    handleImageSheetClose();
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0,
      },
      async response => {
        if (response.didCancel) {
          Alert.alert('Cancelled', 'No image selected.');
        } else if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
        } else if (response.assets) {
          try {
            const resizedImages = await Promise.all(
              response.assets.map(async asset => {
                if (!asset.uri) return null;

                const originalUri = asset.uri;
                const compressed = await ImageResizer.createResizedImage(
                  originalUri,
                  1080,
                  1920,
                  'WEBP',
                  100,
                  0,
                );

                return {
                  uri: compressed.uri,
                  name: asset.fileName ?? 'image.webp',
                  type: asset.type ?? 'image/webp',
                };
              }),
            );

            // Filter out any null results in case asset.uri was missing
            const validImages = resizedImages.filter(img => img !== null);

            setUploadedImages(prev => [...prev, ...validImages]);
          } catch (error) {
            Alert.alert(
              'Resize Error',
              'An error occurred while resizing images.',
            );
            console.error(error);
          }
        }
      },
    );
  };

  const handleAddPurchaseItem = () => {
    if (!validate()) return;

    const isDuplicate = purchaseMaterials.some(
      item => String(item?.material.id) === String(materialId),
    );
    const isDuplicateUpdated = updatedPurchaseMaterials.some(
      item => String(item?.material.id) === String(materialId),
    );
    if (isDuplicate || isDuplicateUpdated) {
      setError(prev => ({
        ...prev,
        materialId: 'This material is already added in this purchase',
      }));
      return;
    }

    const selectedMaterial = materialList.find(
      m => m.id === parseInt(materialId),
    );

    const images = prepareImagesForPayload(uploadedImages);

    const newItem: PurchaseMaterialCreationListProps = {
      material: selectedMaterial!,
      quantity: quantity.trim(),
      rate: rate.trim(),
      additionalCharges: additionalCharges.trim(),
      discount: discount.trim(),
      receivedQuality: receivedQuality as ReceivedQualityTypes,
      receivedDate: receivedDate.trim(),
      receivedQuantity: receivedQuantity.trim(),
      note: notes.trim(),
      images: images,
    };
    setPurchaseMaterials([...purchaseMaterials, newItem]);
    resetFields();
    Ref?.current?.close();
  };

  return {
    materialId,
    setMaterialId,
    quantity,
    setQuantity,
    rate,
    setRate,
    additionalCharges,
    setAdditionalCharges,
    discount,
    setDiscount,
    receivedQuality,
    setReceivedQuality,
    receivedDate,
    setReceivedDate,
    receivedQuantity,
    setReceivedQuantity,
    notes,
    setNotes,
    materialList,
    materialDetails,
    fetchMaterials,
    ReceivedQualityItems,
    uploadedImages,
    setUploadedImages,
    handleImageUpload,
    imageSheetRef,
    handleImageSheetOpen: () => imageSheetRef.current?.open(),
    handleImageSheetClose: () => imageSheetRef.current?.close(),
    showCamera,
    setShowCamera,
    handleAddPurchaseItem,
    error,
  };
};
