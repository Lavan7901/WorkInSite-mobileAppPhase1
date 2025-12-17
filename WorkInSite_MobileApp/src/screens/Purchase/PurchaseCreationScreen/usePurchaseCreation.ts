import {useState, useEffect, useRef} from 'react';
import Toast from 'react-native-toast-message';
import {Alert} from 'react-native';
import {useRoute, useIsFocused} from '@react-navigation/native';
import RouteName from '../../../navigation/RouteName';
import {usePurchaseInputValidate} from '../PurchaseValidation/usePurchaseInputValidate';
import {useSiteService} from '../../../services/SiteService';
import {useSupplierService} from '../../../services/SupplierService';
import {useMaterialPurchaseService} from '../../../services/PurchaseService';
import {Site} from '../../Sites/DTOs/SiteProps';
import {Supplier} from '../../Suppliers/DTOs/SupplierProps';
import {useLanguage} from '../../../context/LanguageContext';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {launchImageLibrary} from 'react-native-image-picker';
import {PurchaseMaterialCreationListProps} from '../DTOs/PurchaseMaterialProps';
import {formatDateToString} from '../../../utils/functions';

export type UploadedImage = {
  uri: string;
  name?: string;
  type?: string;
};

export const usePurchaseCreation = ({navigation}: any) => {
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  const {t} = useLanguage();
  const siteService = useSiteService();
  const supplierService = useSupplierService();
  const purchaseService = useMaterialPurchaseService();

  const [billNumber, setBillNumber] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [date, setDate] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState('');
  const [gst, setGst] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState('');
  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [purchaseMaterials, setPurchaseMaterials] = useState<
    PurchaseMaterialCreationListProps[]
  >([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const today = new Date();
  const formatted = formatDateToString(today);

  const imageSheetRef = useRef<any>();
  const handleImageSheetOpen = () => {
    imageSheetRef.current?.open();
  };
  const handleImageSheetClose = () => {
    imageSheetRef.current?.close();
  };

  useEffect(() => {
    if (route.params?.siteId && isFocused) {
      setSiteId(route.params.siteId);
    }
    if (route.params?.supplierId && isFocused) {
      setSupplierId(route.params.supplierId);
    }
  }, [route.params?.siteId, route.params?.supplierId, isFocused]);

  const {error, validate, setError, initialError} = usePurchaseInputValidate({
    billNumber,
    supplierId,
    siteId,
    date: date,
    totalAmount,
    gst,
  });

  const fetchSites = async (searchString: string = '') => {
    if (searchString) {
      const sites = await siteService.getSites({
        searchString,
        status: 'Working',
      });
      if (sites) setSiteList(sites.slice(0, 3));
    }
  };

  const siteDetails = siteList.map(site => ({
    label: site.name,
    value: site.id.toString(),
  }));

  const fetchSuppliers = async (searchString: string = '') => {
    if (searchString) {
      const suppliers = await supplierService.getSuppliers(searchString);
      if (suppliers) setSupplierList(suppliers.slice(0, 3));
    }
  };

  const supplierDetails = supplierList.map(supplier => ({
    label: supplier.name,
    value: supplier.id.toString(),
  }));

  const resetFormFields = () => {
    setBillNumber('');
    setSupplierId('');
    setSiteId('');
    setDate(formatted);
    setTotalAmount('');
    setGst('');
    setAdditionalCharges('');
    setDiscount('');
    setNotes('');
    setError(initialError);
    setPurchaseMaterials([]);
    setUploadedImages([]);
    setShowCamera(false);
  };

  const hasUnsavedChanges = () => {
    return (
      billNumber !== '' ||
      supplierId !== '' ||
      siteId !== '' ||
      date !== formatted ||
      totalAmount !== '' ||
      gst !== '' ||
      additionalCharges !== '' ||
      discount !== '' ||
      notes !== '' ||
      uploadedImages.length > 0 ||
      purchaseMaterials.length > 0
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
              resetFormFields();
              navigation.navigate(RouteName.PURCHASE_LIST_SCREEN);
            },
          },
        ],
        {cancelable: true},
      );
    } else {
      resetFormFields();
      navigation.navigate(RouteName.PURCHASE_LIST_SCREEN);
    }
    return true;
  };

  const addPurchaseMaterial = (item: PurchaseMaterialCreationListProps) => {
    const updatedItems = [...purchaseMaterials, item];
    setPurchaseMaterials(updatedItems);
    updateTotals(updatedItems);
  };

  const removePurchaseMaterial = (index: number) => {
    const updatedItems = purchaseMaterials.filter(
      item => item.material.id !== index,
    );
    setPurchaseMaterials(updatedItems);
    updateTotals(updatedItems);
  };

  const updateTotals = (materials: any[]) => {
    if (materials.length === 0) {
      setTotalAmount('');
      setAdditionalCharges('');
      setDiscount('');
      return;
    }

    const baseTotal = materials.reduce(
      (sum, item) =>
        sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0),
      0,
    );

    const totalAdditionalCharges = materials.reduce(
      (sum, item) => sum + (parseFloat(item.additionalCharges) || 0),
      0,
    );

    const totalDiscounts = materials.reduce(
      (sum, item) => sum + (parseFloat(item.discount) || 0),
      0,
    );

    const finalTotal = baseTotal + totalAdditionalCharges - totalDiscounts;

    setTotalAmount(finalTotal.toFixed(2));
    setAdditionalCharges(totalAdditionalCharges.toFixed(2));
    setDiscount(totalDiscounts.toFixed(2));
  };

  useEffect(() => {
    updateTotals(purchaseMaterials);
  }, [purchaseMaterials]);

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
    try {
      if (!validate()) return;
      const parsedSupplierId = parseInt(supplierId);
      const parsedSiteId = parseInt(siteId);

      const form = new FormData();
      form.append('BillNumber', billNumber.trim());
      form.append('SiteId', parsedSiteId.toString());
      form.append('SupplierId', parsedSupplierId.toString());
      form.append('Date', date.trim());
      purchaseMaterials.forEach((item, index) => {
        form.append(
          `PurchaseMaterials[${index}].materialId`,
          String(item.material.id),
        );
        form.append(`PurchaseMaterials[${index}].quantity`, item.quantity);
        form.append(`PurchaseMaterials[${index}].rate`, item.rate);
        form.append(
          `PurchaseMaterials[${index}].additionalCharges`,
          item.additionalCharges,
        );
        form.append(`PurchaseMaterials[${index}].discount`, item.discount);
        form.append(
          `PurchaseMaterials[${index}].receivedQuality`,
          item.receivedQuality,
        );
        form.append(
          `PurchaseMaterials[${index}].receivedDate`,
          item.receivedDate,
        );
        form.append(
          `PurchaseMaterials[${index}].receivedQuantity`,
          item.receivedQuantity,
        );
        form.append(`PurchaseMaterials[${index}].note`, item.note);
        item.images?.forEach((img: any) => {
          form.append(`PurchaseMaterials[${index}].images`, {
            uri: img.uri,
            name: img.name,
            type: img.type,
          } as any);
        });
      });
      form.append('TotalAmount', parseFloat(totalAmount).toFixed(2));
      form.append('GST', gst.trim());
      form.append(
        'AdditionalCharges',
        parseFloat(additionalCharges).toFixed(2),
      );
      form.append('Discount', parseFloat(discount).toFixed(2));
      form.append('Note', notes.trim());
      if (images && images.length > 0) {
        images.forEach((img: any) => {
          form.append('Images', {
            uri: img.uri,
            name: img.name,
            type: img.type,
          } as any);
        });
      }

    await purchaseService.createMaterialPurchase(form);

      resetFormFields();
      navigation.navigate(RouteName.PURCHASE_LIST_SCREEN);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to create Purchase',
      });
    }
  };

  return {
    billNumber,
    setBillNumber,
    supplierId,
    setSupplierId,
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
    supplierDetails,
    siteDetails,
    fetchSites,
    fetchSuppliers,
    error,
    handleSubmission,
    handleBackPress,
    purchaseMaterials,
    setPurchaseMaterials,
    addPurchaseMaterial,
    removePurchaseMaterial,
    updateTotals,
    hasUnsavedChanges,
    uploadedImages,
    setUploadedImages,
    handleImageUpload,
    imageSheetRef,
    handleImageSheetOpen,
    handleImageSheetClose,
    showCamera,
    setShowCamera,
  };
};
