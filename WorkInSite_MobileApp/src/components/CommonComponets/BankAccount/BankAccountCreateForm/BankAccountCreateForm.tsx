import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useBankAccountCreateForm} from './useBankAccountCreateForm';
import Input from '../../Input/input';
import Button from '../../Button/Button';
import {ifscRegex, nameRegex, numberRegex} from '../../../../utils/regex';
import { useLanguage } from '../../../../context/LanguageContext';
import componentStyle from '../../../../styles/componentStyle';
import commonStyle from '../../../../styles/commonStyle';

interface BaseDetailsType {
  setDetails: (updater: (prev: any) => any) => void;
  // Ref: React.RefObject<{close: () => void}>;
  Ref?: any;
  details: {bankAccounts: any[]};
}


// export interface BankAccount {
//   accountName: string;
//   accountNumber: string;
//   ifscCode: string;
// }

// export interface BaseDetailsType {
//   setDetails: (updater: (prev: { bankAccounts: BankAccount[] }) => { bankAccounts: BankAccount[] }) => void;
//   details: {
//     bankAccounts: BankAccount[];
//   };
//   Ref?: React.RefObject<{ close: () => void }>;
// }


const BankAccountCreateForm = <T extends BaseDetailsType>(props: T) => {
  const {t} = useLanguage();
  const {
    accountName,
    setAccountName,
    accountNumber,
    setAccountNumber,
    ifscCode,
    setIfscCode,
    error,
    handleAdd,
  } = useBankAccountCreateForm(props);

  return (
     <View>
    <View style={componentStyle.typeColumnSpacerContainer}>
      <Input
        value={accountName}
        onChangeText={setAccountName}
        placeholder={t("Account name")}
        maxLength={75}
        errorMessage={error.accountName}
        regex={nameRegex}
      />
      <Input
        value={accountNumber}
        onChangeText={setAccountNumber}
        maxLength={18}
        placeholder={t("Account number")}
        errorMessage={error.accountNumber}
        regex={numberRegex}
      />
      <Input
        value={ifscCode}
        onChangeText={setIfscCode}
        maxLength={11}
        placeholder={t("IFSC Code")}
        errorMessage={error.ifscCode}
        regex={ifscRegex}
      />
      </View>
      <Button title={t("Add")} onPress={handleAdd} />
    </View>
  );
};

export {BankAccountCreateForm};
