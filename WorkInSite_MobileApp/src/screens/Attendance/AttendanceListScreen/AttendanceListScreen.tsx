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
import { useAttendanceListScreen } from './useAttendanceListScreen';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import SearchComponent from '../../../components/CommonComponets/Search/Search';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import Button from '../../../components/CommonComponets/Button/Button';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import AttendanceCard from '../../../components/Card/AttendanceCard';

export default function AttendanceListScreen({ navigation }: any) {
  const { t } = useLanguage();
  const { theme } = useTheme()
  const {
    attendance,
    loading,
    paginationLoading,
    refreshing,
    hasMore,
    bottomSheetRef,
    appliedFilters,
    date,
    setDate,
    siteId,
    setSiteId,
    wageTypeId,
    setWageTypeId,
    workTypeId,
    workerId,
    setWorkerId,
    fetchSites,
    fetchWageTypes,
    fetchWorkTypes,
    fetchWorkers,
    siteDetails,
    workTypeDetails,
    wageTypeDetails,
    workerDetails,
    handleWorkTypeChange,
    fetchAttendance,
    handleBack,
    handlePress,
    handleSearch,
    handleClearSearch,
    handleRefresh,
    confirmDelete,
    handleEditAttendance,
  } =
    useAttendanceListScreen({ navigation });


  const isFiltered = !!(date ||
    siteId.value ||
    wageTypeId.value ||
    workTypeId.value ||
    workerId.value)

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate(RouteName.Home_SCREEN);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  if (loading && !refreshing) return <Loader />;

  if (!attendance.length && !appliedFilters) {
    return (
      <GetStartedCard
        buttonClick={RouteName.ATTENDANCE_CREATION_SCREEN}
        buttonLabel={t("Create Attendance")}
        imgSrc={images.worker_start_img}
        permissionKey='Attendance'>
        Simplify attendance tracking for your construction team. Start by adding a new record.
      </GetStartedCard>
    );
  }
  const ListFooter = () => {
    if (!hasMore || attendance.length === 0) return null;

    return (
      <View style={{ alignItems: 'flex-end', marginBottom: 10 }}>
        {paginationLoading ? (
          <View style={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
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
            onPress={() => fetchAttendance()}>
            <Text style={{ color: "#ffffff", fontWeight: 'bold' }}>{t('View More')}</Text>
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
      <Header title={t("Attendance List")} onBackPress={handleBack} handleCreate={handlePress} permissionKey='Attendance' />
      <SearchComponent onSearch={() => bottomSheetRef.current.open()}
        setSearch={appliedFilters || 'Search'}
        onClear={handleClearSearch} />
      <CustomBottomSheet
        scrollview={true}
        height={350}
        ref={bottomSheetRef}
        title={t("Attendance Search Form")}
        onClose={() => bottomSheetRef.current.close()}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ paddingBottom: 50 }}
          >
            <DatePicker
              date={date}
              onDateChange={setDate}
              label={t('Date')}
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
              label={t('Wage Type')}
              items={wageTypeDetails}
              selectedValue={wageTypeId}
              onValueChange={setWageTypeId}
              onSearch={fetchWageTypes}
              returnFullObject={true}
            />
            <Combo
              label={t('Work Type')}
              items={workTypeDetails}
              selectedValue={workTypeId}
              // onValueChange={setWorkTypeId}
              onValueChange={handleWorkTypeChange}
              onSearch={fetchWorkTypes}
              returnFullObject={true}
            />
            <Combo
              label={t('Worker')}
              items={workerDetails}
              selectedValue={workerId}
              onValueChange={setWorkerId}
              onSearch={fetchWorkers}
              isDisabled={workTypeId.workerCategoryId ? false : true}
              returnFullObject={true}
            />
            <Button
              buttonStyle={{ marginTop: 10 }}
              title={t('Search')}
              onPress={handleSearch}
              disable={!isFiltered}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </CustomBottomSheet>

      <View>
        {attendance.length === 0 ? (
          <Text style={Styles.emptyText}>{t("No Attendance found")}</Text>
        ) : (
          <FlatList
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            data={attendance}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <AttendanceCard
                key={item.id}
                siteName={item.site?.name}
                workTypeName={item.workType?.name}
                wageTypeName={item.wageType?.name}
                date={item.date}
                worker={item.worker?.name}
                onDelete={() => confirmDelete(item.id)}
                onPress={() => handleEditAttendance(item.id)}
                permissionKey='Attendance'
              />
            )}
            contentContainerStyle={Styles.listContainer}
            ListFooterComponent={ListFooter}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          />
        )}
      </View>
    </View>
  );
}

