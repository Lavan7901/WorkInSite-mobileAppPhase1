import React from 'react';
import { View, Text, Linking, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../utils/VectorIcons';
import CustomAvatar from '../../screens/ProfileScreen/CustomAvatar';
import { Colors } from '../../utils';
import { getCardStyle } from '../../styles/cardStyle';

interface UserCardProps {
  name: string;
  imgURL?: any;
  role: string;
  phoneNumber: string;
  isActive: boolean;
  onPress?: () => void;
}

const UserCard = ({ name, imgURL, role, phoneNumber, isActive, onPress }: UserCardProps) => {
  const { theme } = useTheme();
  const Style = getCardStyle(theme);

  const handlePhonePress = (e: any) => {
    e.stopPropagation();
    const cleanedPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
    Linking.openURL(`tel:${cleanedPhoneNumber}`);
  };

  const statusColor = isActive ? Colors.successColor : Colors.dangerColor;

  return (
    <TouchableOpacity style={[Style.cardContainer, Style.cardRow]} onPress={onPress} activeOpacity={0.9}>
      {/* Avatar */}
      <View style={Style.cardAvatarContainer}>
        <CustomAvatar
          name={name}
          imageUri={imgURL}
          size={70}
          backgroundColor={theme.primaryColor}
          textColor={theme.secondaryColor}
        />
        <View style={[Style.cardStatusDot, { backgroundColor: statusColor }]} />
      </View>

      {/* Details */}
      <View style={Style.cardDetailSpacer}>
        <Text style={Style.cardTitle} numberOfLines={1}>{name}</Text>

        <View style={Style.cardRowContent}>
          <Icon icon="MaterialIcons" name="work" size={14} color={theme.secondaryColor} />
          <Text style={Style.cardText} numberOfLines={1}>{role}</Text>
        </View>

        <TouchableOpacity style={Style.cardRowContent} onPress={handlePhonePress}>
          <Icon icon="MaterialIcons" name="phone" size={14} color={theme.secondaryColor} />
          <Text style={[Style.cardNumText, { color: theme.secondaryColor }]} numberOfLines={1}>
            {phoneNumber}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;
