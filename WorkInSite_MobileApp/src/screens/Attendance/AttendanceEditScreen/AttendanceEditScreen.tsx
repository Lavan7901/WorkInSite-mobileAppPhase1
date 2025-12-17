import React, { useCallback, useRef } from 'react';
import { BackHandler, ScrollView, Text, View } from 'react-native';
import Header from '../../../components/CommonComponets/Header/Header';
import { Input } from '../../../components/CommonComponets';
import Button from '../../../components/CommonComponets/Button/Button';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import { useFocusEffect } from '@react-navigation/native';
import { AttendanceSplitCreationScreen } from '../AttendanceSplitCreationScreen/AttendanceSplitCreationScreen';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import AttendanceSplitList from '../AttendanceSplitList/AttendanceSplitList';
import AttendancePhoto from '../AttendancePhoto/AttendancePhoto';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import { useAttendanceEditScreen } from './useAttendanceEditScreen';
import Loader from '../../../components/Loader/Loader';
import commonStyle from '../../../styles/commonStyle';
import { useLanguage } from '../../../context/LanguageContext';
import { FormActionButton } from '../../../components/CommonComponets/FormActionButton/FormActionButton';
import DynamicCamera from '../../../components/CommonComponets/Camera/Camera';
import UploadButton from '../../../components/CommonComponets/UploadButton/UploadButton';
import CameraGalleryChooser from '../../../components/CommonComponets/CameraGalleryChooser/CameraGalleryChooser';
import { usePermission } from '../../../hook/usePermission';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

const AttendanceEditScreen = ({ navigation, route }: any) => {
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit("Attendance")
  const {
    siteDetails,
    workTypeDetails,
    unitDetails,
    workerDetails,
    wageTypeDetails,
    workModeDetails,
    error,
    siteId,
    workType,
    unitId,
    workerId,
    wageTypeId,
    workModeId,
    notes,
    workedQuantity,
    date,
    attendanceSplit,
    uploadedImages,
    setAttendanceSplit,
    setDate,
    setWorkedQuantity,
    setSiteId,
    setWorkType,
    setUnitId,
    setWorkerId,
    setWageTypeId,
    setWorkModeId,
    setNotes,
    fetchSites,
    fetchWorkTypes,
    fetchUnits,
    fetchWorkers,
    fetchWageTypes,
    fetchWorkModes,
    handleBackPress,
    handleSubmit,
    hasUnsavedChanges,
    confirmDelete,
    setUploadedImages,
    handleImageUpload,
    bottomSheetRef,
    handleBottomSheetOpen,
    handleBottomSheetClose,
    imageSheetRef,
    handleImageSheetOpen,
    handleImageSheetClose,
    showCamera,
    setShowCamera,
    loading,
    viewImages,
    setViewImages,
    removeImages,
    setRemoveImages
  } = useAttendanceEditScreen({ navigation, route })

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [hasUnsavedChanges]),
  );

  if (loading) return <Loader />;
  return (
    <>
      {showCamera ? (
        <DynamicCamera
          onClose={() => setShowCamera(false)}
          onCapture={(metaList) => setUploadedImages((prev) => [...prev, ...metaList])}
        />
      ) : (
        <>
          <View style={{ zIndex: 9 }}>
            <ToastNotification />
          </View>
          <Header title={t("Edit Attendance")} onBackPress={handleBackPress} />
          <ScrollView style={commonStyle.flexContainer} keyboardShouldPersistTaps="handled">
            <View style={commonStyle.inputfieldContainer}>
              <DatePicker
                date={date}
                onDateChange={setDate}
                errorMessage={error.date}
                label={t("Date")}
                required
                disable={!editable}
              />
              <Combo
                label={t("Site")}
                items={siteDetails}
                selectedValue={siteId}
                onValueChange={setSiteId}
                required
                onSearch={fetchSites}
                errorMessage={error.site}
                isDisabled={!editable}
              />
              <Combo
                label={t("Wage Type")}
                items={wageTypeDetails}
                selectedValue={wageTypeId}
                onValueChange={setWageTypeId}
                required
                onSearch={fetchWageTypes}
                errorMessage={error.workType}
                isDisabled={!editable}
              />
              <Combo
                label={t("Work Type")}
                items={workTypeDetails}
                selectedValue={workType.id.toString()}
                onValueChange={setWorkType}
                required
                onSearch={fetchWorkTypes}
                errorMessage={error.workType}
                isDisabled
              />
              <Combo
                label={t("Worker")}
                items={workerDetails}
                selectedValue={workerId}
                onValueChange={setWorkerId}
                onSearch={fetchWorkers}
                required
                isDisabled={!editable}
                errorMessage={error.worker}
              />
              <Input
                title={t("Worked Quantity")}
                placeholder={t("Enter Worked Quantity")}
                value={workedQuantity}
                onChangeText={setWorkedQuantity}
                inputType='numeric'
                required
                errorMessage={error.workedQuantity}
                disabled={!editable}
              />
              <Combo
                label={t("Unit")}
                items={unitDetails}
                selectedValue={unitId}
                onValueChange={setUnitId}
                onSearch={fetchUnits}
                required
                errorMessage={error.unit}
                isDisabled={!editable}
              />
              <Combo
                label={t("Work Mode")}
                items={workModeDetails}
                selectedValue={workModeId}
                onValueChange={setWorkModeId}
                onSearch={fetchWorkModes}
                required
                errorMessage={error.workMode}
                isDisabled={!editable}
              />
              <FormActionButton
                heading={t('Attendance Split')}
                iconType='plus-circle'
                onClick={handleBottomSheetOpen}
                errorMessage={error.attendanceSplit}
                isIconDisabled={!editable}
              />
              <CustomBottomSheet title={t('Attendance Split')} ref={bottomSheetRef} onClose={handleBottomSheetClose} scrollview={true}>
                <AttendanceSplitCreationScreen workerCategoryId={workType.workerCategory.id} attendanceSplit={attendanceSplit}
                  setAttendanceSplit={setAttendanceSplit} Ref={bottomSheetRef} />
              </CustomBottomSheet>
              <AttendanceSplitList
                attendanceSplit={attendanceSplit}
                confirmDelete={confirmDelete}
                setAttendanceSplit={setAttendanceSplit}
                workerCategoryId={workType.workerCategory.id}
              />
              {(uploadedImages.length > 0 || viewImages?.length > 0) && (
                <AttendancePhoto
                  uploadedImages={uploadedImages}
                  setUploadedImages={setUploadedImages}
                  viewImages={viewImages}
                  setViewImages={setViewImages}
                  removeImages={removeImages}
                  setRemoveImages={setRemoveImages}
                  permissionKey='Attendance'
                />
              )}
              <UploadButton text="Upload Images" onPress={handleImageSheetOpen} disabled={!editable} />
              <CustomBottomSheet title='Image' ref={imageSheetRef} onClose={handleImageSheetClose} height={100}>
                <CameraGalleryChooser
                  onCameraPress={() => setShowCamera(true)}
                  onGalleryPress={handleImageUpload}
                />
              </CustomBottomSheet>
              <Textarea
                label={t("Notes")}
                placeholder={t("Enter your Notes")}
                value={notes}
                onChange={setNotes}
                isDisabled={!editable}
              />
              <Button title={t("Save")} onPress={handleSubmit} disable={!editable} />
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
};

export default AttendanceEditScreen;

