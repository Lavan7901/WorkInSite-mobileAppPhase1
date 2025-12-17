import React, { useRef } from 'react';
import {
  View,
  FlatList,
  BackHandler,
  TouchableOpacity,
  Text,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import GetStartedCard from '../../GetStartScreen/GetStartScreen';
import images from '../../..';
import RouteName from '../../../navigation/RouteName';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import commonStyle from '../../../styles/commonStyle';
import Styles from '../../../styles/ListScreenStyle';
import Header from '../../../components/CommonComponets/Header/Header';
import Loader from '../../../components/Loader/Loader';
import { usePurchaseList } from './usePurchaseList';
import { useLanguage } from '../../../context/LanguageContext';
import SearchComponent from '../../../components/CommonComponets/Search/Search';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import Button from '../../../components/CommonComponets/Button/Button';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import Input from '../../../components/CommonComponets/Input/input';
import { useTheme } from '../../../context/ThemeContext';
import ContactCard from '../../../components/Card/ContactCard';

export default function PurchaseListScreen({ navigation }: any) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const {
    purchaseDetails,
    fetchPurchases,
    handleEditPurchase,
    loading,
    paginationLoading,
    refreshing,
    hasMore,
    confirmDelete,
    date,
    setDate,
    billNumber,
    setBillNumber,
    siteId,
    setSiteId,
    supplierId,
    setSupplierId,
    siteDetails,
    supplierDetails,
    fetchSites,
    fetchSuppliers,
    handleSearch,
    handleClearSearch,
    handleRefresh,
    appliedFilters
  } = usePurchaseList({ navigation });

  const bottomSheetRef = useRef<any>(null);

  const handleClearAndGoBack = () => {
    handleClearSearch();
    bottomSheetRef.current?.close();
    handleRefresh();
    navigation.navigate(RouteName.Home_SCREEN); // ✅ safer
  };
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleClearAndGoBack();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handlePress = () => {
    navigation.navigate(RouteName.PURCHASE_CREATION_SCREEN);
  };

  const handleBack = () => {
    handleClearAndGoBack();
  };

  const isFiltered = !!(date || billNumber || siteId?.value || supplierId?.value);

  if (loading && !refreshing) {
    return <Loader />;
  }

  if (!purchaseDetails.length && !appliedFilters) {
    return (
      <GetStartedCard
        buttonClick={RouteName.PURCHASE_CREATION_SCREEN}
        buttonLabel={t('New Purchase')}
        imgSrc={images.client_creation}
        permissionKey='Purchase'
      >
        Manage and track your purchases seamlessly with WorkInsite. Add new
        purchases and keep your construction materials organized.
      </GetStartedCard>
    );
  }

  return (
    <View style={[commonStyle.container, { flex: 1 }]}>
       <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header
        title={t('Purchase List')}
        onBackPress={handleBack}
        handleCreate={handlePress}
        permissionKey='Purchase' />
      <SearchComponent
        onSearch={() => bottomSheetRef.current?.open()}
        setSearch={appliedFilters || 'Search'}
        onClear={handleClearSearch}
      />

      <CustomBottomSheet
        scrollview
        height={600}
        ref={bottomSheetRef}
        title={t('Purchase Search Form')}
        onClose={() => bottomSheetRef.current?.close()}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
            <DatePicker date={date} onDateChange={setDate} label={t('Date')} />
            <Input
              title={t('Bill Number')}
              value={billNumber}
              onChangeText={setBillNumber}
              placeholder={t('Enter bill number')}
            />
            <Combo
              label={t('Site')}
              items={siteDetails}
              selectedValue={siteId.value}
              onValueChange={setSiteId}
              onSearch={fetchSites}
              returnFullObject={true}
            />
            <Combo
              label={t('Supplier')}
              items={supplierDetails}
              selectedValue={supplierId.value}
              onValueChange={setSupplierId}
              onSearch={fetchSuppliers}
              returnFullObject={true}
            />
            <Button buttonStyle={{ marginTop: 10 }} title={t('Search')} onPress={handleSearch}  disable={!isFiltered} />
          </ScrollView>
        </KeyboardAvoidingView>
      </CustomBottomSheet>

      <View style={{ flex: 1 }}>
        {purchaseDetails.length === 0 ? (
          <Text style={Styles.emptyText}>{t('No purchases found')}</Text>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={purchaseDetails}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={true}
            renderItem={({ item }) => (
              <ContactCard
                key={item.id}
                name={item.supplier?.name}
                billNumber={item.billNumber}
                site={item.site?.name}
                date={item.date}
                onPress={() => handleEditPurchase(item.id)}
                onDelete={() => confirmDelete(item.id)}
              />
            )}
            contentContainerStyle={Styles.listContainer}
            ListFooterComponent={() => {
              if (!hasMore) return null;
              return (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 10, paddingHorizontal: 16 }}>
                  {paginationLoading ? (
                    <Loader size="small" />
                  ) : (
                    <TouchableOpacity
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        backgroundColor: theme.primaryColor,
                        borderRadius: 8,
                      }}
                      onPress={() => fetchPurchases()}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('View More')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          />
        )}
      </View>
    </View >
  );
}
