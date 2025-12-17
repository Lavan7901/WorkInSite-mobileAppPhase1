import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import PerformanceLottie from './PerformanceLottie';
import { useTheme } from '../../context/ThemeContext';
import { Site, SiteStatus } from '../Sites/DTOs/SiteProps';
import RouteName from '../../navigation/RouteName';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils';
import { getCardStyle } from '../../styles/cardStyle';
import { usePermission } from '../../hook/usePermission';

interface SiteCardProps {
  site: Site;
  onSiteGo: (id: number) => void;
  onAttendanceGo: (siteId: number) => void;
}

// Info Row
const InfoRow = memo(({ label, value, styles }: { label: string; value: string; styles: any }) => (
  <View style={[styles.cardSpaceBetweenContent]}>
    <Text style={[styles.cardText, styles.cardTextTransform, styles.cardGap]}>{label}</Text>
    <Text style={[styles.cardText, styles.cardFlexandRight]} ellipsizeMode="tail" numberOfLines={1}>
      {value}
    </Text>
  </View>
));

// Status Badge
const StatusBadge = memo(({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case SiteStatus.YET_TO_START:
        return Colors.warningColor;
      case SiteStatus.WORKING:
        return Colors.successColor;
      case SiteStatus.HOLD:
        return Colors.dangerColor;
      case SiteStatus.COMPLETED:
        return Colors.activeColor;
      default:
        return Colors.grayColor;
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: getStatusColor(),
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 12,
          alignSelf: 'flex-start',
        },
      ]}
    >
      <Text
        style={{
          color: '#FFF',
          fontSize: 11,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {status || 'Unassigned'}
      </Text>
    </View>
  );
});

// Main Card({ site, onSiteGo, onAttendanceGo }: SiteCardProps
const SiteCard = memo(({ site, onSiteGo, onAttendanceGo }: SiteCardProps) => {
  const { theme } = useTheme();
  const styles = getCardStyle(theme);
  const { canEdit } = usePermission()
  const editable = canEdit("Sites")
  const navigation = useNavigation();


  const handleOpenMaps = useCallback(() => {
    if (site.googleLocation) {
      Linking.openURL(site.googleLocation).catch(() =>
        Alert.alert('Error', 'Unable to open the map link.')
      );
    }
  }, [site.googleLocation]);



  const supervisorNames = site.supervisors?.length
    ? site.supervisors.map((s) => s.name).join(', ')
    : 'N/A';

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onSiteGo(site.id)}
      activeOpacity={0.8}
    >
      {/* Header Section */}
      <View style={[styles.cardSpaceBetweenContent, { marginBottom: 6 }]}>
        <Text
          style={[styles.cardTitle, { flex: 1, fontSize: 18 }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {site.name}
        </Text>
        <StatusBadge status={site.status} />
      </View>

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Info Section */}
      <View style={[styles.cardDetailSpacer]}>
        <InfoRow label="Client" value={site.client?.name || 'N/A'} styles={styles} />
        <InfoRow label="Supervisors" value={supervisorNames} styles={styles} />
      </View>

      {/* Actions Section */}
      <View style={[styles.cardSpaceBetweenContent, { marginTop: 12 }]}>
        {site.googleLocation && (
          <TouchableOpacity
            onPress={handleOpenMaps}
            style={[
              styles.cardDetailItemCircle,
              { backgroundColor: '#EFF6FF', flexDirection: 'row', alignItems: 'center' },
            ]}
          >
            <PerformanceLottie
              loop
              source={require('../../assets/animations/Loaction.json')}
            />
            <Text style={[styles.cardText, { color: '#2563EB', fontWeight: '600' }]}>
              Location
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.cardDetailItemCircle,
            {
              backgroundColor: theme.secondaryColor,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8,
              opacity: !editable ? 0.6 : 1
            },
          ]}
          onPress={() => onAttendanceGo(site.id)}
          activeOpacity={0.8}
          disabled={!editable}
        >
          <Text style={[styles.cardNumText, { color: '#FFF', fontWeight: '700' }]}>
            Add Attendance
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

export default SiteCard;
