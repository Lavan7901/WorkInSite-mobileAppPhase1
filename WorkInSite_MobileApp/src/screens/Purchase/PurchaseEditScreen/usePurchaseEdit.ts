import {useState, useEffect, useCallback, useRef} from 'react';
import Toast from 'react-native-toast-message';
import {Alert} from 'react-native';
import RouteName from '../../../navigation/RouteName';
import {useSiteService} from '../../../services/SiteService';
import {useSupplierService} from '../../../services/SupplierService';
import {Site} from '../../Sites/DTOs/SiteProps';
import {Supplier} from '../../Suppliers/DTOs/SupplierProps';
import {useFocusEffect, useIsFocused, useRoute} from '@react-navigation/native';
import {useMaterialPurchaseService} from '../../../services/PurchaseService';
import {usePurchaseInputValidate} from '../PurchaseValidation/usePurchaseInputValidate';
import {useLanguage} from '../../../context/LanguageContext';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {launchImageLibrary} from 'react-native-image-picker';
import {Purchase} from '../DTOs/PurchaseProps';
import {
  PurchaseMaterialCreationListProps,
  PurchaseMaterialUpdationListProps,
} from '../DTOs/PurchaseMaterialProps';

export type UploadedImage = {
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
export const usePurchaseEdit = (id: string, {navigation}: any) => {
  const route = useRoute<any>();
  const purchaseService = useMaterialPurchaseService();
  const supplierService = useSupplierService();
  const siteService = useSiteService();
  const isFocused = useIsFocused();
  const {t} = useLanguage();

  const [billNumber, setBillNumber] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [date, setDate] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState('');
  const [gst, setGst] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState('');
  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState<string>('');
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPurchaseMaterials, setNewPurchaseMaterials] = useState<
    PurchaseMaterialCreationListProps[]
  >([]);
  const [updatedPurchaseMaterials, setUpdatedPurchaseMaterials] = useState<
    PurchaseMaterialUpdationListProps[]
  >([]);
  const [removedPurchaseMaterialIds, setRemovedPurchaseMaterialIds] = useState<
    number[]
  >([]);
  const [purchaseDetails, setPurchaseDetails] = useState<Purchase>();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showImage, setShowImage] = useState<ShowImage[]>([]);
  const [removedImages, setRemovedImages] = useState<RemovedImages[]>([]);
  const imageSheetRef = useRef<any>();

  const {error, validate, setError, initialError} = usePurchaseInputValidate({
    billNumber,
    supplierId,
    siteId,
    date,
    totalAmount,
    gst,
  });

  const handleImageSheetOpen = () => {
    imageSheetRef.current?.open();
  };
  const handleImageSheetClose = () => {
    imageSheetRef.current?.close();
  };

  const fetchPurchase = async () => {
    setLoading(true);
    try {
      const purchaseData = await purchaseService.getMaterialPurchase(
        parseInt(id),
      );
      setPurchaseDetails(purchaseData);
      setDate(purchaseData.date);
      setBillNumber(purchaseData.billNumber);
      setSupplierId(purchaseData.supplier.id.toString());
      setSupplierList([purchaseData.supplier]);
      setSiteId(purchaseData.site.id.toString());
      setSiteList([purchaseData.site]);
      setTotalAmount(purchaseData.totalAmount.toString());
      setGst(purchaseData.gst.toString());
      setAdditionalCharges(purchaseData.additionalCharges?.toString());
      setDiscount(purchaseData.discount?.toString());
      setNotes(purchaseData.note);
      setShowImage(purchaseData.images);
      const mappedUpdatedMaterials: PurchaseMaterialUpdationListProps[] =
        purchaseData.purchaseMaterials.map((pm: any) => ({
          purchaseMaterialId: pm.id,
          materialId: pm.material?.id,
          material: pm.material,
          quantity: pm.quantity,
          rate: pm.rate,
          additionalCharges: pm.additionalCharges,
          discount: pm.discount,
          receivedQuality: pm.receivedQuality,
          receivedDate: pm.receivedDate,
          receivedQuantity: pm.receivedQuantity,
          note: pm.note,
          images: pm.images,
        }));

      setUpdatedPurchaseMaterials(mappedUpdatedMaterials);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch purchase data.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchase();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchPurchase();
    }, [id]),
  );

  const fetchSites = async (searchString: string = '') => {
    if (searchString) {
      const sites = await siteService.getSites({
        searchString,
        status: 'Working',
      });
      if (sites) setSiteList(sites.slice(0, 3));
    }
  };

  const fetchSuppliers = async (searchString: string = '') => {
    if (searchString) {
      const suppliers = await supplierService.getSuppliers(searchString);
      setSupplierList(suppliers.slice(0, 3));
    }
  };

  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const supplierDetails = supplierList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const areDetailsEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (
      typeof obj1 !== 'object' ||
      obj1 === null ||
      typeof obj2 !== 'object' ||
      obj2 === null
    ) {
      return obj1 === obj2;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (let key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!areDetailsEqual(obj1[key], obj2[key])) return false;
    }
    return true;
  };

  useEffect(() => {
    if (route.params?.siteId && isFocused) {
      setSiteId(route.params.siteId);
    }
    if (route.params?.supplierId && isFocused) {
      setSupplierId(route.params.supplierId);
    }
  }, [route.params?.siteId, route.params?.supplierId, isFocused]);

  const addPurchaseMaterial = (item: PurchaseMaterialCreationListProps) => {
    const updatedItems = [...newPurchaseMaterials, item];
    setNewPurchaseMaterials(updatedItems);
    updateTotals(updatedItems);
  };

  const updateTotals = (
    newMaterials: any[] = [],
    updatedMaterials: any[] = [],
  ) => {
    const allMaterials = [...newMaterials, ...updatedMaterials];

    if (allMaterials.length === 0) {
      setTotalAmount('0.00');
      setAdditionalCharges('0.00');
      setDiscount('0.00');
      return;
    }

    const baseTotal = allMaterials.reduce(
      (sum, item) =>
        sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0),
      0,
    );

    const totalAdditionalCharges = allMaterials.reduce(
      (sum, item) => sum + (parseFloat(item.additionalCharges) || 0),
      0,
    );

    const totalDiscounts = allMaterials.reduce(
      (sum, item) => sum + (parseFloat(item.discount) || 0),
      0,
    );

    const finalTotal = baseTotal + totalAdditionalCharges - totalDiscounts;

    setTotalAmount(finalTotal.toFixed(2));
    setAdditionalCharges(totalAdditionalCharges.toFixed(2));
    setDiscount(totalDiscounts.toFixed(2));
  };

  useEffect(() => {
    updateTotals(newPurchaseMaterials, updatedPurchaseMaterials);
  }, [newPurchaseMaterials, updatedPurchaseMaterials]);

  const resetFormFields = () => {
    setUploadedImages([]);
    setShowImage([]);
    setRemovedImages([]);
    setNewPurchaseMaterials([]);
    setError(initialError);
    setShowCamera(false);
  };

  const simpleMaterials = (arr: any[] = []) =>
    arr.map(x => ({
      id: x.purchaseMaterialId ?? x.id,
      materialId: x.materialId ?? x.material?.id,
      quantity: String(x.quantity ?? ''),
      rate: String(x.rate ?? ''),
      additionalCharges: String(x.additionalCharges ?? ''),
      discount: String(x.discount ?? ''),
      receivedQuality: String(x.receivedQuality ?? ''),
      receivedDate: String(x.receivedDate ?? ''),
      receivedQuantity: String(x.receivedQuantity ?? ''),
      note: String(x.note ?? ''),
      images: (x.images ?? []).map((img: any) => ({
        id: img.id,
        uri: img.uri,
        name: img.name,
        type: img.type,
        imagePath: img.imagePath,
      })),
      newImages: (x.newImages ?? []).map((img: any) => ({
        uri: img.uri,
        name: img.name,
        type: img.type,
      })),
      removedImages:
        x.removedImages?.map((img: any) => ({
          id: img.id,
          imagePath: img.imagePath,
        })) || [],
    }));

  const hasUnsavedChanges = () => {
    const materialsChanged =
      JSON.stringify(simpleMaterials(updatedPurchaseMaterials ?? [])) !==
      JSON.stringify(simpleMaterials(purchaseDetails?.purchaseMaterials ?? []));

    const imagesChanged =
      uploadedImages.length > 0 ||
      removedImages.length > 0 ||
      JSON.stringify(showImage) !== JSON.stringify(purchaseDetails?.images);

    return (
      billNumber !== purchaseDetails?.billNumber ||
      supplierId !== purchaseDetails?.supplier.id.toString() ||
      siteId !== purchaseDetails?.site.id.toString() ||
      date !== purchaseDetails?.date.toString() ||
      totalAmount !== purchaseDetails?.totalAmount.toString() ||
      gst !== purchaseDetails?.gst.toString() ||
      additionalCharges !== purchaseDetails?.additionalCharges?.toString() ||
      discount !== purchaseDetails?.discount?.toString() ||
      notes !== purchaseDetails?.note ||
      newPurchaseMaterials.length > 0 ||
      removedPurchaseMaterialIds.length > 0 ||
      materialsChanged ||
      imagesChanged
    );
  };

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save them?'),
        [
          {text: t('Cancel'), style: 'cancel'},
          {text: t('Save'), onPress: handleSubmission},
          {
            text: t('Exit Without Save'),
            onPress: () => {
              navigation.navigate(RouteName.PURCHASE_LIST_SCREEN);
              resetFormFields();
              fetchPurchase();
              setError(initialError);
            },
          },
        ],
        {cancelable: false},
      );
      return true;
    }
    navigation.navigate(RouteName.PURCHASE_LIST_SCREEN);
    resetFormFields();
    return true;
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

  const handleSubmission = async () => {
    const images = prepareImagesForPayload(uploadedImages);
    if (validate()) {
      try {
        const parsedSupplierId = parseInt(supplierId);
        const parsedSiteId = parseInt(siteId);

        const form = new FormData();
        form.append('BillNumber', billNumber.trim());
        form.append('SiteId', parsedSiteId);
        form.append('SupplierId', parsedSupplierId);
        form.append('Date', date.trim());
        (newPurchaseMaterials || []).forEach((item, index) => {
          form.append(
            `NewPurchaseMaterials[${index}].materialId`,
            String(item.material.id),
          );
          form.append(`NewPurchaseMaterials[${index}].quantity`, item.quantity);
          form.append(`NewPurchaseMaterials[${index}].rate`, item.rate);
          form.append(
            `NewPurchaseMaterials[${index}].additionalCharges`,
            item.additionalCharges,
          );
          form.append(`NewPurchaseMaterials[${index}].discount`, item.discount);
          form.append(
            `NewPurchaseMaterials[${index}].receivedQuality`,
            item.receivedQuality,
          );
          form.append(
            `NewPurchaseMaterials[${index}].receivedDate`,
            item.receivedDate,
          );
          form.append(
            `NewPurchaseMaterials[${index}].receivedQuantity`,
            item.receivedQuantity,
          );
          form.append(`NewPurchaseMaterials[${index}].note`, item.note);
          item.images?.forEach((img: any) => {
            form.append(`NewPurchaseMaterials[${index}].images`, {
              uri: img.uri,
              name: img.name,
              type: img.type,
            } as any);
          });
        });
        if (updatedPurchaseMaterials)
          (updatedPurchaseMaterials || []).forEach((item, index) => {
            form.append(
              `UpdatedPurchaseMaterials[${index}].purchaseMaterialId`,
              String(item.purchaseMaterialId),
            );
            form.append(
              `UpdatedPurchaseMaterials[${index}].materialId`,
              String(item.material.id),
            );
            form.append(
              `UpdatedPurchaseMaterials[${index}].quantity`,
              item.quantity,
            );
            form.append(`UpdatedPurchaseMaterials[${index}].rate`, item.rate);
            form.append(
              `UpdatedPurchaseMaterials[${index}].additionalCharges`,
              item.additionalCharges,
            );
            form.append(
              `UpdatedPurchaseMaterials[${index}].discount`,
              item.discount,
            );
            form.append(
              `UpdatedPurchaseMaterials[${index}].receivedQuality`,
              item.receivedQuality,
            );
            form.append(
              `UpdatedPurchaseMaterials[${index}].receivedDate`,
              item.receivedDate,
            );
            form.append(
              `UpdatedPurchaseMaterials[${index}].receivedQuantity`,
              item.receivedQuantity,
            );
            form.append(`UpdatedPurchaseMaterials[${index}].note`, item.note);
            item.newImages?.forEach((img: any) => {
              form.append(`UpdatedPurchaseMaterials[${index}].newImages`, {
                uri: img.uri,
                name: img.name,
                type: img.type,
              } as any);
            });
            item.removedImages?.forEach((image: any, imgIndex: number) => {
              form.append(
                `UpdatedPurchaseMaterials[${index}].RemovedImages[${imgIndex}].id`,
                image.id,
              );
              form.append(
                `UpdatedPurchaseMaterials[${index}].RemovedImages[${imgIndex}].imagePath`,
                image.imagePath,
              );
            });
          });
        removedPurchaseMaterialIds.forEach((id, index) => {
          form.append(`RemovedPurchaseMaterialIds[${index}]`, id.toString());
        });

        form.append('TotalAmount', parseFloat(totalAmount).toFixed(2));
        form.append('GST', gst.trim());
        form.append(
          'AdditionalCharges',
          parseFloat(additionalCharges).toFixed(2),
        );
        form.append('Discount', parseFloat(discount).toFixed(2));
        if (notes) form.append('Note', notes.trim());
        if (images)
          (images || []).forEach((img: any) => {
            form.append('Images', {
              uri: img.uri,
              name: img.name,
              type: img.type,
            } as any);
          });
        removedImages.forEach((image: any, index) => {
          form.append(`RemovedImages[${index}].id`, image.id);
          form.append(`RemovedImages[${index}].imagePath`, image.imagePath);
        });

        await purchaseService.updateMaterialPurchase(parseInt(id), form);
        resetFormFields();
        navigation.navigate(RouteName.PURCHASE_LIST_SCREEN);
        fetchPurchase();
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error?.response?.data?.message || 'Failed to edit Purchase.',
        });
      }
    }
  };

  return {
    billNumber,
    setBillNumber,
    supplierId,
    setSupplierId,
    siteDetails,
    siteId,
    setSiteId,
    date,
    setDate,
    totalAmount,
    setTotalAmount,
    gst,
    setGst,
    additionalCharges,
    setAdditionalCharges,
    discount,
    setDiscount,
    notes,
    setNotes,
    supplierList,
    siteList,
    fetchSites,
    fetchSuppliers,
    supplierDetails,
    purchaseDetails,
    error,
    handleSubmission,
    handleBackPress,
    hasUnsavedChanges,
    loading,
    addPurchaseMaterial,
    newPurchaseMaterials,
    setNewPurchaseMaterials,
    updatedPurchaseMaterials,
    setUpdatedPurchaseMaterials,
    removedPurchaseMaterialIds,
    setRemovedPurchaseMaterialIds,
    uploadedImages,
    setUploadedImages,
    handleImageUpload,
    imageSheetRef,
    handleImageSheetOpen,
    handleImageSheetClose,
    showCamera,
    setShowCamera,
    showImage,
    setShowImage,
    removedImages,
    setRemovedImages,
  };
};
