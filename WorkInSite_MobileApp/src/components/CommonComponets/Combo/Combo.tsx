// import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   DeviceEventEmitter,
// } from 'react-native';
// import { useIsFocused } from '@react-navigation/native';
// import { Colors, SH } from '../../../utils';
// import Icon from '../../../utils/VectorIcons';
// import componentStyle from '../../../styles/componentStyle';
// import { useLanguage } from '../../../context/LanguageContext';

// export interface ItemsType {
//   label: string;
//   value: string;
//   allItems?: any;
// }

// export interface ComboProps {
//   label?: string;
//   items?: ItemsType[];
//   placeholder?: string;
//   selectedValue?: string | ItemsType | any;
//   onValueChange?: (value: any) => void;
//   showCreateButton?: boolean;
//   onSearch?: (searchTerm: string) => void;
//   onCreate?: (value: string) => void;
//   required?: boolean;
//   errorMessage?: string;
//   isDisabled?: boolean;
//   returnFullObject?: boolean;
//   maxSuggestions?: number;
// }

// export const Combo = (props: ComboProps) => {
//   const { t } = useLanguage();
//   const isFocused = useIsFocused();
//   const {
//     label,
//     placeholder = 'Select',
//     required = false,
//     errorMessage,
//     selectedValue,
//     isDisabled = false,
//     showCreateButton,
//     returnFullObject = false,
//     items = [],
//     onValueChange,
//     onSearch,
//     onCreate,
//     maxSuggestions = 3,
//   } = props;

//   const comboId = useRef(`combo_${Math.random().toString(36).substring(2, 9)}`).current;
//   const searchInputRef = useRef<TextInput>(null);

//   const [open, setOpen] = useState(false);
//   const [value, setValue] = useState<ItemsType | null>(null);
//   const [typedValue, setTypedValue] = useState('');
//   const [searchString, setSearchString] = useState('');

//   const filteredItems = useMemo(
//     () =>
//       items.filter(item =>
//         item.label.toLowerCase().includes(searchString.trim().toLowerCase()),
//       ),
//     [items, searchString],
//   );

//   useEffect(() => {
//     if (!selectedValue) {
//       setValue(null);
//       return;
//     }
//     if (typeof selectedValue === 'string') {
//       const foundItem = items.find(i => i.value === selectedValue);
//       if (foundItem) setValue(foundItem);
//     } else if (typeof selectedValue === 'object' && selectedValue?.value) {
//       const foundItem = items.find(i => i.value === selectedValue.value);
//       if (foundItem) setValue(foundItem);
//       else setValue(selectedValue);
//     }
//   }, [selectedValue, items]);

//   // 🔹 Open dropdown
//   useEffect(() => {
//     if (open) {
//       searchInputRef.current?.focus();
//       DeviceEventEmitter.emit('CLOSE_ALL_COMBOS', comboId);
//     } else {
//       setSearchString('');
//       setTypedValue('');
//     }
//   }, [open]);

//   // 🔹 Close when another combo opens
//   useEffect(() => {
//     const subscription = DeviceEventEmitter.addListener(
//       'CLOSE_ALL_COMBOS',
//       (senderId: string) => {
//         if (senderId !== comboId) {
//           setOpen(false);
//           setSearchString('');
//         }
//       },
//     );
//     return () => subscription.remove();
//   }, [comboId]);

//   useEffect(() => {
//     if (!isFocused) {
//       setOpen(false);
//       setSearchString('');
//       setTypedValue('');
//     }
//   }, [isFocused]);

//   const handleValueChange = useCallback(
//     (val: string) => {
//       const selectedItem = items.find(i => i.value === val);
//       if (!selectedItem) return;
//       setValue(selectedItem);
//       setTypedValue('');
//       setSearchString('');
//       setOpen(false);
//       if (returnFullObject) onValueChange?.(selectedItem.allItems ?? selectedItem);
//       else onValueChange?.(selectedItem.value);
//     },
//     [items, onValueChange, returnFullObject],
//   );

//   // 🔹 Handle creating new item
//   const handleCreate = () => {
//     if (!typedValue.trim()) return;
//     onCreate?.(typedValue.trim());
//     setTypedValue('');
//     setSearchString('');
//     setOpen(false);
//   };

//   const displayValue = value?.label || placeholder;

//   const renderItem = (item: ItemsType) => {
//     const isSelected = value?.value === item.value;
//     return (
//       <TouchableOpacity
//         key={item.value}
//         onPress={() => handleValueChange(item.value)}
//         disabled={isDisabled}
//         style={[
//           styles.item,
//           { backgroundColor: isSelected ? Colors.selecthoverbgcolor : Colors.white },
//         ]}>
//         <Icon
//           icon="MaterialCommunityIcons"
//           name="check"
//           size={20}
//           style={{
//             opacity: isSelected ? 1 : 0,
//             marginRight: 8,
//             color: Colors.primaryColor,
//           }}
//         />
//         <Text
//           style={[
//             componentStyle.inputText,
//             isDisabled && componentStyle.textDisabled,
//           ]}>
//           {item.label}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View>
//       {label && (
//         <Text style={componentStyle.label}>
//           {label}
//           {required && <Text style={componentStyle.requiredAsterisk}> *</Text>}
//         </Text>
//       )}

