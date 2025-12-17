import {useState} from 'react';
import {useBankAccountValidate} from '../BankAccountValidate/BankAccountValidate';

const useBankAccountEditForm = <T extends {bankAccounts: any[]}>(
  props: BankAccountEditFormProps<T>,
) => {
  const {details, setDetails, selectedItem} = props;

  const [accountName, setAccountName] = useState(selectedItem.accountName);
  const [accountNumber, setAccountNumber] = useState(
    selectedItem.accountNumber,
  );
  const [ifscCode, setIfscCode] = useState(selectedItem.ifscCode);

  const {error, validate} = useBankAccountValidate(
    accountName,
    accountNumber,
    ifscCode,
  );

  const handleUpdate = () => {
    if (validate()) {
      const updatedBankAccounts = details.bankAccounts.map((item, index) =>
        index === selectedItem.id
          ? {accountName, accountNumber, ifscCode}
          : item,
      );
      setDetails(prev => ({
        ...prev,
        bankAccounts: updatedBankAccounts,
      }));
      props.Ref?.current?.close();
    }
  };

  return {
    accountName,
    setAccountName,
    accountNumber,
    setAccountNumber,
    ifscCode,
    setIfscCode,
    error,
    handleUpdate,
  };
};

export {useBankAccountEditForm};
