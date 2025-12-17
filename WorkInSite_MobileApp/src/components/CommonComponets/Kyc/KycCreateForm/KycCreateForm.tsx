// import React from 'react';
// import {View} from 'react-native';
// import {useKycCreateForm} from './useKycCreateForm';
// import {KycInputFields} from '../KycInputFields/KycInputFields';
// import Select from '../../Select/Select';
// import Button from '../../Button/Button';
// import {KYCTypes} from '../DTOs/DTOs';

// type KycCreateFormProps<T> = {
//   details: T;
//   setDetails: React.Dispatch<React.SetStateAction<T>>;
//   Ref?: any;
// };

// const KycCreateForm = <
//   T extends {kycDetails: {kycType: KYCTypes; value: string}[]},
// >({
//   details,
//   setDetails,
//   Ref,
// }: KycCreateFormProps<T>) => {
//   const {
//     kycType,
//     kycItems,
//     input,
//     setInput,
//     error,
//     handleSelectChange,
//     handleAdd,
//   } = useKycCreateForm({details, setDetails, Ref});

//   return (
//     <View>
//       <Select
//         items={kycItems}
//         selectedValue={kycType}
//         onValueChange={handleSelectChange}
//         required={false}
//         errorMessage={error.select}
//       />
//       <KycInputFields
//         kycType={kycType as KYCTypes}
//         input={input}
//         setInput={setInput}
//         error={error}
//       />
//       <Button buttonStyle={{marginTop: 16}} title={t("Add")} onPress={handleAdd} />
//     </View>
//   );
// };

// export {KycCreateForm};

//2

import React from 'react';
import {View} from 'react-native';
import {useKycCreateForm} from './useKycCreateForm';
import {KycInputFields} from '../KycInputFields/KycInputFields';
import Select from '../../Select/Select';
import Button from '../../Button/Button';
import { KYCTypes} from '../DTOs/DTOs';
import { useLanguage } from '../../../../context/LanguageContext';
import commonStyle from '../../../../styles/commonStyle';

interface KycTypesProps {
  details: any;
  setDetails: React.Dispatch<React.SetStateAction<any>>;
  Ref?: any;
}

// export interface KycTypesProps {
//   details: KycDetails;
//   setDetails: React.Dispatch<React.SetStateAction<KycDetails>>;
//   Ref?: React.RefObject<{ close: () => void }>; // or more methods if needed
// }

const KycCreateForm = ({details, setDetails, Ref}: KycTypesProps) => {
   const { t } =  useLanguage();
  const {
    kycType,
    kycItems,
    input,
    setInput,
    error,
    handleSelectChange,
    handleAdd,
  } = useKycCreateForm({details, setDetails, Ref});

  return (
    <View>
    <View style={commonStyle.gapContainer}>
      <Select
        items={kycItems}
        selectedValue={kycType}
        onValueChange={handleSelectChange}
        required={false}
        errorMessage={error.select}
      />
      <KycInputFields
        kycType={kycType as KYCTypes}
        input={input}
        setInput={setInput}
        error={error}
      />
      </View>
      <Button title={t("Add")} onPress={handleAdd} />
    </View>
  );
};

export {KycCreateForm};
