import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Share,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from '../../utils/VectorIcons';
import { useTheme } from '../../context/ThemeContext';
import Colors from '../../utils/color';
import { SiteStatus } from '../../screens/Sites/DTOs/SiteProps';
import { getCardStyle } from '../../styles/cardStyle';
import { Contact } from '../../screens/Contacts/DTOs/ContactProps';

interface SiteCardProps {
  name: string;
  googleLocation: string;
  contact: Contact;
  status: string;
  onPress: () => void;
}

const SiteCard: React.FC<SiteCardProps> = ({
  name,
  googleLocation,
  contact,
  status,
  onPress,
}) => {
  const { theme } = useTheme();
  const Style = getCardStyle(theme);

  const onShare = async () => {
    try {
      if (!googleLocation) {
        Toast.show({
          type: 'info',
          text1: 'No Location URL',
          text2: 'This site has no location link to share.',
        });
        return;
      }

      const result = await Share.share({ message: googleLocation });

      if (result.action === Share.sharedAction) {
        Toast.show({
          type: 'success',
          text1: 'Shared Successfully',
          text2: 'Google location shared successfully!',
        });
      } else if (result.action === Share.dismissedAction) {
        Toast.show({
          type: 'info',
          text1: 'Share Cancelled',
          text2: 'User dismissed sharing action.',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case SiteStatus.YET_TO_START:
        return Colors.warningColor;
      case SiteStatus.WORKING:
        return Colors.successColor;
      case SiteStatus.HOLD:
        return Colors.dangerColor;
      case SiteStatus.COMPLETED:
        return Colors.completeColor;
      default:
        return Colors.grayColor;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[Style.cardContainer, Style.cardColumn]}>
      {/* Header */}
      <View style={Style.cardSpaceBetweenContent}>
        <View style={[Style.cardRow, Style.cardFlex]}>
          <View style={Style.cardIconCircle}>
            <Icon
              icon="MaterialCommunityIcons"
              name="map-marker"
              size={18}
              color={theme.primaryColor}
            />
          </View>
          <Text
            style={[Style.cardTitle, { flexShrink: 1 }]}
            numberOfLines={1}>
            {name}
          </Text>
        </View>

        <View style={Style.cardRow}>
          <TouchableOpacity
            onPress={onShare}
            style={Style.cardIconCircle}
            activeOpacity={0.7}>
            <Icon
              icon="MaterialCommunityIcons"
              name="share-variant"
              size={18}
              color={theme.secondaryColor}
            />
          </TouchableOpacity>

          <Icon
            icon="MaterialIcons"
            name="fiber-manual-record"
            size={22}
            color={getStatusColor()}
          />
        </View>
      </View>

      <View style={Style.cardDivider} />

      {/* Footer / Contact Section */}
      <View style={Style.cardSpaceBetweenContent}>
        <View style={[Style.cardRow, Style.cardFlex]}>
          <View style={Style.cardIconCircle}>
            <Icon
              icon="MaterialCommunityIcons"
              name="account-hard-hat"
              size={18}
              color={theme.secondaryColor}
            />
          </View>
          <Text
            style={[Style.cardText, { flexShrink: 1 }]}
            numberOfLines={1}>
            {contact?.name || 'N/A'}
          </Text>
        </View>

        <View style={Style.cardRow}>
          {contact?.phone && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${contact.phone}`)}
              style={Style.cardIconCircle}
              activeOpacity={0.7}>
              <Icon
                icon="MaterialCommunityIcons"
                name="phone"
                size={18}
                color={theme.secondaryColor}
              />
            </TouchableOpacity>
          )}
          <Icon
            icon="MaterialIcons"
            name="chevron-right"
            size={22}
            color={theme.secondaryColor}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export { SiteCard };
