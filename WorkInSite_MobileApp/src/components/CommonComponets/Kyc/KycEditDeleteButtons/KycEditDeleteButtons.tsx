import React, { useRef} from 'react';
import { View } from 'react-native';
import { KycEditForm } from '../KycEditForm/KycEditForm';
import { useKycEditDeleteButtons } from './useKycEditDeleteButtons';
import { Colors } from '../../../../utils';
import CustomBottomSheet from '../../CustomBottomSheet/CustomBottomSheet';
import { KycEditDeleteButtonsProp } from './DTOs';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import componentStyle from '../../../../styles/componentStyle';
import IconButton from '../../IconButton/IconButton';
import { usePermission } from '../../../../hook/usePermission';

const KycEditDeleteButtons = ({
  details,
  setDetails,
  selectedItem,
  permissionKey,
}: KycEditDeleteButtonsProp) => {

  const { confirmDelete } = useKycEditDeleteButtons({
    details,
    setDetails,
    selectedItem,
  });
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;

  const bottomSheetRef = useRef<any>(null);

  const handleEdit = () => {
    bottomSheetRef.current?.open();
  };

  return (
    <View style={componentStyle.inputWithIcon}>
      {/* Edit Button */}
      <IconButton
        iconType="MaterialIcons"
        name="edit"
        size={24}
        color={theme.secondaryColor}
        onPress={handleEdit}
        disabled={!hasPermission}
      />
      {/* Delete Button */}
      <IconButton
        iconType="MaterialIcons"
        name="delete"
        size={24}
        color={Colors.dangerColor}
        onPress={() => confirmDelete(selectedItem.id)}
        disabled={!hasPermission}
      />
      {/* Custom Bottom Sheet for editing */}
      <CustomBottomSheet
        ref={bottomSheetRef}
        title={t("KYC Type")}
        onClose={() => bottomSheetRef.current.close()}>
        <KycEditForm
          details={details}
          setDetails={setDetails}
          selectedItem={{
            id: selectedItem.id,
            type: selectedItem.item.kycType,
            value: selectedItem.item.value,
          }}
          Ref={bottomSheetRef}
        />
      </CustomBottomSheet>
    </View>
  );
};

export { KycEditDeleteButtons };