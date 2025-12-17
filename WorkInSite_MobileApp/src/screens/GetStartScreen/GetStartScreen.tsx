import React, { useCallback } from 'react';
import { View, Text, Image, BackHandler, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GetStartedCardProps } from './DTOs';
import Button from '../../components/CommonComponets/Button/Button';
import commonStyle from '../../styles/commonStyle';
import Header from '../../components/CommonComponets/Header/Header';
import Styles from '../../styles/GetStartScreenStyle';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../hook/usePermission';

const GetStartedCard = (props: GetStartedCardProps) => {
  const { imgSrc, buttonLabel, buttonClick, children, permissionKey } = props;
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home' as never);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );
  const handleBack = () => {
    navigation.navigate('Home' as never);
  };

  return (
    <>
      <Header title={t("Get Started")} onBackPress={handleBack} enableHome={false}/>
      <View style={commonStyle.container}>
        <View style={Styles.getStartContainer}>
          <View style={Styles.getStartCard}>
            <View style={Styles.getStartContent}>
              {imgSrc ? (
                <Image
                  source={imgSrc}
                  style={Styles.getStartImage}
                  resizeMode="contain"
                />
              ) : null}
              <Text style={Styles.getStartTitle}>{t("Get Started")}</Text>
              <Text style={Styles.getStartDescription}>{children}</Text>
              <Button
                title={buttonLabel}
                onPress={() => navigation.navigate(buttonClick as never)}
                disable={!hasPermission}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
export default GetStartedCard;