//       <TouchableOpacity
//         onPress={() => !isDisabled && setOpen(prev => !prev)}
//         style={[
//           componentStyle.inputBox,
//           componentStyle.inputContainer,
//           componentStyle.inputWithIcon,
//           isDisabled && componentStyle.inputDisabled,
//         ]}
//         disabled={isDisabled}>
//         <Text
//           style={[
//             componentStyle.inputText,
//             isDisabled && componentStyle.textDisabled,
//           ]}>
//           {displayValue}
//         </Text>
//         <View style={styles.iconContainer}>
//           <Icon icon="MaterialCommunityIcons" name="chevron-up" size={18} />
//           <Icon icon="MaterialCommunityIcons" name="chevron-down" size={18} />
//         </View>
//       </TouchableOpacity>

//       {open && !isDisabled && (
//         <View style={componentStyle.dropdownBox}>
//           <View style={componentStyle.typeRowIconWithText}>
//             <Icon icon="MaterialIcons" name="search" size={24} style={styles.searchIcon} />
//             <TextInput
//               ref={searchInputRef}
//               value={typedValue}
//               onChangeText={text => {
//                 setTypedValue(text);
//                 setSearchString(text);
//                 onSearch?.(text);
//               }}
//               placeholder={t('Search here')}
//               style={[styles.searchInput, isDisabled && componentStyle.inputDisabled]}
//               editable={!isDisabled}
//             />
//           </View>

//           <ScrollView style={styles.scrollView} nestedScrollEnabled>
//             {filteredItems.slice(0, maxSuggestions).map(renderItem)}
//           </ScrollView>


//           {typedValue.trim() !== '' &&
//             showCreateButton &&
//             !items.some(
//               i => i.label.trim().toLowerCase() === typedValue.trim().toLowerCase(),
//             ) && (
//               <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
//                 <Text style={styles.createText}>{typedValue.trim()}</Text>
//                 <Text style={styles.newTag}>New</Text>
//               </TouchableOpacity>
//             )}


//           {filteredItems.length === 0 && typedValue.trim() !== '' && !showCreateButton && (
//             <Text style={styles.noItemsText}>No items found.</Text>
//           )}
//         </View>
//       )}

//       {errorMessage && <Text style={componentStyle.errorMessage}>{errorMessage}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   iconContainer: { flexDirection: 'column', marginVertical: 6 },
//   searchIcon: { marginHorizontal: 8 },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 8,
//     height: SH(50),
//     fontSize: 16,
//     backgroundColor: Colors.white,
//   },
//   scrollView: { maxHeight: SH(200), backgroundColor: Colors.white },
//   item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: SH(40) },
//   noItemsText: { padding: 16, textAlign: 'center' },
//   createButton: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
//   createText: { color: Colors.secondaryColor, fontSize: 16, flex: 1, paddingHorizontal: 24 },
//   newTag: {
//     color: Colors.white,
//     backgroundColor: Colors.primaryColor,
//     paddingVertical: 4,
//     paddingHorizontal: 6,
//     borderRadius: SH(7),
//     fontWeight: 'bold',
//   },
// });














// testing

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Colors, SH } from '../../../utils';
import Icon from '../../../utils/VectorIcons';
import componentStyle from '../../../styles/componentStyle';
import { useLanguage } from '../../../context/LanguageContext';

export interface ItemsType {
  label: string;
  value: string;
  allItems?: any;
}

export interface ComboProps {
  label?: string;
  items?: ItemsType[];
  placeholder?: string;
  selectedValue?: string | ItemsType | any;
  onValueChange?: (value: any) => void;
  showCreateButton?: boolean;
  onSearch?: (searchTerm: string) => void;
  onCreate?: (value: string) => void;
  required?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
  returnFullObject?: boolean;
  maxSuggestions?: number;
}

