import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ComboboxProps } from './DTOs';
import { useCombobox } from './useCombobox';
import { Colors, SH } from '../../../utils';
import Icon from '../../../utils/VectorIcons';
import { useLanguage } from '../../../context/LanguageContext';
import componentStyle from '../../../styles/componentStyle';

const Combobox = (props: ComboboxProps) => {
   const { t } =  useLanguage();
  const {
    label,
    items = [],
    placeholder = 'Select',
    showCreateButton,
    required = false,
    errorMessage,
    selectedValue,
    isDisabled = false, 
  } = props;

  const searchInputRef = useRef<TextInput>(null);
  const {
    open,
    handleOnOpenChange,
    searchString,
    filteredItems = [],
    handleValueChange,
    handleCreate,
    handleSearch,
  } = useCombobox(props);

  const displayValue = useMemo(
    () => items.find(item => item.value === String(selectedValue))?.label || placeholder,
    [items, selectedValue, placeholder]
  );

  useEffect(() => {
    if (open) {
      searchInputRef.current?.focus();
    }
  }, [open]);

  const renderItem = useCallback(
    (item: { label: string; value: string }) => {
      const isSelected = item.value === String(selectedValue);
      return (
        <TouchableOpacity
          key={item.value}
          onPress={() => handleValueChange(item.value)}
          disabled={isDisabled} 
          style={[
            styles.item,
            { backgroundColor: isSelected ? Colors.selecthoverbgcolor : Colors.white },
            isDisabled && componentStyle.iconDisabled, 
          ]}
        >
          <Icon
            icon="MaterialCommunityIcons"
            name="check"
            size={20}
            style={{
              opacity: isSelected ? 1 : 0,
              marginRight: 8,
              color: Colors.primaryColor,
            }}
          />
          <Text style={[componentStyle.inputText
, isDisabled && componentStyle.textDisabled
]}>{item.label}</Text>
        </TouchableOpacity>
      );
    },
    [selectedValue, handleValueChange, isDisabled]
  );

  // Memoized filtered items
  const memoizedFilteredItems = useMemo(
    () => filteredItems.map(item => renderItem(item)),
    [filteredItems, renderItem]
  );

  return (
    <View>
      {/* Label */}
      {label && (
         <Text style={[componentStyle.label]}>
          {label}
          {required && <Text style={componentStyle.requiredAsterisk}> *</Text>}
        </Text>
      )}

      {/* Dropdown Button */}
      <TouchableOpacity
        onPress={!isDisabled ? handleOnOpenChange : undefined} // ✅ Disable opening when isDisabled
        style={[componentStyle.inputBox,componentStyle.inputContainer, componentStyle.inputWithIcon, isDisabled && componentStyle. inputDisabled]} // ✅ Apply disabled styles
        disabled={isDisabled}
      >
        <Text style={[componentStyle.inputText, isDisabled && componentStyle.textDisabled]}>
          {displayValue}
        </Text>
        <View style={styles.iconContainer}>
          <Icon icon="MaterialCommunityIcons" name="chevron-up" size={18} />
          <Icon icon="MaterialCommunityIcons" name="chevron-down" size={18} />
        </View>
      </TouchableOpacity>

      {/* Dropdown Content */}
      {open && !isDisabled && (
        <View style={componentStyle.dropdownBox}>
          {/* Search Input */}
          <View style={componentStyle.typeRowIconWithText}>
            <Icon icon="MaterialIcons" name="search" size={24} style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              value={searchString}
              onChangeText={handleSearch}
              placeholder={t("Search here")}
              style={[styles.searchInput, isDisabled && componentStyle.inputDisabled]} // ✅ Disable search input
              editable={!isDisabled} // ✅ Prevent typing if disabled
            />
          </View>

          {/* Scrollable List */}
          <ScrollView style={styles.scrollView} nestedScrollEnabled>
            {memoizedFilteredItems}
          </ScrollView>

          {/* Create New Item */}
          {showCreateButton && searchString && !filteredItems.some(item => item.label.toLowerCase() === searchString.toLowerCase()) && (
            <TouchableOpacity onPress={handleCreate} style={styles.createButton}>
              <Text style={styles.createText}>{searchString}</Text>
              <View>
                <Text style={styles.newTag}>{t("New")}</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* No Items Found */}
          {filteredItems?.length === 0 && !showCreateButton && (
            <Text style={styles.noItemsText}>{t("No items found.")}</Text>
          )}
        </View>
      )}

      {/* Error Message */}
      {errorMessage && <Text style={componentStyle.errorMessage
}>{errorMessage}</Text>}
    </View>
  );
};

// 🌟 Styles
const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'column',
    marginVertical: 6,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    height: SH(50),
    borderTopLeftRadius: SH(7),
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  
  // Scroll View
  scrollView: {
    maxHeight: SH(200),
    backgroundColor: Colors.white,
    borderRadius: SH(7),
  },

  // Items
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: SH(40),
    borderRadius: SH(7),
  },
  
  createButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  createText: {
    color: Colors.secondaryColor,
    fontSize: 16,
    flex: 1,
    paddingHorizontal: 24,
  },
  newTag: {
    color: Colors.black,
    backgroundColor: Colors.primaryColor,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: SH(7),
    fontWeight: 'bold',
  },

  // No Items
  noItemsText: {
    padding: 16,
    textAlign: 'center',
  },

 
});

export { Combobox };
