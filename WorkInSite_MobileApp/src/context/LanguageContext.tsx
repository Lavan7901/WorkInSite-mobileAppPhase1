// import React, { createContext, useContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Localization from 'react-native-localize';
// import translations, { LanguageCode } from '../utils/translations';


// type LanguageContextType = {
//   language: LanguageCode;
//   setAppLanguage: (lang: LanguageCode) => void;
//   translate: (key: string) => string;
// };

// const LanguageContext = createContext<LanguageContextType>({
//   language: 'en',
//   setAppLanguage: () => {},
//   translate: (key: string) => key,
// });

// export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [language, setLanguageState] = useState<LanguageCode>('en');

//   useEffect(() => {
//     (async () => {
//       const storedLang = await AsyncStorage.getItem('APP_LANGUAGE');
//       if (storedLang && storedLang in translations) {
//         setLanguageState(storedLang as LanguageCode);
//       } else {
//         const deviceLang = Localization.getLocales()[0]?.languageCode;
//         if (deviceLang && deviceLang in translations) {
//           setLanguageState(deviceLang as LanguageCode);
//         }
//       }
//     })();
//   }, []);

//   const setAppLanguage = async (lang: LanguageCode) => {
//     await AsyncStorage.setItem('APP_LANGUAGE', lang);
//     setLanguageState(lang);
//   };

//   const translate = (key: string): string => {
//     return translations[language]?.[key] || key;
//   };

//   return (
//     <LanguageContext.Provider value={{ language, setAppLanguage, translate }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = () => useContext(LanguageContext);







import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'react-native-localize';
import translations, { LanguageCode } from '../utils/translations';


type LanguageContextType = {
  language: LanguageCode;
  setAppLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setAppLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    (async () => {
      const storedLang = await AsyncStorage.getItem('APP_LANGUAGE');
      if (storedLang && storedLang in translations) {
        setLanguageState(storedLang as LanguageCode);
      } else {
        const deviceLang = Localization.getLocales()[0]?.languageCode;
        if (deviceLang && deviceLang in translations) {
          setLanguageState(deviceLang as LanguageCode);
        }
      }
    })();
  }, []);

  const setAppLanguage = async (lang: LanguageCode) => {
    await AsyncStorage.setItem('APP_LANGUAGE', lang);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setAppLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
