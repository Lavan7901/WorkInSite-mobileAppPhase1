import React from 'react';
import { View, Text } from 'react-native';
import { Contact } from '../../Contacts/DTOs/ContactProps';
import { ContactTypes } from '../../Contacts/ContactTypes/ContactTypes';
import { Colors } from '../../../utils';
import Icon from '../../../utils/VectorIcons';
import commonStyle from '../../../styles/commonStyle';
import { useTheme } from '../../../context/ThemeContext';
import { getCreateAndEditScreenStyles } from '../../../styles/CreateAndEditScreenStyle';
import IconButton from '../../../components/CommonComponets/IconButton/IconButton';
import { usePermission } from '../../../hook/usePermission';

const ContactsEditForm = (props: { contact: Contact; onEdit: () => void, permissionKey?: string }) => {
  const { contact, onEdit, permissionKey } = props;
  const { theme } = useTheme();
  const { canEdit } = usePermission()
  const Style = getCreateAndEditScreenStyles(theme);
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;
  return (
    <View style={commonStyle.container}>
      <View style={Style.spaceContainer}>
        <Text style={commonStyle.label}>{contact.name}</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <IconButton
            iconType="MaterialIcons"
            name="edit"
            color={theme.secondaryColor}
            onPress={onEdit}
            disabled={!hasPermission}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
        <Icon icon='MaterialCommunityIcons' name='phone' size={24} color={theme.secondaryColor} />
        <Text style={{ fontSize: 16, color: theme.secondaryColor }}>{contact.phone} [Primary Number]</Text>
      </View>
      <ContactTypes contactList={contact} showEditDeleteButtons={false} />
    </View>
  );
};
export { ContactsEditForm };
