import React from 'react';
import {
  RefreshControl,
  FlatList,
  BackHandler,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../../components/CommonComponets/Header/Header';
import commonStyle from '../../../../styles/commonStyle';
import RouteName from '../../../../navigation/RouteName';
import Loader from '../../../../components/Loader/Loader';
import CustomBottomSheet from '../../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import SearchComponent from '../../../../components/CommonComponets/Search/Search';
import DatePicker from '../../../../components/CommonComponets/DatePicker/DatePicker';
import { useLanguage } from '../../../../context/LanguageContext';
import Button from '../../../../components/CommonComponets/Button/Button';
import GetStartedCard from '../../../GetStartScreen/GetStartScreen';
import images from '../../../..';
import { useTheme } from '../../../../context/ThemeContext';
import Styles from '../../../../styles/ListScreenStyle';
import { useWorkerTransactiontList } from './useWorkerTransactions';
import { WorkerTransactionProps } from '../DTOs/WorkerTransaction';
import { Combo } from '../../../../components/CommonComponets/Combo/Combo';
import TransactionCard from '../../../../components/Card/TransactionCard';
import ToastNotification from '../../../../components/CommonComponets/Toast/Toast';

const ClientTransactionList = ({ navigation }: any) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const {
    worker,
    workerDetails,
    setWorker,
    fromDate,
    setFromDate,
    toDate,
    seToDate,
    fetchWorkers,
    transactions,
    fetchWorkerTransactions,
    handleBackPress,
    handleCreate,
    handleDeleteConfirm,
    handleEdit,
    loading,
    handleSearch,
    handleRefresh,
    handleClearSearch,
    refreshing,
    paginationLoading,
    hasMore,
    appliedFilters,
    bottomSheetRef,
  } = useWorkerTransactiontList({ navigation });

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate(RouteName.Home_SCREEN);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const isFiltered = !!(fromDate || toDate || worker?.value);

  if (loading && !refreshing) return <Loader />;

  if (!transactions.length && !appliedFilters) {
    return (
      <GetStartedCard
        buttonClick={RouteName.WORKER_TRANSACTION_CREATION_SCEEN}
        buttonLabel={t('New Worker Transaction')}
        imgSrc={images.contact_start_img}
        permissionKey='Worker Transaction'>
        {t('Start by creating your Worker transactions to organize and manage your records efficiently.')}
      </GetStartedCard>
    );
  }

  const ListFooter = () => {
    if (!hasMore || transactions.length === 0) return null;

    return (
      <View style={{ alignItems: 'flex-end', marginBottom: 10 }}>
        {paginationLoading ? (
          <View style={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
            <Loader size='small' />
          </View>
        ) : (
          <TouchableOpacity
            style={{
              margin: 14,
              padding: 10,
              backgroundColor: theme.primaryColor,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => fetchWorkerTransactions()}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('View More')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderItem = ({ item }: { item: WorkerTransactionProps }) => {
    const { id, worker, date, amount, paymentMethod } = item;
    return (
      <TransactionCard
        id={id}
        name={worker.name}
        amount={amount}
        date={date}
        paymentMethod={paymentMethod}
        onDelete={handleDeleteConfirm}
        onPress={handleEdit}
        permissionKey='Worker Transaction'
      />
    );
  };

  return (
    <View style={commonStyle.container}>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header
        title="Worker Transaction List"
        onBackPress={handleBackPress}
        handleCreate={handleCreate}
        permissionKey='Worker Transaction'
      />
      <SearchComponent
        onSearch={() => bottomSheetRef.current?.open()}
        setSearch={appliedFilters || 'Search'}
        onClear={handleClearSearch}
      />
      <CustomBottomSheet ref={bottomSheetRef} onClose={() => bottomSheetRef.current.close()} title='Search' >
        <View style={{ gap: 10 }}>
          <Combo
            label={t('Woker')}
            items={workerDetails}
            selectedValue={worker}
            onValueChange={setWorker}
            onSearch={fetchWorkers}
            returnFullObject={true}
          />
          <DatePicker
            date={fromDate}
            onDateChange={setFromDate}
            label='From Date'
          />
          <DatePicker
            date={toDate}
            onDateChange={seToDate}
            label='To Date'
          />
          <Button title='Search' onPress={handleSearch} disable={!isFiltered} />
        </View>
      </CustomBottomSheet>


      <View style={{ flex: 1 }}>
        {transactions.length === 0 ? (
          <Text style={Styles.emptyText}>{t('No worker transaction found')}</Text>
        ) : (
          <FlatList
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            data={transactions}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={true}
            ListFooterComponent={ListFooter}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        )}</View>


    </View>
  );
};

export default ClientTransactionList;
