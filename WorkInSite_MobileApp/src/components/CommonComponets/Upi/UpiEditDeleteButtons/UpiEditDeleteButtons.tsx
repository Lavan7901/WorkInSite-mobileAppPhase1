import React, { useRef } from 'react';
import { View } from 'react-native';
import { useUpiEditDeleteButtons } from './useUpiEditDeleteButtons';
import { UpiEditDeleteButtonsProps } from './DTOs';
import { Colors } from '../../../../utils';
import CustomBottomSheet from '../../CustomBottomSheet/CustomBottomSheet';
import { UpiEditForm } from '../UpiEditForm/UpiEditForm';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import componentStyle from '../../../../styles/componentStyle';
import { usePermission } from '../../../../hook/usePermission';
import IconButton from '../../IconButton/IconButton';
export const UpiEditDeleteButtons = <T extends { upiDetails: any[] }>({
  details,
  setDetails,
  selectedItem,
  permissionKey
}: UpiEditDeleteButtonsProps<T>) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;
  const bottomSheetRef = useRef<any>(null);
  const { confirmDelete } = useUpiEditDeleteButtons(details, setDetails);

  const handleEdit = () => {
    bottomSheetRef.current?.open();
  };

  return (
    <View style={componentStyle.inputWithIcon}>
      <IconButton
        iconType="MaterialIcons"
        name="edit"
        size={24}
        color={theme.secondaryColor}
        onPress={handleEdit}
        disabled={!hasPermission}
      />
      <IconButton
        iconType="MaterialIcons"
        name="delete"
        size={24}
        color={Colors.dangerColor}
        onPress={() => confirmDelete(selectedItem.id)}
        disabled={!hasPermission}
      />
      <CustomBottomSheet
        ref={bottomSheetRef}
        title={t("UPI Type")}
        onClose={() => bottomSheetRef.current.close()}
      >
        {/* Assuming UpiEditForm is already generic */}
        <UpiEditForm
          details={details}
          setDetails={setDetails}
          selectedItem={{
            id: selectedItem.id,
            type: selectedItem.item.upiType,
            value: selectedItem.item.value,
          }}
          Ref={bottomSheetRef}
        />
      </CustomBottomSheet>
    </View>
  );
};

