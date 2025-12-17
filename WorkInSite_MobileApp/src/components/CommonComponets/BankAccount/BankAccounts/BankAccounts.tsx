import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BankAccountEditDeleteButtons } from '../BankAccountEditDeleteButtons/BankAccountEditDeleteButtons';
import images from '../../../..';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import componentStyle from '../../../../styles/componentStyle';


interface DynamicBankAccountsProp {
  details: {
    bankAccounts: {
      accountName: string;
      accountNumber: string;
      ifscCode: string;
    }[];
  };
  // setDetails: React.Dispatch<
  //   React.SetStateAction<{
  //     bankAccounts: { accountName: string; accountNumber: string; ifscCode: string }[];
  //   }>
  // >;
  setDetails: any;
  permissionKey?: string;
}

// interface BankAccount {
//   accountName: string;
//   accountNumber: string;
//   ifscCode: string;
// }

// interface DynamicBankAccountsDetails {
//   bankAccounts: BankAccount[];
// }

// export interface DynamicBankAccountsProp {
//   details: DynamicBankAccountsDetails;
//   setDetails: React.Dispatch<React.SetStateAction<DynamicBankAccountsDetails>>;
// }


const BankAccounts = (props: DynamicBankAccountsProp) => {
  const { details, setDetails, permissionKey } = props;
  const { theme } = useTheme();
  const { t } = useLanguage();
  return (
    <>
      {details.bankAccounts.map((item, index) => (
        <React.Fragment key={index}>
          {item.accountName && (
            <View style={[componentStyle.typeRowBetweenContainer, componentStyle.typeIconBottomSpacing
            ]}>
              <View style={componentStyle.typeRowIconWithText}>
                <View style={componentStyle.typeIconRightSpacing}>
                  <Image
                    source={images.bank_account_img}
                    style={{ width: 40, height: 26 }}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text style={componentStyle.typeText}>{item.accountName}</Text>
                  <Text style={componentStyle.typeText}>{item.accountNumber}</Text>
                  <Text style={componentStyle.typeText}>{item.ifscCode}</Text>
                  <TouchableOpacity onPress={() => { }}>
                    <Text style={[componentStyle.typeLinkText, { color: theme.secondaryColor }]}>{t("View More")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <BankAccountEditDeleteButtons
                details={details}
                setDetails={setDetails}
                selectedItem={{ id: index, item }}
                permissionKey={permissionKey}
              />
            </View>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export { BankAccounts };
