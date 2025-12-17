import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import componentStyle from "../../../styles/componentStyle";
import Colors from "../../../utils/color";

interface RoleItem {
  label: string;
  value: string;
}

interface RoleSelectProps {
  label?: string;
  items: RoleItem[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  errorMessage?: string;
}

const RoleSelect: React.FC<RoleSelectProps> = ({
  label,
  items,
  selectedValue,
  onValueChange,
  required,
  errorMessage,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find((i) => i.value === selectedValue);

  return (
    <View style={{ marginBottom: 15 }}>
      {/* Label */}
      {label ? (
        <Text style={componentStyle.label}>
          {label}
          {required && (
            <Text style={componentStyle.requiredAsterisk}> *</Text>
          )}
        </Text>
      ) : null}

      {/* Selector */}
      <TouchableOpacity
        style={[
          componentStyle.inputBox,
          styles.selector,
          errorMessage && { borderColor: Colors.dangerColor },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            componentStyle.inputText,
            !selectedItem ? { color: Colors.grayColor } : {},
          ]}
        >
          {selectedItem ? selectedItem.label : "Select Role"}
        </Text>
      </TouchableOpacity>

      {/* Error message */}
      {errorMessage ? (
        <Text style={componentStyle.errorMessage}>{errorMessage}</Text>
      ) : null}

      {/* Modal */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={componentStyle.overlayContainer}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View
            style={styles.modalContainer}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.modalTitle}>Select Role</Text>

            <FlatList
              scrollEnabled
              nestedScrollEnabled
              data={items}
              showsVerticalScrollIndicator={true}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = selectedValue === item.value;
                return (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                      onValueChange(item.value);
                      setModalVisible(false);
                    }}
                  >
                    <View style={styles.radioContainer}>
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={styles.optionText}>{item.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancel}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    justifyContent: "center",
    height: 50,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: "85%",
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primaryColor,
    marginBottom: 12,
    textAlign: "center",
  },
  option: {
    paddingVertical: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: Colors.primaryColor,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryColor,
  },
  optionText: {
    fontSize: 15,
    color: Colors.black,
  },
  cancel: {
    color: Colors.primaryColor,
    textAlign: "right",
    marginTop: 14,
    fontWeight: "600",
    fontSize: 15,
  },
});

export default RoleSelect;
