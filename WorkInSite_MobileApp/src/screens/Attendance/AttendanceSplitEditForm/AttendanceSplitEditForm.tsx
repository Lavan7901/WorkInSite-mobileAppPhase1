import React from 'react';
import { View } from 'react-native';
import { Input } from '../../../components/CommonComponets';
import Button from '../../../components/CommonComponets/Button/Button';
import useAttendanceSplitEditForm from './useAttendanceSplitEditForm';
import { useLanguage } from '../../../context/LanguageContext';
import { Shift } from '../../Shift/DTOs/ShiftProps';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import commonStyle from '../../../styles/commonStyle';

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

interface AttendanceSplitEditFormProps {
    attendanceSplit: AttendanceSplit[];
    setAttendanceSplit: (attendanceSplit: AttendanceSplit[]) => void;
    selectedAttendance: AttendanceSplit;
    closeModal: () => void;
    workerCategoryId: number
}

const AttendanceSplitEditForm = (Props: AttendanceSplitEditFormProps) => {
    const { t } = useLanguage();
    const {
        workerRoleDetails,
        workerRoleId,
        shiftId,
        shiftDetails,
        error,
        noOfPersons,
        fetchShifts,
        setShiftId,
        setWorkerRoleId,
        fetchWorkerRoles,
        setNoOfPersons,
        handleSubmit

    } = useAttendanceSplitEditForm(Props)

    return (
        <View style={commonStyle.customSheetInputfieldSpacer}>
            <Combo
                label={t("Worker Role")}
                items={workerRoleDetails}
                selectedValue={workerRoleId.id.toString()}
                onValueChange={setWorkerRoleId}
                required
                onSearch={fetchWorkerRoles}
                errorMessage={error.workerRoleId}
                isDisabled={true}
            />
            <Combo
                label={t("Shift")}
                items={shiftDetails}
                selectedValue={shiftId.id.toString()}
                onValueChange={setShiftId}
                onSearch={fetchShifts}
                required
                errorMessage={error.shiftId}
            />
            <Input
                title={t("No Of Persons")}
                placeholder={t("Enter No Of Persons")}
                value={noOfPersons}
                onChangeText={setNoOfPersons}
                inputType='numeric'
                required
                errorMessage={error.noOfPersons}
            />
            <Button buttonStyle={{ marginTop: 10 }} title={t("Update")} onPress={handleSubmit} />
        </View>
    );
};

export default AttendanceSplitEditForm;
