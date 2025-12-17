interface ItemsType {
    label: string;
    value: string;
  }
  
  interface ComboboxProps {
    label?: string;
    items?: ItemsType[];
    placeholder?: string;
    selectedValue?: any;
    onValueChange?: (value: string) => void;
    showCreateButton?: boolean;
    onSearch?: (searchTerm: string) => void;
    onCreate?: (value: string) => void;
    required?: boolean;
    errorMessage?:any;
    isDisabled?: boolean;
  }
  
  export type { ComboboxProps, ItemsType };
  