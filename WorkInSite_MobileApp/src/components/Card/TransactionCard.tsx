import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { PaymentMethodEnum } from '../../screens/Transaction/ClientTransaction/DTOs/ClientTransaction';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import Icon from '../../utils/VectorIcons';
import { getCardStyle } from '../../styles/cardStyle';
import { Colors } from '../../utils';
import IconButton from '../CommonComponets/IconButton/IconButton';
import { usePermission } from '../../hook/usePermission';

interface Props {
  id: number;
  name: string;
  amount: string;
  date: string;
  paymentMethod: PaymentMethodEnum;
  onDelete: (id: number) => void;
  onPress: (id: number) => void;
  permissionKey?: string;
}

const paymentMethodColors: Record<PaymentMethodEnum, string> = {
  Cash: Colors.successColor,
  Cheque: Colors.activeColor,
  Bank_Transfer: Colors.warningColor,
  UPI: Colors.primaryColor,
};

const paymentMethodIcons: Record<PaymentMethodEnum, string> = {
  Cash: 'money',
  Cheque: 'credit-card',
  Bank_Transfer: 'account-balance',
  UPI: 'payments',
};

const TransactionCard: React.FC<Props> = ({
  id,
  name,
  amount,
  date,
  paymentMethod,
  onDelete,
  onPress,
  permissionKey
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const Style = getCardStyle(theme);
  const { canEdit } = usePermission()

  const hasPermission = permissionKey ? canEdit(permissionKey) : true;

  const handleDeletePress = () => {
    Alert.alert(
      t('Delete Transaction'),
      t('Are you sure you want to delete this transaction?'),
      [
        { text: t('Cancel'), style: 'cancel' },
        { text: t('Delete'), style: 'destructive', onPress: () => onDelete(id) },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity onPress={() => onPress(id)} style={[Style.cardContainer, Style.cardColumn]}>
      {/* Top Row: Name + Delete */}
      <View style={Style.cardSpaceBetweenContent}>
        <Text style={Style.cardTitle}>{name}</Text>
        <IconButton
          iconType='MaterialIcons'
          name="delete"
          size={20}
          color={Colors.dangerColor}
          onPress={handleDeletePress}
          disabled={!hasPermission}
        />
      </View>

      {/* Date */}
      <View style={Style.cardRowContent}>
        <Icon
          icon="MaterialCommunityIcons"
          name="calendar-today"
          size={14}
          color={theme.secondaryColor}
        />
        <Text style={Style.cardText}>{date}</Text>
      </View>

      {/* Bottom Row: Amount + Payment Method */}
      <View style={Style.cardSpaceBetweenContent}>
        <Text style={Style.cardAmountText}>₹{parseFloat(amount).toLocaleString('en-IN')}</Text>
        <View
          style={[Style.cardDetailItemCircle, Style.cardRowContent]}>
          <Icon
            icon="MaterialIcons"
            name={paymentMethodIcons[paymentMethod]}
            size={14}
            color={paymentMethodColors[paymentMethod]}
          />
          <Text
            style={[
              Style.cardNumText,
              { color: paymentMethodColors[paymentMethod] },
            ]}
          >
            {paymentMethod.replace('_', ' ')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionCard;
