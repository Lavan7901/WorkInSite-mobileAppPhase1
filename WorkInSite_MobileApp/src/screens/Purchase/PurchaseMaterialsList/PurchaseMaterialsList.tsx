import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../../../utils/VectorIcons';
import { Colors } from '../../../utils';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import PurchaseMaterialsEditScreen from '../PurchaseMaterialsEditScreen/PurchaseMaterialsEditScreen';
import { useLanguage } from '../../../context/LanguageContext';
import { usePurchaseMaterialList } from './usePurchaseMaterialList';
import { createStyles } from '../../../styles/PurchaseItemsListStyle';
import { useTheme } from '../../../context/ThemeContext';
import { PurchaseMaterialCreationListProps, PurchaseMaterialUpdationListProps } from '../DTOs/PurchaseMaterialProps';
import { usePermission } from '../../../hook/usePermission';
import IconButton from '../../../components/CommonComponets/IconButton/IconButton';

interface Props {
  newPurchaseMaterials: PurchaseMaterialCreationListProps[];
  setNewPurchaseMaterials: React.Dispatch<React.SetStateAction<PurchaseMaterialCreationListProps[]>>;
  updatedPurchaseMaterials?: PurchaseMaterialUpdationListProps[];
  setUpdatedPurchaseMaterials?: React.Dispatch<React.SetStateAction<PurchaseMaterialUpdationListProps[]>>;
  removedPurchaseMaterialIds?: number[];
  setRemovedPurchaseMaterialIds?: React.Dispatch<React.SetStateAction<number[]>>;
}

const PurchaseMaterialsList: React.FC<Props> = ({
  newPurchaseMaterials,
  setNewPurchaseMaterials,
  updatedPurchaseMaterials,
  setUpdatedPurchaseMaterials,
  removedPurchaseMaterialIds,
  setRemovedPurchaseMaterialIds,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit("Purchase")
  const Style = createStyles(theme);

  const { bottomSheetRef, selectedItem, handleEdit, handleDelete } = usePurchaseMaterialList({
    newPurchaseMaterials,
    setNewPurchaseMaterials,
    updatedPurchaseMaterials,
    setUpdatedPurchaseMaterials,
    removedPurchaseMaterialIds,
    setRemovedPurchaseMaterialIds,
  });

  const combinedList = [
    ...(newPurchaseMaterials || []).map(item => ({ value: item, source: 'new' as const })),
    ...(updatedPurchaseMaterials || []).map(item => ({ value: item, source: 'update' as const })),
  ];

  if (combinedList.length === 0) {
    return (
      <View style={Style.emptyContainer}>
        <Text style={Style.emptyText}>{t('No materials added yet.')}</Text>
      </View>
    );
  }

  return (
    <View style={Style.container}>
      {combinedList.map((itemWrapper, index) => {
        const item = itemWrapper.value;


        return (
          <TouchableOpacity
            key={"purchaseMaterialId" in item && item.purchaseMaterialId ? item.purchaseMaterialId : index}
            style={Style.itemContainer}
            activeOpacity={0.8}
            onPress={() => handleEdit(item)}
          >
            <View style={Style.materialInfo}>
              <Text style={Style.materialName}>{item.material?.name}</Text>
              <Text style={Style.materialDetails}>
                {t('Quantity')}: <Text style={Style.materialTotal}>{item.quantity} {item.material?.unit?.name}</Text> |{' '}
                {t('Rate')}: <Text style={Style.materialTotal}>₹{item.rate} {item.material?.unit?.name}</Text>
              </Text>
              <Text style={Style.materialTotal}>
                {t('Total')}: <Text style={Style.materialTotal}>₹{Number(item.quantity) * Number(item.rate)}</Text>
              </Text>
            </View>
             <IconButton
              iconType="MaterialCommunityIcons"
              name="delete"
              size={26}
              color={Colors.dangerColor}
              onPress={() => handleDelete(item)} 
              disabled={!editable}
            />
          </TouchableOpacity>
        );
      })}

      <CustomBottomSheet
        ref={bottomSheetRef}
        height={700}
        title={t('Edit Purchase Material')}
        onClose={() => bottomSheetRef.current?.close()}
        scrollview={true}
      >
        {selectedItem && (
          <PurchaseMaterialsEditScreen
            selectedItem={selectedItem}
            newPurchaseMaterials={newPurchaseMaterials}
            setNewPurchaseMaterials={setNewPurchaseMaterials}
            updatedPurchaseMaterials={updatedPurchaseMaterials}
            setUpdatedPurchaseMaterials={setUpdatedPurchaseMaterials}
            removedPurchaseMaterialIds={removedPurchaseMaterialIds}
            setRemovedPurchaseMaterialIds={setRemovedPurchaseMaterialIds}
            closeModal={() => bottomSheetRef.current?.close()}
          />
        )}
      </CustomBottomSheet>
    </View>
  );
};

export default PurchaseMaterialsList;
