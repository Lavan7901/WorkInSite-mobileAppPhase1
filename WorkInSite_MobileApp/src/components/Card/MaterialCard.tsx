import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Material } from '../../screens/Materials/DTOS/MaterialProps';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../utils/VectorIcons';
import images from '../../images';
import { Colors } from '../../utils';
import { getCardStyle } from '../../styles/cardStyle';
import IconButton from '../CommonComponets/IconButton/IconButton';
import { usePermission } from '../../hook/usePermission';

interface MaterialCardProps {
  material: Material;
  onDelete: () => void;
  onPress?: () => void;
  sourceSite?: string;
  targetSite?: string;
  site?: string;
  quantity?: string;
  unit?: string;
  date?: string;
  hsnCode?: string;
  workmode?: string;
  permissionKey?: string
}

interface InfoChipProps {
  icon?: string;
  library?: string;
  text: string;
  isImage?: boolean;
  imageSource?: ImageSourcePropType;
}

const MaterialCard: React.FC<MaterialCardProps> = (props) => {
  const {
    onDelete,
    onPress,
    sourceSite,
    targetSite,
    site,
    quantity,
    unit,
    date,
    hsnCode,
    workmode,
    material,
    permissionKey
  } = props;

  const { theme } = useTheme();
  const Style = getCardStyle(theme);
  const { canEdit } = usePermission();
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;


  const InfoChip = ({
    icon,
    library,
    text,
    isImage = false,
    imageSource,
  }: InfoChipProps) => {
    return (
      <View style={[Style.cardRowContent, Style.cardFlexItems, Style.cardDetailItemCircle]}>
        <View>
          {isImage && imageSource ? (
            <Image
              source={imageSource}
              style={{ width: 14, height: 14 }}
              resizeMode="contain"
            />
          ) : (
            icon &&
            library && (
              <Icon
                icon={library}
                name={icon}
                size={14}
                color={theme.secondaryColor}
              />
            )
          )}
        </View>
        <Text
          style={[Style.cardText, Style.cardFlex]}
          numberOfLines={1}>
          {text}
        </Text>
      </View>
    );
  };

  const materialName =
    typeof material === 'object' ? material.name : material || 'Material';

  const isShifting = Boolean(sourceSite && targetSite);

  // Info chips array
  const infoItems: InfoChipProps[] = [];

  if (isShifting) {
    infoItems.push({
      icon: 'cube-outline',
      library: 'MaterialCommunityIcons',
      text: materialName,
    });
  }

  if (!isShifting && site) {
    infoItems.push({
      icon: 'map-marker',
      library: 'MaterialCommunityIcons',
      text: site,
    });
  }

  if (quantity !== undefined && unit) {
    infoItems.push({
      icon: 'scale-balance',
      library: 'MaterialCommunityIcons',
      text: `${quantity} ${unit}`,
    });
  } else if (quantity !== undefined) {
    infoItems.push({
      icon: 'scale-balance',
      library: 'MaterialCommunityIcons',
      text: quantity.toString(),
    });
  } else if (unit) {
    infoItems.push({
      icon: 'ruler',
      library: 'MaterialCommunityIcons',
      text: unit,
    });
  }

  if (date) {
    infoItems.push({
      icon: 'calendar-today',
      library: 'MaterialCommunityIcons',
      text: date,
    });
  }

  if (hsnCode) {
    infoItems.push({
      text: hsnCode,
      isImage: true,
      imageSource: images.hsn_img,
    });
  }

  if (workmode) {
    infoItems.push({
      icon: 'account-hard-hat',
      library: 'MaterialCommunityIcons',
      text: workmode,
    });
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[Style.cardContainer, Style.cardColumn]}>
      {/* Header */}
      <View style={Style.cardSpaceBetweenContent}>

        <View style={Style.cardFlex}>
          {isShifting ? (
            <Text style={Style.cardTitle} numberOfLines={1}>
              {sourceSite} → {targetSite}
            </Text>
          ) : (
            <Text style={Style.cardTitle} numberOfLines={1}>
              {materialName}
            </Text>
          )}
        </View>

        {/* <View style={Style.cardActionButton}> */}
        <IconButton
          iconType="MaterialIcons"
          name="delete"
          onPress={onDelete}
          size={20}
          color={Colors.dangerColor}
          disabled={!hasPermission}
        />
        {/* </View>D */}

      </View>

      {/* Info Chips */}
      {infoItems.length > 0 && (
        <View style={[Style.cardRowContent, Style.cardDetailWrapSpacer]}>
          {infoItems.map((item, index) => (
            <InfoChip
              key={index}
              icon={item.icon}
              library={item.library}
              text={item.text}
              isImage={item.isImage}
              imageSource={item.imageSource}
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default MaterialCard;
