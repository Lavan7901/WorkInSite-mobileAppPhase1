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
import { useMaterialShiftList } from './useMaterialShiftList';
import { useLanguage } from '../../../context/LanguageContext';
import SearchComponent from '../../../components/CommonComponets/Search/Search';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import Button from '../../../components/CommonComponets/Button/Button';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import Input from '../../../components/CommonComponets/Input/input';
import { useTheme } from '../../../context/ThemeContext';
import MaterialCard from '../../../components/Card/MaterialCard';

export default function MaterialShiftListScreen({ navigation }: any) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const {
    materialShiftDetails,
    fetchMaterialShifts,
    handleEditMaterialShift,
    loading,
    paginationLoading,
    refreshing,
    hasMore,
    confirmDelete,
    date,
    setDate,
    quantity,
    setQuantity,
    materialId,
    setMaterialId,
    sourceSiteId,
    setSourceSiteId,
    targetSiteId,
    setTargetSiteId,
    materialDetails,
    siteDetails,
    fetchMaterials,
    fetchSites,
    handleSearch,
    handleClearSearch,
    handleRefresh,
    bottomSheetRef,
    appliedFilters
  } = useMaterialShiftList({ navigation });

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

  const handlePress = () => {
    navigation.navigate(RouteName.MATERIALSHIFT_CREATION_SCREEN);
  };

  const handleBack = () => navigation.navigate(RouteName.Home_SCREEN);

  const isFiltered = !!(date || materialId?.value || sourceSiteId?.value || targetSiteId?.value || quantity);

  if (loading && !refreshing) return <Loader />;


  if (!materialShiftDetails.length && !appliedFilters) {
    return (
      <GetStartedCard
        buttonClick={RouteName.MATERIALSHIFT_CREATION_SCREEN}
        buttonLabel={t('New Material Shift')}
        imgSrc={images.site_creation}
        permissionKey='Material Shift'>
        Manage and track your material shifts efficiently. Start by creating a new record.
      </GetStartedCard>
    );
  }

  return (
    <View style={[commonStyle.container, { flex: 1 }]}>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t('Material Shift List')} onBackPress={handleBack} handleCreate={handlePress} permissionKey='Material Shift' />
      <SearchComponent
        onSearch={() => bottomSheetRef.current?.open()}
        setSearch={appliedFilters || 'Search'}
        onClear={handleClearSearch}
      />
      <CustomBottomSheet
        scrollview
        height={600}
        ref={bottomSheetRef}
        title={t('Material Shift Search Form')}
        onClose={() => bottomSheetRef.current?.close()}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <DatePicker date={date} onDateChange={setDate} label={t('Date')} />
            <Input
              title={t('Quantity')}
              value={quantity}
              onChangeText={setQuantity}
              placeholder={t('Enter quantity')}
            />
            <Combo
              label={t('Material')}
              items={materialDetails}
              selectedValue={materialId.value}
              onValueChange={setMaterialId}
              onSearch={fetchMaterials}
              returnFullObject={true}
            />
            <Combo
              label={t('Source Site')}
              items={siteDetails}
              selectedValue={sourceSiteId.value}
              onValueChange={setSourceSiteId}
              onSearch={fetchSites}
              returnFullObject={true}
            />
            <Combo
              label={t('Target Site')}
              items={siteDetails}
              selectedValue={targetSiteId.value}
              onValueChange={setTargetSiteId}
              onSearch={fetchSites}
              returnFullObject={true}
            />
            <Button buttonStyle={{ marginTop: 10 }} title={t('Search')} onPress={handleSearch} disable={!isFiltered} />
          </ScrollView>
        </KeyboardAvoidingView>
      </CustomBottomSheet>
      <View>
        {materialShiftDetails.length === 0 ? (
          <Text style={Styles.emptyText}>{t('No material shifts found')}</Text>
        ) : (
          <FlatList
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            data={materialShiftDetails}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={true}
            renderItem={({ item }) => (
              <MaterialCard
                material={item.material}
                sourceSite={item.sourceSite?.name}
                targetSite={item.targetSite?.name}
                date={item.date}
                quantity={item.quantity}
                unit={item.material?.unit?.name}
                onDelete={() => confirmDelete(item.id)}
                onPress={() => handleEditMaterialShift(item.id)}
                permissionKey='Material Shift'
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
                      onPress={() => fetchMaterialShifts()}
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
