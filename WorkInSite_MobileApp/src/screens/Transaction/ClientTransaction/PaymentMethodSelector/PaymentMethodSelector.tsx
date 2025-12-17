import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { Colors } from '../../../../utils';
import { PaymentMethodEnum } from '../DTOs/ClientTransaction';
import images from '../../../..';

interface PaymentMethod {
  id: string;
  label: string;
  image: ImageSourcePropType;
}

interface Props {
  label?: string;
  selectedMethod: string;
  onSelect: (id: string) => void;
  required?: boolean;
  errorMessage?: string;
  /** ✅ New prop to disable entire selector */
  disable?: boolean;
}

const PaymentMethodSelector: React.FC<Props> = ({
  label = 'Payment Method',
  selectedMethod,
  onSelect,
  required = false,
  errorMessage = 'This field is required',
  disable = false,
}) => {
  const showError = required && !selectedMethod;

  const lottieRefs = useRef<{ [key: string]: LottieView | null }>({});

  const handleSelect = (id: string) => {
    if (disable) return; // ✅ Block tap if disabled
    onSelect(id);
    Keyboard.dismiss();

    // Play animation for the selected method
    if (lottieRefs.current[id]) {
      lottieRefs.current[id]?.play();
    }
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: PaymentMethodEnum.CASH,
      label: 'Cash',
      image: images.cash_img,
    },
    {
      id: PaymentMethodEnum.CHEQUE,
      label: 'Cheque',
      image: images.bank_checks_img,
    },
    {
      id: PaymentMethodEnum.BANK_TRANSFER,
      label: 'Bank Transfer',
      image: images.bank_transfer_img,
    },
    {
      id: PaymentMethodEnum.UPI,
      label: 'UPI',
      image: images.upi_img,
    },
  ];

  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.paymentTitle}>
        {label}
        {required && <Text style={styles.asterisk}> *</Text>}
      </Text>
      <View style={styles.container}>
        {paymentMethods.map((item) => {
          const isSelected = item.id === selectedMethod;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
                disable && styles.cardDisabled, // ✅ Disabled style
              ]}
              onPress={() => handleSelect(item.id)}
              activeOpacity={disable ? 1 : 0.8}
              disabled={disable}
            >
              <Image
                source={item.image}
                style={[styles.image, disable && styles.imageDisabled]}
                resizeMode="contain"
              />
              <Text
                style={[styles.label, disable && styles.labelDisabled]}
              >
                {item.label}
              </Text>

              {isSelected && !disable && (
                <LottieView
                  ref={(ref) => (lottieRefs.current[item.id] = ref)}
                  source={require('../../../../assets/animations/Done.json')}
                  style={styles.lottie}
                  loop={false}
                  autoPlay
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      {showError && !disable && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

export default PaymentMethodSelector;

const styles = StyleSheet.create({
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  asterisk: {
    color: 'red',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  card: {
    width: '48%',
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 70,
  },
  cardSelected: {
    borderColor: '#4caf50',
    backgroundColor: '#e6f4e9',
  },
  /** ✅ Disabled style */
  cardDisabled: {
    opacity: 0.5,
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  image: {
    width: 70,
    height: 50,
    marginBottom: 6,
    borderRadius: 4,
  },
  imageDisabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: 13,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  labelDisabled: {
    color: '#888',
  },
  lottie: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 40,
    height: 40,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
