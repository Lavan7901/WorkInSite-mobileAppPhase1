import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Platform,
  Keyboard,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {
  formatDateToString,
  formatStringToDate,
} from '../../../utils/functions';
import componentStyle from '../../../styles/componentStyle';
import { Colors } from '../../../utils';

type DatePickerProps = {
  date: string;
  onDateChange: (formattedDate: string) => void;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  defaultDate?: boolean;
  disable?: boolean;
  minDate?: Date;
};

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  onDateChange,
  errorMessage,
  label,
  required = false,
  defaultDate = false,
  disable = false,
  minDate = new Date(2020, 0, 1), // ✅ default minimum date (2020)
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const parsedDate = formatStringToDate(date) || new Date();

  useEffect(() => {
    if (!date && defaultDate) {
      const today = new Date();
      const formatted = formatDateToString(today);
      onDateChange(formatted);
    }
  }, []);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) {
        const formatted = formatDateToString(selectedDate);
        setTimeout(() => {
          setShowPicker(false);
          onDateChange(formatted);
        }, 50);
      } else {
        setShowPicker(false);
      }
    } else {
      if (selectedDate) {
        const formatted = formatDateToString(selectedDate);
        onDateChange(formatted);
      }
    }
  };

  const handleShow = () => {
    if (disable) return;
    setShowPicker(true);
    Keyboard.dismiss();
  };

  return (
    <View>
      {label && (
        <Text style={componentStyle.label}>
          {label}
          {required && <Text style={componentStyle.requiredAsterisk}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        onPress={handleShow}
        activeOpacity={disable ? 1 : 0.7}
        style={[
          componentStyle.inputBox,
          componentStyle.inputContainer,
          disable && { opacity: 0.6, backgroundColor: Colors.disabledBg, borderColor: Colors.disabledBg },
        ]}
        disabled={disable}
      >
        <Text
          style={[
            componentStyle.inputText,
            disable && { color: '#999' },
          ]}
        >
          {date || 'DD/MM/YYYY'}
        </Text>
      </TouchableOpacity>

      {!disable && errorMessage && (
        <Text style={componentStyle.errorMessage}>{errorMessage}</Text>
      )}

      {showPicker && !disable && (
        <DateTimePicker
          value={parsedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minDate}  // ✅ Applying prop value
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

export default DatePicker;
