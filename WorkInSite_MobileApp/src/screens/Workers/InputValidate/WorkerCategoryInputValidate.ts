// import {useState} from 'react';

// const useWorkerCategoryInputValidate = (
//   name: string,
//   workTypeList: any[],
//   workerRoleList: {
//     name: string;
//     salaryPerShift: string;
//     hoursPerShift: string;
//   }[],
//   updateworkerRoleList?: any[],
//   updatedWorkTypeList?: any[],
// ) => {
//   const initialError = {
//     name: '',
//     workTypeList: '',
//     workerRoleList: '',
//   };

//   const [error, setError] = useState(initialError);

//   const resetErrors = () => setError(initialError);

//   const validate = () => {
//     resetErrors();
//     let isValid = true;

//     const updateError = (field: keyof typeof error, message: string) => {
//       setError(prev => ({...prev, [field]: message}));
//       isValid = false;
//     };

//     // Validate workerCategoryName
//     if (!name) {
//       updateError('name', 'Please enter worker category name');
//     } else if (
//       name.length < 2 ||
//       !/^[a-zA-Z]+ ?[a-zA-Z]+ ?[a-zA-Z]*$/.test(name)
//     ) {
//       updateError('name', 'Invalid worker category name');
//     }

//     // Validate workTypeList (must not be empty)
//     if (workTypeList.length === 0 && updatedWorkTypeList.length === 0) {
//       updateError('workTypeList', 'At least one work type is required');
//     }

//     // Validate workerRoleList (must not be empty & valid salary/hours)
//     if (workerRoleList.length === 0 && updateworkerRoleList.length === 0) {
//       updateError('workerRoleList', 'At least one worker role is required');
//     }

//     return isValid;
//   };

//   return {error, validate, initialError, setError};
// };

// export {useWorkerCategoryInputValidate};

//2

import {useState} from 'react';

const useWorkerCategoryInputValidate = (
  name: string,
  workTypeList: any[],
  workerRoleList: {
    name: string;
    salaryPerShift: string;
    hoursPerShift: string;
  }[],
) => {
  const initialError = {
    name: '',
    workTypeList: '',
    workerRoleList: '',
  };

  const [error, setError] = useState(initialError);

  const resetErrors = () => setError(initialError);

  const validate = () => {
    resetErrors();
    let isValid = true;

    const updateError = (field: keyof typeof error, message: string) => {
      setError(prev => ({...prev, [field]: message}));
      isValid = false;
    };

    // Validate workerCategoryName
    if (!name) {
      updateError('name', 'Please enter worker category name');
    } else if (
      name.length < 2 ||
      !/^[a-zA-Z]+ ?[a-zA-Z]+ ?[a-zA-Z]*$/.test(name)
    ) {
      updateError('name', 'Invalid worker category name');
    }

    // Validate workTypeList (must not be empty)
    if (workTypeList.length === 0) {
      updateError('workTypeList', 'At least one work type is required');
    }

    // Validate workerRoleList (must not be empty & valid salary/hours)
    if (workerRoleList.length === 0) {
      updateError('workerRoleList', 'At least one worker role is required');
    }

    return isValid;
  };

  return {error, validate, initialError, setError};
};

export {useWorkerCategoryInputValidate};
