import React from 'react';
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
import { useLanguage } from '../../../context/LanguageContext';
import SearchComponent from '../../../components/CommonComponets/Search/Search';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import Button from '../../../components/CommonComponets/Button/Button';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import Input from '../../../components/CommonComponets/Input/input';
import { useMaterialUsedList } from './useMaterialUsedList';
import { useTheme } from '../../../context/ThemeContext';
import MaterialCard from '../../../components/Card/MaterialCard';

export default function MaterialUsedListScreen({ navigation }: any) {
  const { t } = useLanguage();
  const { theme } = useTheme()
  const {
    siteId,
    setSiteId,
    date,
    setDate,
    materialId,
    setMaterialId,
    workModeId,
    setWorkModeId,
    quantity,
    setQuantity,
    fetchSites,
    fetchMaterials,
    fetchWorkModes,
    siteDetails,
    workModeDetails,
    materialDetails,
    hasMore,
    materialUsedDetails,
    loading,
    paginationLoading,
    refreshing,
    bottomSheetRef,
    appliedFilters,
    fetchMaterialUsed,
    handleMaterialUsedEdit,
    confirmDelete,
    handleBack,
    handleClearSearch,
    handlePress,
    handleRefresh,
    handleSearch,
  } = useMaterialUsedList({ navigation });

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

  const isFiltered = !!(date || materialId?.value || siteId?.value || workModeId?.value || quantity);

  if (loading && !refreshing) return <Loader />;

  if (!materialUsedDetails.length && !appliedFilters) {
    return (
      <GetStartedCard
        buttonClick={RouteName.MATERIALUSED_CREATION_SCREEN}
        buttonLabel={t('New Material Used')}
        imgSrc={images.site_creation}
        permissionKey='Material Used'>
        Manage and track your material used efficiently. Start by creating a new record.
      </GetStartedCard>
    );
  }

  return (
    <View style={[commonStyle.container, { flex: 1 }]}>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t('Material Used List')} onBackPress={handleBack} handleCreate={handlePress} permissionKey='Material Used' />
      <SearchComponent
        onSearch={() => bottomSheetRef.current?.open()}
        setSearch={appliedFilters || 'Search'}
        onClear={handleClearSearch}
      />
      <CustomBottomSheet
        scrollview
        height={400}
        ref={bottomSheetRef}
        title={t('Material Used Search')}
        onClose={() => bottomSheetRef.current?.close()}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <DatePicker
              label={t("Date")}
              date={date}
              onDateChange={setDate}
            />
            <Combo
              label={t("Site")}
              items={siteDetails}
              selectedValue={siteId.value}
              onValueChange={setSiteId}
              onSearch={fetchSites}
              placeholder={t("Select Site")}
              returnFullObject={true}
            />
            <Combo
              label={t("Material")}
              items={materialDetails}
              selectedValue={materialId.value}
              onValueChange={setMaterialId}
              onSearch={fetchMaterials}
              placeholder={t("Select Material")}
              returnFullObject={true}
            />
            <Input
              title={t("Quantity")}
              placeholder={t("Quantity")}
              value={quantity}
              onChangeText={setQuantity}
            />
            <Combo
              label={t("Work Mode")}
              items={workModeDetails}
              selectedValue={workModeId}
              onValueChange={setWorkModeId}
              onSearch={fetchWorkModes}
              placeholder={t("Select Work Mode")}
              returnFullObject={true}
            />
            <Button buttonStyle={{ marginTop: 10 }} title={t('Search')} disable={!isFiltered} onPress={handleSearch} />
          </ScrollView>
        </KeyboardAvoidingView>
      </CustomBottomSheet>
      <View>
        {materialUsedDetails.length === 0 ? (
          <Text style={Styles.emptyText}>{t('No material used found')}</Text>
        ) : (
          <FlatList
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            data={materialUsedDetails}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={true}
            renderItem={({ item }) => (
              <MaterialCard
                material={item.material}
                site={item.site?.name}
                date={item.date}
                workmode={item.workMode?.name}
                quantity={item.quantity}
                unit={item.material?.unit?.name}
                onDelete={() => confirmDelete(item.id)}
                onPress={() => handleMaterialUsedEdit(item.id)}
                permissionKey='Material Used'
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
                      onPress={() => fetchMaterialUsed()}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('View More')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        )}
      </View>
    </View>
  );
}

