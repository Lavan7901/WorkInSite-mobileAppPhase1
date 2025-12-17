import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { ContactEditDeleteButtons } from '../ContactEditDeleteButtons/ContactEditDeleteButtons';
import { ContactTypesProps } from './DTOs';
import Icon from '../../../utils/VectorIcons';
import { getCreateAndEditScreenStyles } from '../../../styles/CreateAndEditScreenStyle';
import { useTheme } from '../../../context/ThemeContext';
import { ContactTypes } from '../DTOs/ContactProps';

const ContactTypesComponent: React.FC<ContactTypesProps> = ({
  contactList,
  setContactList,
  showEditDeleteButtons = true,
}) => {
  const { theme } = useTheme();
  const Style = getCreateAndEditScreenStyles(theme);

  const Icons: { [key in ContactTypes | 'DEFAULT']: JSX.Element } = {
    [ContactTypes.PHONE]: <Icon icon="MaterialCommunityIcons" name="phone" size={24} color={theme.secondaryColor} />,
    [ContactTypes.EMAIL]: <Icon icon="MaterialCommunityIcons" name="email" size={24} color={theme.secondaryColor} />,
    [ContactTypes.ADDRESS]: <Icon icon="MaterialIcons" name="location-on" size={24} color={theme.secondaryColor} />,
    DEFAULT: <Icon icon="MaterialIcons" name="info" size={24} color={theme.secondaryColor} />,
  };

  const handlePress = (item: { contactType: ContactTypes; value: string }) => {
    if (item.contactType === ContactTypes.PHONE) {
      Linking.openURL(`tel:${item.value}`).catch(err =>
        console.error('Failed to open dialer', err)
      );
    } else if (item.contactType === ContactTypes.EMAIL) {
      Linking.openURL(`mailto:${item.value}`).catch(err =>
        console.error('Failed to open email app', err)
      );
    }
  };

  const renderContactItem = (item: { contactType: ContactTypes; value: string }, index: number) => {
    const icon = Icons[item.contactType] || Icons.DEFAULT;
    const isPressable = item.contactType === ContactTypes.PHONE || item.contactType === ContactTypes.EMAIL;

    const content = (
      <View style={Style.iconAndLabel}>
        <View>{icon}</View>
        <Text style={Style.labelStyle}>{item.value}</Text>
      </View>
    );

    return (
      <View key={index} style={[Style.iconContainer, Style.buttonWidht]}>
        {isPressable ? (
          <TouchableOpacity style={Style.iconAndLabel} onPress={() => handlePress(item)}>
            {content}
          </TouchableOpacity>
        ) : (
          content
        )}
        {showEditDeleteButtons && (
          <ContactEditDeleteButtons
            contactList={contactList}
            setContactList={setContactList}
            selectedItem={{ id: index, item }}
          />
        )}
      </View>
    );
  };

  return <>{contactList.contactDetails.map(renderContactItem)}</>;
};

export { ContactTypesComponent as ContactTypes };

