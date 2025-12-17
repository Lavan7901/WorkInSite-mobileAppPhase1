import {StyleSheet, View} from 'react-native';
import {useBankAccountEditForm} from './useBankAccountEditForm';
import Input from '../../Input/input';
import Button from '../../Button/Button';
import { useLanguage } from '../../../../context/LanguageContext';
import componentStyle from '../../../../styles/componentStyle';
import commonStyle from '../../../../styles/commonStyle';

const BankAccountEditForm = <T extends {bankAccounts: any[]}>(
  props: BankAccountEditFormProps<T>,
) => {
   const { t } =  useLanguage();
  const {
    accountName,
    setAccountName,
    accountNumber,
    setAccountNumber,
    ifscCode,
    setIfscCode,
    error,
    handleUpdate,
  } = useBankAccountEditForm(props);

  return (
    <View>
    <View style={componentStyle.typeColumnSpacerContainer}>
      <Input
        value={accountName}
        onChangeText={setAccountName}
        placeholder={t("Account name")}
        maxLength={75}
        title=""
        errorMessage={error.accountName}
      />
      <Input
        value={accountNumber}
        onChangeText={setAccountNumber}
        maxLength={18}
        placeholder={t("Account number")}
        errorMessage={error.accountNumber}
      />
      <Input
        value={ifscCode}
        onChangeText={setIfscCode}
        maxLength={11}
        placeholder={t("IFSC Code")}
      />
      </View>
      <Button title={t("Update")} onPress={handleUpdate} />
    </View>
  );
};

export {BankAccountEditForm};
