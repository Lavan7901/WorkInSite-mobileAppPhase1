// TimePicker.tsx
import React, { useState } from "react";
import { View, Button, Text, TouchableOpacity } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";

interface TimePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  is24Hour?: boolean;
}

export default function TimePicker({
  label = "Select Time",
  value,
  onChange,
  is24Hour = false,
}: TimePickerProps) {
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (event.type === "dismissed") {
      setShow(false);
      return;
    }

    setShow(false);
    if (selected) {
      onChange(selected);
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ marginBottom: 5 }}>{label}</Text>

      {/* Touchable input */}
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          height: 45,
          justifyContent: "center",
          paddingHorizontal: 12,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: "#ccc",
        }}
      >
        <Text style={{ fontSize: 16 }}>
          {format(value, is24Hour ? "HH:mm" : "hh:mm a")}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value}
          mode="time"
          is24Hour={is24Hour}
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
}
