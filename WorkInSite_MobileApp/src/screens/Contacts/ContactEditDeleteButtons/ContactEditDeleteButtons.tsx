import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { ContactEditDeleteButtonsProps } from './DTOs';
import { useContactEditDeleteButtons } from './useContactEditDeleteButtons';
import { ContactEditForm } from '../ContactEditForm/ContactEditForm';
import { Colors } from '../../../utils';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { usePermission } from '../../../hook/usePermission';
import IconButton from '../../../components/CommonComponets/IconButton/IconButton'; // ✅ new component

const ContactEditDeleteButtons = (props: ContactEditDeleteButtonsProps) => {
  const { contactList, setContactList, selectedItem } = props;
  const { confirmDelete } = useContactEditDeleteButtons(props);
  const bottomSheetRef = useRef<any>(null);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { canEdit } = usePermission();

  const handleEdit = () => {
    bottomSheetRef.current?.open();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconButton
          iconType="MaterialIcons"
          name="edit"
          color={theme.secondaryColor}
          onPress={handleEdit}
          disabled={!canEdit('Contacts')}
        />
        <IconButton
          iconType="MaterialCommunityIcons"
          name="delete"
          color={Colors.dangerColor}
          onPress={() => confirmDelete(selectedItem.id)}
          disabled={!canEdit("Contacts")}
        />
      </View>

      <CustomBottomSheet
        ref={bottomSheetRef}
        title={t('Additional Details')}
        onClose={() => bottomSheetRef.current.close()}
      >
        <ContactEditForm
          contactList={contactList}
          setContactList={setContactList}
          selectedItem={{
            id: selectedItem.id,
            type: selectedItem.item.contactType,
            value: selectedItem.item.value,
          }}
          Ref={bottomSheetRef}
        />
      </CustomBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export { ContactEditDeleteButtons };
