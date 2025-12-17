import React, { useRef } from 'react';
import {
  View,
  FlatList,
  BackHandler,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import GetStartedCard from '../../GetStartScreen/GetStartScreen';
import images from '../../..';
import RouteName from '../../../navigation/RouteName';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import { ContactTypes } from '../../Contacts/DTOs/ContactProps';
import { useWorkerList } from './useWorkerList';
import commonStyle from '../../../styles/commonStyle';
import Styles from '../../../styles/ListScreenStyle';
import Header from '../../../components/CommonComponets/Header/Header';
import Loader from '../../../components/Loader/Loader';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import ContactCard from '../../../components/Card/ContactCard';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import { Input } from '../../../components/CommonComponets';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import Button from '../../../components/CommonComponets/Button/Button';
import SearchComponent from '../../../components/CommonComponets/Search/Search';
import { nameRegex } from '../../../utils/regex';

export default function WorkerListScreen({ navigation }: any) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const {
    setSearchText,
    hasMore,
    workerDetails,
    loading,
    paginationLoading,
    refreshing,
    fetchWorker,
    handleWorkerEdit,
    confirmDelete,
    handleBack,
    handlePress,
    handleRefresh,
    handleSearch,
    searchText,
    workerCategory,
    setWorkerCategory,
    workerCategoryDetails,
    fetchWorkerCategories,
    handleClearSearch,
    appliedFilters
  } = useWorkerList({ navigation });

  const bottomSheetRef = useRef<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate(RouteName.Home_SCREEN);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const isFiltered = !!(searchText || workerCategory?.value);

  if (loading && !refreshing) return <Loader />;

  if (!workerDetails.length && !appliedFilters) {
    return (
      <GetStartedCard
        buttonClick={RouteName.WORKER_CREATION_SCREEN}
        buttonLabel={t('Create Worker')}
        imgSrc={images.worker_start_img}
        permissionKey='Worker'>
        Simplify the management of your construction workers with WorkInSite.
        Get started today to ensure seamless coordination and productivity on your projects.
      </GetStartedCard>
    );
  }

  const ListFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={{ alignItems: 'flex-end', marginBottom: 10 }}>
        {paginationLoading ? (
          <View style={{ padding: 16, alignItems: 'center' }}>
            <Loader size="small" />
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
            onPress={() => fetchWorker()}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('View More')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={commonStyle.container}>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t('Worker List')} onBackPress={handleBack} handleCreate={handlePress} permissionKey='Worker' />
      <SearchComponent
        onSearch={() => bottomSheetRef.current?.open()}
        setSearch={appliedFilters || 'Search'}
        onClear={handleClearSearch}
      />
      <CustomBottomSheet
        scrollview
        height={400}
        ref={bottomSheetRef}
        title={t('Worker Search')}
        onClose={() => bottomSheetRef.current?.close()}>
        <Input
          title={t('Search Workers')}
          placeholder={t('Enter worker name')}
          value={searchText}
          onChangeText={setSearchText}
          regex={nameRegex}
        />
        <Combo
          label={t("Worker Category")}
          items={workerCategoryDetails}
          selectedValue={workerCategory?.value}
          onValueChange={setWorkerCategory}
          onSearch={fetchWorkerCategories}
          returnFullObject={true}
        />
        <Button title='Search' onPress={handleSearch} disable={!isFiltered} />
      </CustomBottomSheet>
      {workerDetails.length === 0 ? (
        <Text style={Styles.emptyText}>{t('No workers found')}</Text>
      ) : (
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={workerDetails}
          keyExtractor={worker => worker.id.toString()}
          renderItem={({ item: worker }) => (
            <ContactCard
              // name={worker.name}
              name={`${worker.name}[${worker.workerCategory?.name}]`}
              // workType={worker.workerCategory?.name}
              phone={worker.contact.phone}
              email={worker.contact.contactDetails?.find(
                detail => detail.contactType === ContactTypes.EMAIL
              )?.value}
              onDelete={() => confirmDelete(worker.id)}
              onPress={() => handleWorkerEdit(worker.id)}
              permissionKey='Worker'
            />
          )}
          ListFooterComponent={ListFooter}
          contentContainerStyle={Styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
}