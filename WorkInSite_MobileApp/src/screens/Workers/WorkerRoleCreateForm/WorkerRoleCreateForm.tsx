import { View } from 'react-native';
import React from 'react';
import { Input } from '../../../components/CommonComponets';
import { useWorkerRoleCreateForm } from './useWorkerRoleCreateForm';
import Button from '../../../components/CommonComponets/Button/Button';
import { WorkerRoleCreateFormProps } from '../DTOs/WorkerRoleProps';
import commonStyle from '../../../styles/commonStyle';
import { nameRegex, numberRegex } from '../../../utils/regex';
import { useLanguage } from '../../../context/LanguageContext';

const WorkerRoleCreateForm = (props: WorkerRoleCreateFormProps) => {
    const { t } = useLanguage();
    const {
        name,
        setName,
        salaryPerShift,
        setSalaryPerShift,
        hoursPerShift,
        setHoursPerShift,
        handleAdd,
        error
    } = useWorkerRoleCreateForm(props);

    return (
        <View style={commonStyle.gapContainer}>
            <Input
                title={t("Worker Role")}
                placeholder={t("Enter Worker Role")}
                value={name}
                onChangeText={setName}
                required
                errorMessage={error.name}
                regex={nameRegex}
                maxLength={50}
            />
            <Input
                title={t("Salary Per Shift")}
                placeholder={t("Enter Salary Per Shift")}
                value={salaryPerShift}
                onChangeText={setSalaryPerShift}
                inputType="numeric"
                required
                errorMessage={error.salaryPerShift}
                regex={numberRegex}
                maxLength={10}
            />
            <Input
                title={t("Hours Per Shift")}
                placeholder={t("Enter Hours Per Shift")}
                value={hoursPerShift}
                onChangeText={setHoursPerShift}
                inputType="numeric"
                required
                errorMessage={error.hoursPerShift}
                regex={numberRegex}
                maxLength={2}
            />
            <Button title={t("Add")} onPress={handleAdd} />
        </View>
    );
};

export default WorkerRoleCreateForm;
