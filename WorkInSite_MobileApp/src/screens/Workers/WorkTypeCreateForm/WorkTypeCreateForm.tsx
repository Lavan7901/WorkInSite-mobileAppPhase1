import { View } from 'react-native'
import React from 'react'
import { Input } from '../../../components/CommonComponets'
import { useWorkType } from './useWorkTypeCreateForm';
import Button from '../../../components/CommonComponets/Button/Button';
import { WorkTypeCreateFormProps } from '../DTOs/WorkTypeProps';
import commonStyle from '../../../styles/commonStyle';
import { nameRegex } from '../../../utils/regex';
import { useLanguage } from '../../../context/LanguageContext';

const WorkTypeCreateForm = (props: WorkTypeCreateFormProps) => {
    const { t } = useLanguage();
    const {
        workType,
        setWorkType,
        handleAdd,
        error,
    } = useWorkType(props)
    return (
        <View style={commonStyle.gapContainer}>
            <Input
                title={t("Work Type")}
                placeholder={t("Enter Work Type")}
                value={workType}
                onChangeText={setWorkType}
                required
                errorMessage={error}
                regex={nameRegex}
                maxLength={50}
            />
            <Button title={t('Add')} onPress={handleAdd} />
        </View>
    )
}

export default WorkTypeCreateForm
