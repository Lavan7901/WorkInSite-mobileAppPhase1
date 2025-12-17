import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../utils';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import AttendanceSplitEditForm from '../AttendanceSplitEditForm/AttendanceSplitEditForm';
import { useLanguage } from '../../../context/LanguageContext';
import { Shift } from '../../Shift/DTOs/ShiftProps';
import { usePermission } from '../../../hook/usePermission';
import IconButton from '../../../components/CommonComponets/IconButton/IconButton';

export type WorkerCategory = {
  id: number;
  name: string;
  note: string;
};

export type WorkerRole = {
  id: number;
  name: string;
  salaryPerShift: string;
  hoursPerShift: string;
  workerCategory: WorkerCategory;
};

interface AttendanceSplit {
  workerRole: WorkerRole;
  shift: Shift;
  noOfPersons: string;
}

interface AttendanceSplitListProps {
  attendanceSplit: AttendanceSplit[];
  setAttendanceSplit: (attendanceSplit: AttendanceSplit[]) => void;
  confirmDelete: (attendanceSplitId: number) => void;
  workerCategoryId: number;
}

const AttendanceSplitList: React.FC<AttendanceSplitListProps> = ({
  attendanceSplit,
  confirmDelete,
  setAttendanceSplit,
  workerCategoryId,
}) => {
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit("Attendance")
  const bottomSheetRef = useRef<any>();
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceSplit | null>(null);

  const openEditSheet = (attendance: AttendanceSplit) => {
    setSelectedAttendance(attendance);
    bottomSheetRef.current?.open();
  };

  if (!attendanceSplit?.length) return null;

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerText}>{t('Role')}</Text>
        <Text style={s.headerText}>{t('No.')}</Text>
        <Text style={s.headerText}>{t('Shift')}</Text>
        <Text style={[s.headerText, s.actionHeader]}>{t('Action')}</Text>
      </View>

      {/* Rows */}
      {attendanceSplit.map((item, i) => (
        // <View key={i} style={[s.row, i % 2 && s.oddRow]}>
        <View key={i} style={[s.row, i % 2 === 1 ? s.oddRow : undefined]}>
          <View style={s.cell}>
            <Text style={s.roleName}>{item.workerRole.name}</Text>
            <Text style={s.category}>{item.workerRole.workerCategory.name}</Text>
          </View>
          <Text style={s.cell}>{item.noOfPersons}</Text>
          <Text style={s.cell}>{item.shift.name}</Text>
          <View style={s.actions}>
            <IconButton
              iconType='MaterialIcons'
              name="edit"
              size={20}
              color={Colors.secondaryColor}
              onPress={() => openEditSheet(item)}
              disabled={!editable}
            />
            <IconButton
              iconType='MaterialIcons'
              name="delete"
              size={20}
              color={Colors.secondaryColor}
              onPress={() => confirmDelete(i)}
              disabled={!editable}
            />
          </View>
        </View>
      ))}

      <CustomBottomSheet
        title={t('Edit Attendance Split')}
        ref={bottomSheetRef}
        onClose={() => bottomSheetRef.current?.close()}
      >
        {selectedAttendance && (
          <AttendanceSplitEditForm
            attendanceSplit={attendanceSplit}
            setAttendanceSplit={setAttendanceSplit}
            selectedAttendance={selectedAttendance}
            closeModal={() => bottomSheetRef.current?.close()}
            workerCategoryId={workerCategoryId}
          />
        )}
      </CustomBottomSheet>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerText: {
    flex: 1,
    fontWeight: '600',
    fontSize: 14,
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionHeader: {
    textAlign: 'center',
    flex: 0.7,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  oddRow: {
    backgroundColor: '#f8fafc',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
  },
  roleName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 0.7,
    gap: 8,
  },
  btn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
});

export default AttendanceSplitList;