export const Combo = (props: ComboProps) => {
  const { t } = useLanguage();
  const isFocused = useIsFocused();
  const {
    label,
    placeholder = 'Select',
    required = false,
    errorMessage,
    selectedValue,
    isDisabled = false,
    showCreateButton,
    returnFullObject = false,
    items = [],
    onValueChange,
    onSearch,
    onCreate,
    maxSuggestions = 3,
  } = props;

  const comboId = useRef(`combo_${Math.random().toString(36).substring(2, 9)}`).current;
  const searchInputRef = useRef<TextInput>(null);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ItemsType | null>(null);
  const [typedValue, setTypedValue] = useState('');
  const [searchString, setSearchString] = useState('');

  const filteredItems = useMemo(
    () =>
      items.filter(item =>
        item.label.toLowerCase().includes(searchString.trim().toLowerCase()),
      ),
    [items, searchString],
  );

  useEffect(() => {
    if (!selectedValue) {
      setValue(null);
      return;
    }
    if (typeof selectedValue === 'string') {
      const foundItem = items.find(i => i.value === selectedValue);
      if (foundItem) setValue(foundItem);
    } else if (typeof selectedValue === 'object' && selectedValue?.value) {
      const foundItem = items.find(i => i.value === selectedValue.value);
      if (foundItem) setValue(foundItem);
      else setValue(selectedValue);
    }
  }, [selectedValue, items]);

  // 🔹 Open dropdown
  useEffect(() => {
    if (open) {
      searchInputRef.current?.focus();
      DeviceEventEmitter.emit('CLOSE_ALL_COMBOS', comboId);
    } else {
      setSearchString('');
      setTypedValue('');
    }
  }, [open]);

  // 🔹 Close when another combo opens
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'CLOSE_ALL_COMBOS',
      (senderId: string) => {
        if (senderId !== comboId) {
          setOpen(false);
          setSearchString('');
        }
      },
    );
    return () => subscription.remove();
  }, [comboId]);

  useEffect(() => {
    if (!isFocused) {
      setOpen(false);
      setSearchString('');
      setTypedValue('');
    }
  }, [isFocused]);

  const handleValueChange = useCallback(
    (val: string) => {
      const selectedItem = items.find(i => i.value === val);
      if (!selectedItem) return;
      setValue(selectedItem);
      setTypedValue('');
      setSearchString('');
      setOpen(false);
      if (returnFullObject) onValueChange?.(selectedItem.allItems ?? selectedItem);
      else onValueChange?.(selectedItem.value);
    },
    [items, onValueChange, returnFullObject],
  );

  // 🔹 Handle creating new item
  const handleCreate = () => {
    if (!typedValue.trim()) return;
    onCreate?.(typedValue.trim());
    setTypedValue('');
    setSearchString('');
    setOpen(false);
  };

  const displayValue = value?.label || placeholder;

  const renderItem = (item: ItemsType) => {
    const isSelected = value?.value === item.value;
    return (
      <TouchableOpacity
        key={item.value}
        onPress={() => handleValueChange(item.value)}
        disabled={isDisabled}
        style={[
          styles.item,
          { backgroundColor: isSelected ? Colors.selecthoverbgcolor : Colors.white },
        ]}>
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
        <Text
          style={[
            componentStyle.inputText,
            isDisabled && componentStyle.textDisabled,
          ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
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
        onPress={() => !isDisabled && setOpen(prev => !prev)}
        style={[
          componentStyle.inputBox,
          componentStyle.inputContainer,
          componentStyle.inputWithIcon,
          isDisabled && componentStyle.inputDisabled,
        ]}
        disabled={isDisabled}>
        <Text
          style={[
            componentStyle.inputText,
            isDisabled && componentStyle.textDisabled,
          ]}>
          {displayValue}
        </Text>
        <View style={styles.iconContainer}>
          <Icon icon="MaterialCommunityIcons" name="chevron-up" size={18} />
          <Icon icon="MaterialCommunityIcons" name="chevron-down" size={18} />
        </View>
      </TouchableOpacity>

      {open && !isDisabled && (
        <View style={componentStyle.dropdownBox}>
          <View style={componentStyle.typeRowIconWithText}>
            <Icon icon="MaterialIcons" name="search" size={24} style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              value={typedValue}
              onChangeText={text => {
                setTypedValue(text);
                setSearchString(text);
                onSearch?.(text);
              }}
              placeholder={t('Search here')}
              style={[styles.searchInput, isDisabled && componentStyle.inputDisabled]}
              editable={!isDisabled}
            />
          </View>

          <ScrollView style={styles.scrollView} nestedScrollEnabled>
            {filteredItems.slice(0, maxSuggestions).map(renderItem)}
          </ScrollView>


          {typedValue.trim() !== '' &&
            showCreateButton &&
            !items.some(
              i => i.label.trim().toLowerCase() === typedValue.trim().toLowerCase(),
            ) && (
              <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                <Text style={styles.createText}>{typedValue.trim()}</Text>
                <Text style={styles.newTag}>New</Text>
              </TouchableOpacity>
            )}


          {filteredItems.length === 0 && typedValue.trim() !== '' && !showCreateButton && (
            <Text style={styles.noItemsText}>No items found.</Text>
          )}
        </View>
      )}

      {errorMessage && <Text style={componentStyle.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: { flexDirection: 'column', marginVertical: 6 },
  searchIcon: { marginHorizontal: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    height: SH(50),
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  scrollView: { maxHeight: SH(200), backgroundColor: Colors.white },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: SH(40) },
  noItemsText: { padding: 16, textAlign: 'center' },
  createButton: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
  createText: { color: Colors.secondaryColor, fontSize: 16, flex: 1, paddingHorizontal: 24 },
  newTag: {
    color: Colors.white,
    backgroundColor: Colors.primaryColor,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: SH(7),
    fontWeight: 'bold',
  },
});