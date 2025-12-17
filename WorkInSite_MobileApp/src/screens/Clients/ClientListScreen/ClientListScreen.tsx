import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  RefreshControl,
  FlatList,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import { useClientList } from './useClientList';
import images from '../../../images';
import { ContactTypes } from '../../Contacts/DTOs/ContactProps';
import { useFocusEffect } from '@react-navigation/native';
import RouteName from '../../../navigation/RouteName';
import GetStartedCard from '../../GetStartScreen/GetStartScreen';
import SearchBar from '../../../components/CommonComponets/SearchBar/Searchbar';
import commonStyle from '../../../styles/commonStyle';
import Styles from '../../../styles/ListScreenStyle';
import Header from '../../../components/CommonComponets/Header/Header';
import Loader from '../../../components/Loader/Loader';
import { useLanguage } from '../../../context/LanguageContext';
import ContactCard from '../../../components/Card/ContactCard';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

export default function ClientListScreen({ navigation }: any) {
  const { t } = useLanguage();
  const {
    clientDetails,
    fetchClient,
    handleClientSelect,
    handleClientDelete,
    loading,
    searchText,
    setSearchText
  } = useClientList({ navigation });
  const [refreshing, setRefreshing] = useState(false);

  const filteredClientList = clientDetails.filter(user =>
    user.name.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchClient(searchText);
    setRefreshing(false);
  };

  const handlePress = () => {
    navigation.navigate(RouteName.CLIENT_CREATION_SCREEN);
  };

  const handleBack = () => {
    navigation.navigate(RouteName.Home_SCREEN);
  };

  useFocusEffect(
    React.useCallback(() => {
      setSearchText('');
      const onBackPress = () => {
        navigation.navigate(RouteName.Home_SCREEN);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  if (loading && !refreshing) {
    return <Loader />;
  }

  if (!clientDetails.length) {
    return (
      <GetStartedCard
        buttonClick="ClientCreationScreen"
        buttonLabel={t("Create Client")}
        imgSrc={images.client_creation}
        permissionKey="Clients">
        With WorkInSite, managing clients is simple and efficient. Start
        organizing your client relationships today to enhance communication and
        collaboration.
      </GetStartedCard>
    );
  }

  return (
    <View style={commonStyle.container}>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header
        title={t("Client List")}
        onBackPress={handleBack}
        handleCreate={handlePress}
        permissionKey="Clients"
      />
      <SearchBar searchText={searchText} setSearchText={setSearchText} />
      <KeyboardAvoidingView enabled style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          <View>
            {filteredClientList.length === 0 ? (
              <Text style={Styles.emptyText}>{t("No clients found")}</Text>
            ) : (
              <FlatList
                keyboardShouldPersistTaps="handled"
                data={filteredClientList}
                renderItem={
                  ({ item }) => (
                    <ContactCard
                      name={item.name}
                      phone={item.contact.phone}
                      email={
                        item.contact.contactDetails?.find(
                          (detail) => detail.contactType === ContactTypes.EMAIL
                        )?.value
                      }
                      onDelete={() => handleClientDelete(item.id)}
                      onPress={() => handleClientSelect(item.id)}
                      permissionKey='Clients'
                    />
                  )
                }
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={Styles.listContainer}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}