import React from 'react';
import { View } from 'react-native';
import { Input } from '../../../components/CommonComponets';
import Button from '../../../components/CommonComponets/Button/Button';
import { useWorkerRoleEditForm } from './useWorkerRoleEditForm';
import { WorkerRoleEditFormProps } from '../DTOs/WorkerRoleProps';
import commonStyle from '../../../styles/commonStyle';
import { nameRegex, numberRegex } from '../../../utils/regex';
import { useLanguage } from '../../../context/LanguageContext';

const WorkerRoleEditForm = (props: WorkerRoleEditFormProps) => {
    const { t } = useLanguage();
    const {
        name,
        setName,
        salaryPerShift,
        setSalaryPerShift,
        hoursPerShift,
        setHoursPerShift,
        error,
        handleSave,
    } = useWorkerRoleEditForm(props)

    return (
        <View style={commonStyle.gapContainer}>
            <Input
                title={t('Worker Role')}
                value={name}
                onChangeText={setName}
                placeholder={t('Enter worker role')}
                errorMessage={error.name}
                maxLength={50}
                regex={nameRegex}
            />
            <Input
                title={t('Salary Per Shift')}
                value={salaryPerShift}
                onChangeText={setSalaryPerShift}
                inputType="numeric"
                placeholder={t('Enter Salary Per Shift')}
                errorMessage={error.salaryPerShift}
                regex={numberRegex}
                maxLength={10}
            />
            <Input
                title={t('Hours Per Shift')}
                value={hoursPerShift}
                onChangeText={setHoursPerShift}
                inputType="numeric"
                placeholder={t('Enter Hours Per Shift')}
                errorMessage={error.hoursPerShift}
                maxLength={2}
                regex={numberRegex}
            />
            <Button title={t("Update")} onPress={handleSave} />
        </View>
    );
};

export default WorkerRoleEditForm;
