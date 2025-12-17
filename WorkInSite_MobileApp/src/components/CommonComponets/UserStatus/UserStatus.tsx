import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import Icon from '../../../utils/VectorIcons';
import { Colors } from '../../../utils';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import componentStyle from '../../../styles/componentStyle';
import commonStyle from '../../../styles/commonStyle';

const userStatusList = [
  { labelKey: 'Active User', color: Colors.successColor },
  { labelKey: 'Inactive User', color: Colors.dangerColor },
];

const UserStatus = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleTooltip}>
        <Icon
          icon="MaterialCommunityIcons"
          name="information"
          size={30}
          color={theme.secondaryColor}
        />
      </TouchableOpacity>

      <Modal
        visible={tooltipVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleTooltip}>
        <TouchableOpacity
          style={componentStyle.overlayContainer}
          onPress={toggleTooltip}>
          <View style={componentStyle.tooltipContainer}>
            {userStatusList.map((status, index) => (
              <View
                key={index}
                style={[
                  componentStyle.typeRowIconWithText,
                  componentStyle.topSpacing,
                ]}>
                <Icon
                  icon="FontAwesome"
                  name="circle"
                  size={16}
                  color={status.color}
                />
                <Text
                  style={[
                    commonStyle.description,
                    componentStyle.typeIconLeftSpacing,
                  ]}>
                  {t(status.labelKey)}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default UserStatus;