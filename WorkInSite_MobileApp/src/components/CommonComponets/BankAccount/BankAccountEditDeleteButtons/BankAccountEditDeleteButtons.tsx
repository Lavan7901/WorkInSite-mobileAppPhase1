import React, { useRef } from 'react';
import { View } from 'react-native';
import { useBankAccountEditDeleteButtons } from './useBankAccountEditDeleteButtons';
import { BankAccountEditForm } from '../BankAccountEditForm/BankAccountEditForm';
import CustomBottomSheet from '../../CustomBottomSheet/CustomBottomSheet';
import { Colors } from '../../../../utils';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import componentStyle from '../../../../styles/componentStyle';
import { usePermission } from '../../../../hook/usePermission';
import IconButton from '../../IconButton/IconButton';

const BankAccountEditDeleteButtons = <T,>(
  props: BankAccountEditDeleteButtonsProp<T>,
) => {
  const { theme } = useTheme()
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const { details, setDetails, selectedItem, permissionKey } = props;
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;
  const { confirmDelete } = useBankAccountEditDeleteButtons(props);

  const bottomSheetRef = useRef<any>(null);
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
        title={t("Bank Account")}
        onClose={() => bottomSheetRef.current.close()}>
        <BankAccountEditForm
          details={details}
          setDetails={setDetails}
          selectedItem={{
            id: selectedItem.id,
            ...selectedItem.item,
          }}
          Ref={bottomSheetRef}
        />
      </CustomBottomSheet>
    </View>
  );
};

export { BankAccountEditDeleteButtons };
