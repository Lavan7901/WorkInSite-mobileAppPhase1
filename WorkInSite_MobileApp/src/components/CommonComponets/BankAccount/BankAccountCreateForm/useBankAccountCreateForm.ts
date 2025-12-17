import { useState } from 'react';
import { useBankAccountValidate } from '../BankAccountValidate/BankAccountValidate';

interface BaseDetailsType {
  setDetails: (updater: (prev: any) => any) => void;
  // Ref: React.RefObject<{ close: () => void }>;
  Ref?: any;
  details: { bankAccounts: any[] };
}

const useBankAccountCreateForm = <T extends BaseDetailsType>(props: T) => {
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const { error, validate } = useBankAccountValidate(
    accountName,
    accountNumber,
    ifscCode,
  );

  const handleAdd = () => {
    if (validate()) {
      props.setDetails(prev => ({
        ...prev,
        bankAccounts: [
          ...(prev.bankAccounts || []),
          { accountName, accountNumber, ifscCode },
        ],
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
    handleAdd,
  };
};

export { useBankAccountCreateForm };
