// import {useState, useCallback} from 'react';
// import {useKycValidate} from '../KycValidate/KycValidate';

// enum KYCTypes {
//   AADHAAR = 'AADHAAR',
//   PAN = 'PAN',
//   GST = 'GST',
// }

// type KycCreateFormProps<T> = {
//   details: T;
//   setDetails: React.Dispatch<React.SetStateAction<T>>; // Properly typing setDetails
//   Ref?: any;
// };

// const useKycCreateForm = <
//   T extends {kycDetails: {kycType: KYCTypes; value: string}[]},
// >(
//   props: KycCreateFormProps<T>,
// ) => {
//   const {details, setDetails} = props;

//   const [kycType, setKycType] = useState<KYCTypes | ''>('');
//   const [input, setInput] = useState('');
//   const {error, setError, initialError, validate, kycItems} = useKycValidate(
//     input,
//     kycType as KYCTypes,
//   );

//   const getInputCount = (type: KYCTypes) =>
//     details.kycDetails.filter(item => item.value && item.kycType === type)
//       .length;

//   const filteredKycItems = kycItems.filter(
//     item => getInputCount(item.value) === 0,
//   );

//   const handleSelectChange = useCallback(
//     (value: KYCTypes) => {
//       setKycType(value);
//       setError(initialError);
//       setInput('');
//     },
//     [setKycType, setError, setInput, initialError],
//   );

//   const handleAdd = () => {
//     if (validate()) {
//       setDetails(prev => ({
//         ...prev,
//         kycDetails: [
//           ...prev.kycDetails,
//           {kycType: kycType as KYCTypes, value: input},
//         ],
//       }));
//       props.Ref?.current.close();
//     }
//   };

//   return {
//     kycType,
//     kycItems: filteredKycItems,
//     input,
//     setInput,
//     error,
//     handleSelectChange,
//     handleAdd,
//   };
// };

// export {useKycCreateForm};

//2

import {useState, useCallback} from 'react';
import {useKycValidate} from '../KycValidate/KycValidate';
import {KYCTypes, KycTypesProps} from '../DTOs/DTOs';

const useKycCreateForm = (props: KycTypesProps) => {
  const {details, setDetails} = props;
  const [kycType, setKycType] = useState<KYCTypes | ''>('');
  const [input, setInput] = useState('');
  const {error, setError, initialError, validate, kycItems} = useKycValidate(
    input,
    kycType as KYCTypes,
  );

  const getInputCount = (type: KYCTypes) =>
    details.kycDetails.filter(item => item.value && item.kycType === type)
      .length;

  const filteredKycItems = kycItems.filter(
    item => getInputCount(item.value) === 0,
  );

  const handleSelectChange = useCallback(
    (value: KYCTypes) => {
      setKycType(value);
      setError(initialError);
      setInput('');
    },
    [setKycType, setError, setInput, initialError],
  );

  const handleAdd = () => {
    if (validate()) {
      setDetails(prev => ({
        ...prev,
        kycDetails: [
          ...prev.kycDetails,
          {kycType: kycType as KYCTypes, value: input},
        ],
      }));
      props.Ref?.current?.close();
    }
  };

  return {
    kycType,
    kycItems: filteredKycItems,
    input,
    setInput,
    error,
    handleSelectChange,
    handleAdd,
  };
};

export {useKycCreateForm};
