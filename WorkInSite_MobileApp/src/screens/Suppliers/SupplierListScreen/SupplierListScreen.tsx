import React, { useState } from 'react';
import {
  View,
  FlatList,
  BackHandler,
  Text,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import GetStartedCard from '../../GetStartScreen/GetStartScreen';
import SearchBar from '../../../components/CommonComponets/SearchBar/Searchbar';
import images from '../../..';
import RouteName from '../../../navigation/RouteName';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import { useSupplierList } from './useSupplierList';
import { ContactTypes } from '../../Contacts/DTOs/ContactProps';
import commonStyle from '../../../styles/commonStyle';
import Styles from '../../../styles/ListScreenStyle';
import Header from '../../../components/CommonComponets/Header/Header';
import Loader from '../../../components/Loader/Loader';
import { useLanguage } from '../../../context/LanguageContext';
import ContactCard from '../../../components/Card/ContactCard';

export default function SupplierListScreen({ navigation }: any) {
  const { t } = useLanguage();
  const {
    supplierDetails,
    fetchSupplier,
    handleEditSupplier,
    loading,
    confirmDelete,
    searchText,
    setSearchText
  } = useSupplierList({ navigation });

  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setSearchText(''); // reset search text
      const onBackPress = () => {
        navigation.navigate(RouteName.Home_SCREEN);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const filteredSupplierrList = supplierDetails.filter(user =>
    user.name.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSupplier();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return <Loader />;
  }

  if (!supplierDetails.length) {
    return (
      <GetStartedCard
        buttonClick={RouteName.SUPPLIER_CREATION_SCREEN}
        buttonLabel={t("New Supplier")}
        imgSrc={images.supplier_start_img}
        permissionKey='Suppliers'>
        Effortlessly manage your suppliers and streamline your construction
        project supply chain with WorkInsite. Get started today and optimize
        your procurement process.
      </GetStartedCard>
    );
  }

  const handlePress = () => {
    navigation.navigate(RouteName.SUPPLIER_CREATION_SCREEN);
  };

  const handleBack = () => {
    navigation.navigate(RouteName.Home_SCREEN);
  };

  return (
    <View style={commonStyle.container}>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header
        title={t("Supplier List")}
        onBackPress={handleBack}
        handleCreate={handlePress}
        permissionKey='Suppliers'
      />
      <SearchBar searchText={searchText} setSearchText={setSearchText} />
      <View>
        {filteredSupplierrList.length === 0 ? (
          <Text style={Styles.emptyText}>{t("No suppliers found")}</Text>
        ) : (
          <FlatList
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            data={filteredSupplierrList}
            keyExtractor={supplier => supplier.id.toString()}
            renderItem={({ item }) => (
              <ContactCard
                key={item.id}
                name={item.name}
                phone={item.contact.phone}
                email={
                  item.contact.contactDetails?.find(
                    (detail) => detail.contactType === ContactTypes.EMAIL
                  )?.value
                }
                onDelete={() => confirmDelete(item.id)}
                onPress={() => handleEditSupplier(item.id)}
                permissionKey='Suppliers'
              />
            )}
            contentContainerStyle={Styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </View>
  );
}
