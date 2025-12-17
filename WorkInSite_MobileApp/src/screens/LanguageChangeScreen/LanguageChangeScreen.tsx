import React, { useCallback } from 'react';
import { View, Text, ScrollView, BackHandler } from 'react-native';
import RadioButtonGroup from '../../components/CommonComponets/RadioButtonGroup/RadioButtonGroup';
import { useLanguage } from '../../context/LanguageContext';
import Header from '../../components/CommonComponets/Header/Header';
import { useFocusEffect } from '@react-navigation/native';
import commonStyle from '../../styles/commonStyle';
import RouteName from '../../navigation/RouteName';
 
const LanguageChangeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { language, setAppLanguage, t } = useLanguage();
 
useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      navigation.navigate(RouteName.PROFILE_SCREEN);
      return true;
    };
 
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
 
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [navigation])
);
 
  const languageOptions = [
    { label: t('English'), value: 'en' },
    { label: t('Tamil'), value: 'ta' },
  ];
 
  const onLanguageChange = (value: string) => {
    setAppLanguage(value as 'en' | 'ta');
  };
 
  return (
    <>
    <View style={commonStyle.container}>
      <Header title={t('App Language')} onBackPress={() => navigation.navigate(RouteName.PROFILE_SCREEN)} />
      <ScrollView contentContainerStyle={commonStyle.inputfieldContainer}>
          <Text style={commonStyle.labelStyle}>{t('App Language')}</Text>
          <RadioButtonGroup
            items={languageOptions}
            selectedValue={language}
            onValueChange={onLanguageChange}
            required
            label=""
          />
      </ScrollView>
      </View>
    </>
  );
};
 
export default LanguageChangeScreen;