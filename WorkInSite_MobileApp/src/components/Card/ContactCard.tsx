import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import CustomAvatar from '../../screens/ProfileScreen/CustomAvatar';
import Icon from '../../utils/VectorIcons';
import Colors from '../../utils/color';
import { useTheme } from '../../context/ThemeContext';
import { getCardStyle } from '../../styles/cardStyle';
import { usePermission } from '../../hook/usePermission';
import IconButton from '../CommonComponets/IconButton/IconButton';

interface ContactCardProps {
  name: string;
  imgURL?: string;
  phone?: string;
  email?: string;
  site?: string;
  date?: string;
  workType?: string;
  workerRole?: string;
  billNumber?: string;
  onDelete: () => void;
  onPress: () => void;
  permissionKey?: string;
}

const ContactCard = ({ name, imgURL, phone, email, site, date, workType, workerRole, billNumber, permissionKey, onDelete, onPress }: ContactCardProps) => {
  const { theme } = useTheme();
  const { canEdit } = usePermission()
  const Style = getCardStyle(theme);

  const hasPermission = permissionKey ? canEdit(permissionKey) : true;


  const handleCall = () => phone && Linking.openURL(`tel:${phone.replace(/[^\d]/g, '')}`);
  const handleEmail = () => email && Linking.openURL(`mailto:${email}`);

  const items = [
    { icon: 'phone', value: phone, onPress: handleCall },
    { icon: 'email', value: email, onPress: handleEmail },
    { icon: 'location-on', value: site },
    { icon: 'receipt', value: billNumber },
    { icon: 'event', value: date },
    { icon: 'work', value: workType },
    { icon: 'person', value: workerRole },
  ].filter(item => item.value);

  return (
    <TouchableOpacity style={[Style.cardContainer, Style.cardRow]} onPress={onPress}>
      <CustomAvatar name={name} imageUri={imgURL} size={70} backgroundColor={theme.primaryColor} textColor={theme.secondaryColor} />

      <View style={Style.cardDetailSpacer}>
        <Text style={Style.cardTitle}>{name}</Text>
        {items.map((item, i) => (
          <TouchableOpacity key={i} style={Style.cardRowContent} onPress={item.onPress} disabled={!item.onPress}>
            <Icon icon="MaterialIcons" name={item.icon} size={14} color={theme.secondaryColor} />
            <Text numberOfLines={1} ellipsizeMode="middle" style={[Style.cardText, item.onPress && Style.cardLinkText, { color: theme.secondaryColor }]}>{item.value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <IconButton
        iconType="MaterialCommunityIcons"
        name="delete"
        color={Colors.dangerColor}
        onPress={onDelete}
        disabled={!hasPermission}
      />
    </TouchableOpacity>
  );
};

export default ContactCard;