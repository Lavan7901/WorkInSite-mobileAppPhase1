import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Colors } from '../../utils';
import { getCardStyle } from '../../styles/cardStyle';
import { usePermission } from '../../hook/usePermission';
import IconButton from '../CommonComponets/IconButton/IconButton';

interface AttendanceCardProps {
  siteName: string;
  workTypeName: string;
  wageTypeName: string;
  date: string;
  worker: string;
  onDelete: () => void;
  onPress: () => void;
  permissionKey: string;
}

interface InfoItemProps {
  icon: string;
  library: string;
  text: string;
  accent?: boolean;
}

const AttendanceCard = ({
  siteName,
  workTypeName,
  wageTypeName,
  date,
  worker,
  onDelete,
  onPress,
  permissionKey
}: AttendanceCardProps) => {
  const { theme } = useTheme();
  const { canEdit } = usePermission()
  const Style = getCardStyle(theme);

  const hasPermission = permissionKey ? canEdit(permissionKey) : true;

  const InfoItem = ({ icon, library, text }: InfoItemProps) => (
    <View style={[Style.cardRowContent, Style.cardFlexItems, Style.cardDetailItemCircle]}>
      <IconButton
        iconType={library}
        name={icon}
        color={theme.secondaryColor}
        size={20}
      />
      <Text
        style={[Style.cardText, Style.cardFlex]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );

  return (
    <TouchableOpacity style={[Style.cardContainer, Style.cardColumn]} onPress={onPress}>
      {/* Header */}
      <View style={Style.cardSpaceBetweenContent}>
        <Text
          style={[Style.cardTitle, Style.cardFlex]}
          numberOfLines={1}>
          {siteName}
        </Text>
        <IconButton
          iconType="MaterialIcons"
          name="delete"
          color={Colors.dangerColor}
          onPress={onDelete}
          disabled={!hasPermission}
        />
      </View>

      {/* Details */}
      <View style={[Style.cardRowContent, Style.cardDetailWrapSpacer]}>
        <InfoItem icon="work" library="MaterialIcons" text={workTypeName} />
        <InfoItem icon="payments" library="MaterialIcons" text={wageTypeName} />
        <InfoItem icon="calendar-today" library="MaterialCommunityIcons" text={date} />
        <InfoItem icon="person" library="MaterialIcons" text={worker} />
      </View>
    </TouchableOpacity>
  );
};

export default AttendanceCard;
