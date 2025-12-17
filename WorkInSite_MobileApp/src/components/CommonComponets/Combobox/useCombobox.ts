import {useEffect, useState} from 'react';
import {ComboboxProps} from './DTOs';
import {useIsFocused} from '@react-navigation/native';

const useCombobox = (props: ComboboxProps) => {
  const {items, selectedValue, onValueChange, onCreate, onSearch} = props;

  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [value, setValue] = useState(selectedValue);
  const [searchString, setSearchString] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      setOpen(false);
      setSearchString('');
      setHover(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(value);
    }
  }, [value]);

  useEffect(() => {
    if (!selectedValue) {
      setValue(''); // Reset the value when selectedValue is null or empty
    }
  }, [selectedValue]);

  const handleOnOpenChange = () => {
    setOpen(!open);
    setSearchString('');
    setHover(false);
  };

  const filteredItems = items?.filter(item =>
    item.label.toLowerCase().includes(searchString.trim().toLowerCase()),
  );

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    setOpen(false);
    setSearchString('');
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate(searchString);
    }
  };

  const handleSearch = (text: string) => {
    const trimmedText = text.trimStart(); // Trim leading spaces
    setSearchString(trimmedText); // Update state with trimmed value

    if (onSearch) {
      onSearch(trimmedText); // Trigger callback if provided
    }
  };

  return {
    open,
    handleOnOpenChange,
    value,
    searchString,
    setSearchString,
    filteredItems,
    handleValueChange,
    hover,
    setHover,
    handleCreate,
    handleSearch,
  };
};

export {useCombobox};
