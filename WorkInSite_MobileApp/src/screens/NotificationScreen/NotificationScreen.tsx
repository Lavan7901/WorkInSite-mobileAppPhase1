import React from 'react';
import {
  View,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../components/CommonComponets/Header/Header';
import { useLanguage } from '../../context/LanguageContext';

const NotificationScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  const handleBackPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View>
      <Header title={t("Notifications")} onBackPress={handleBackPress} enableHome={false} />
    </View>
  );
};

export default NotificationScreen;

