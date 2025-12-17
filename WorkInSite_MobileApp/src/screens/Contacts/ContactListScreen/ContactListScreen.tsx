import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  BackHandler,
  RefreshControl,
  Text,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import GetStartedCard from '../../GetStartScreen/GetStartScreen';
import SearchBar from '../../../components/CommonComponets/SearchBar/Searchbar';
import images from '../../..';
import RouteName from '../../../navigation/RouteName';
import { useContactList } from './useContactList';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import commonStyle from '../../../styles/commonStyle';
import Styles from '../../../styles/ListScreenStyle';
import Header from '../../../components/CommonComponets/Header/Header';
import { ContactTypes } from '../DTOs/ContactProps';
import Loader from '../../../components/Loader/Loader';
import { useLanguage } from '../../../context/LanguageContext';
import ContactCard from '../../../components/Card/ContactCard';

export default function ContactListScreen({ navigation }: any) {
  const { t } = useLanguage();

  const {
    contactList,
    loading,
    refreshing,
    handleEditContact,
    fetchContact,
    confirmDelete,
    searchText,
    setSearchText,
    setRefreshing,
  } = useContactList({ navigation });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setSearchText("")
        navigation.navigate(RouteName.Home_SCREEN);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  const filteredContactList = useMemo(
    () =>
      contactList.filter(user =>
        user.name.toLowerCase().includes(searchText.trim().toLowerCase()),
      ),
    [contactList, searchText],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchContact();
    setRefreshing(false);
  }, [fetchContact]);


  const handleBack = useCallback(() => {
    setSearchText("")
    navigation.navigate(RouteName.Home_SCREEN);
  }, [navigation]);

  const handlePress = useCallback(() => {
    navigation.navigate(RouteName.CONTACT_CREATION_SCREEN);
  }, [navigation]);

  if (loading && !refreshing) {
    return <Loader />;
  }

  if (!contactList.length) {
    return (
      <GetStartedCard
        buttonClick={RouteName.CONTACT_CREATION_SCREEN}
        buttonLabel={t("New Contact")}
        imgSrc={images.contact_start_img}
        permissionKey="Contacts">
        With WorkInSite, managing contacts and facilitating collaboration is
        easy. Start organizing your contacts today to streamline communication.
      </GetStartedCard>
    );
  }

  return (
    <View style={commonStyle.container}>
      <Header
        title={t("Contact List")}
        onBackPress={handleBack}
        handleCreate={handlePress}
        permissionKey="Contacts"
      />
      <SearchBar searchText={searchText} setSearchText={setSearchText} />
      <View style={commonStyle.toast}>
        <ToastNotification />
      </View>
      <View>
        {filteredContactList.length === 0 ? (
          <Text style={Styles.emptyText}>{t("No contacts found")}</Text>
        ) : (
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={filteredContactList}
            renderItem={({ item }) => (
              <ContactCard
                name={item.name}
                phone={item.phone}
                email={
                  item.contactDetails.find(
                    (detail) => detail.contactType === ContactTypes.EMAIL
                  )?.value
                }
                onDelete={() => confirmDelete(item.id)}
                onPress={() => handleEditContact(item.id)}
                permissionKey='Contacts'
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={[Styles.listContainer]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </View>
  );
}
