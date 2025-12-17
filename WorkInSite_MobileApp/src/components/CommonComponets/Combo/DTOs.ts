
export interface ItemsType {
  label: string;
  value: string;
  allItems?: any;
}

export interface ComboboxProps {
  label?: string;
  items?: ItemsType[];
  placeholder?: string;
  selectedValue?: any;
  onValueChange?: (value: any) => void;
  showCreateButton?: boolean;
  onSearch?: (searchTerm: string) => void;
  onCreate?: (value: string) => void;
  required?: boolean;
  errorMessage?: any;
  isDisabled?: boolean;
}