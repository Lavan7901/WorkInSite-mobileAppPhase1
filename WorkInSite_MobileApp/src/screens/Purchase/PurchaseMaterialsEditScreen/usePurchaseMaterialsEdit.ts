import {useEffect, useState, useRef} from 'react';
import {Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {Material} from '../../Materials/DTOS/MaterialProps';
import {ReceivedQualityTypes} from '../DTOs/PurchaseProps';
import {usePurchaseMaterialInputValidate} from '../PurchaseValidation/UsePurchaseMaterialsInputValidation';
import {useMaterialService} from '../../../services/MaterialService';
import {
  PurchaseMaterialCreationListProps,
  PurchaseMaterialUpdationListProps,
} from '../DTOs/PurchaseMaterialProps';

export type UploadedImage = {
  id?: number;
  uri: string;
  name?: string;
  type?: string;
};
type ShowImage = {
  id: number;
  imagePath: string;
  staticBaseUrl: string;
};
type RemovedImages = {
  id: number;
  imagePath: string;
};

interface PurchaseMaterialsEditFormProps {
  newPurchaseMaterials: PurchaseMaterialCreationListProps[];
  setNewPurchaseMaterials: React.Dispatch<
    React.SetStateAction<PurchaseMaterialCreationListProps[]>
  >;
  updatedPurchaseMaterials?: PurchaseMaterialUpdationListProps[];
  setUpdatedPurchaseMaterials?: React.Dispatch<
    React.SetStateAction<PurchaseMaterialUpdationListProps[]>
  >;
  selectedItem: {
    index: number;
    value:
      | PurchaseMaterialCreationListProps
      | PurchaseMaterialUpdationListProps;
  };
  removedPurchaseMaterialIds?: number[];
  setRemovedPurchaseMaterialIds?: React.Dispatch<
    React.SetStateAction<number[]>
  >;
  closeModal: () => void;
}

export const usePurchaseMaterialsEdit = ({
  newPurchaseMaterials,
  setNewPurchaseMaterials,
  updatedPurchaseMaterials = [],
  setUpdatedPurchaseMaterials = () => {},
  selectedItem,
  closeModal,
}: PurchaseMaterialsEditFormProps) => {
  const v = selectedItem.value;

  const [materialId, setMaterialId] = useState(v.material?.id.toString());
  const [quantity, setQuantity] = useState(v.quantity);
  const [rate, setRate] = useState(v.rate);
  const [additionalCharges, setAdditionalCharges] = useState(
    v.additionalCharges,
  );
  const [discount, setDiscount] = useState(v.discount);
  const [receivedDate, setReceivedDate] = useState(v.receivedDate);
  const [receivedQuantity, setReceivedQuantity] = useState(v.receivedQuantity);
  const [receivedQuality, setReceivedQuality] = useState(v.receivedQuality);
  const [notes, setNotes] = useState(v.note);
  const [materialList, setMaterialList] = useState<Material[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [showImage, setShowImage] = useState<ShowImage[]>([]);
  const [removedImages, setRemovedImages] = useState<RemovedImages[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const imageSheetRef = useRef<any>();
  const materialService = useMaterialService();

  const {error, validate, setError, initialError} =
    usePurchaseMaterialInputValidate({
      materialId,
      quantity,
      rate,
      receivedDate,
      receivedQuantity,
      receivedQuality,
    });

  const fetchMaterials = async (search: string = '') => {
    if (!search) return;
    const materials = await materialService.getMaterials(search);
    if (materials) setMaterialList(materials.slice(0, 3));
  };

  const materialDetails = materialList.map(item => ({
    label: `${item.name} [${item.unit.name}]`,
    value: item.id.toString(),
  }));

  const ReceivedQualityItems = [
    {label: ReceivedQualityTypes.GOOD, value: ReceivedQualityTypes.GOOD},
    {label: ReceivedQualityTypes.DAMAGED, value: ReceivedQualityTypes.DAMAGED},
  ];

  useEffect(() => {
    if (!selectedItem || !v) return;

    // Set main fields
    setMaterialId(v.material?.id.toString());
    setQuantity(v.quantity);
    setRate(v.rate);
    setAdditionalCharges(v.additionalCharges);
    setDiscount(v.discount);
    setReceivedQuality(v.receivedQuality);
    setReceivedDate(v.receivedDate);
    setReceivedQuantity(v.receivedQuantity);
    if (v.note !== null && v.note !== undefined) {
      setNotes(v.note);
    } else {
      setNotes('');
    }

    // Prepare backend images (already saved images)
    const backendImages: ShowImage[] =
      'images' in v && Array.isArray(v.images)
        ? v.images.map(img => ({
            id: img.id,
            imagePath: img.imagePath,
            staticBaseUrl: img.staticBaseUrl,
          }))
        : [];

    // Prepare frontend images to display in modal (UploadedImage format)
    const backendUploadedImages: UploadedImage[] =
      'images' in v && Array.isArray(v.images)
        ? v.images.map(img => ({
            uri: img.uri || '', // ensure URI exists
            name: img.name || 'image.webp',
            type: img.type || 'image/webp',
            id: img.id,
          }))
        : [];

    // Prepare newly added images
    const newImgs: UploadedImage[] =
      'newImages' in v && Array.isArray(v.newImages)
        ? v.newImages.map(img => ({
            uri: img.uri,
            name: img.name,
            type: img.type,
          }))
        : [];

    // Set states
    setShowImage(backendImages); // For deletion tracking
    setUploadedImages([...backendUploadedImages, ...newImgs]); // Show all images in modal

    // Add material to list if missing
    if (v.material && !materialList.some(m => m.id === v.material.id)) {
      setMaterialList(prev => [v.material, ...prev]);
    }
  }, [selectedItem]);

  const handleImageSheetOpen = () => imageSheetRef.current?.open();
  const handleImageSheetClose = () => imageSheetRef.current?.close();

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

  const prepareImagesForPayload = (images: UploadedImage[]) => {
    return images.map(image => ({
      name: image.name || 'image.webp',
      type: image.type || 'image/webp',
      uri: image.uri,
    }));
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const combinedList = [
      ...newPurchaseMaterials.map((x, i) => ({
        id: `new-${i}`,
        materialId: x.material.id,
      })),
      ...updatedPurchaseMaterials.map(x => ({
        id: `upd-${x.purchaseMaterialId}`,
        materialId: x.material.id,
      })),
    ];

    const currentId =
      'purchaseMaterialId' in selectedItem.value &&
      selectedItem.value.purchaseMaterialId
        ? `upd-${selectedItem.value.purchaseMaterialId}`
        : `new-${selectedItem.index}`;

    const isDuplicate = combinedList.some(
      item => item.materialId === Number(materialId) && item.id !== currentId,
    );

    if (isDuplicate) {
      setError(prev => ({
        ...prev,
        materialId: 'This material is already added in this purchase',
      }));
      return;
    }

    const commonData = {
      quantity: quantity.trim(),
      rate: rate.trim(),
      additionalCharges: additionalCharges.trim(),
      discount: discount.trim(),
      receivedQuality,
      receivedDate: receivedDate.trim(),
      receivedQuantity: receivedQuantity.trim(),
      note: notes?.trim(),
    };
    const existingItem = selectedItem.value;
    const isExisting =
      'purchaseMaterialId' in existingItem && existingItem.purchaseMaterialId;
    const selectedMaterial = materialList.find(
      m => m.id === parseInt(materialId),
    );

    if (isExisting) {
      const newImages = uploadedImages
        .filter(img => !img.id)
        .map(img => ({
          uri: img.uri,
          name: img.name || 'image.webp',
          type: img.type || 'image/webp',
        }));
      const updatedItem: PurchaseMaterialUpdationListProps = {
        ...existingItem,
        purchaseMaterialId: existingItem.purchaseMaterialId!,
        material: selectedMaterial!,
        ...commonData,
        newImages,
        removedImages,
      };

      const updatedList = [...updatedPurchaseMaterials];
      updatedList[selectedItem.index] = updatedItem;
      setUpdatedPurchaseMaterials?.(updatedList);
    } else {
      const images = prepareImagesForPayload(uploadedImages);
      const newItem: PurchaseMaterialCreationListProps = {
        material: selectedMaterial!,
        ...commonData,
        images,
      };

      const newList = [...newPurchaseMaterials];
      newList[selectedItem.index] = newItem;
      setNewPurchaseMaterials(newList);
    }
    setError(initialError);
    closeModal();
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
    handleImageSheetOpen,
    handleImageSheetClose,
    showCamera,
    setShowCamera,
    handleSubmit,
    error,
    showImage,
    setShowImage,
    removedImages,
    setRemovedImages,
  };
};
