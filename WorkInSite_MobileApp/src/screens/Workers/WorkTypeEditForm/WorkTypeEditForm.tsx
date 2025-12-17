import { View } from 'react-native';
import { Input } from '../../../components/CommonComponets';
import Button from '../../../components/CommonComponets/Button/Button';
import { useWorkTypeEditForm } from './useWorkTypeEditForm';
import { WorkTypeEditFormProps } from '../DTOs/WorkTypeProps';
import commonStyle from '../../../styles/commonStyle';
import { nameRegex } from '../../../utils/regex';
import { useLanguage } from '../../../context/LanguageContext';

const WorkTypeEditForm = (props: WorkTypeEditFormProps) => {
  const { t } = useLanguage();
  const { name, setName, error, handleSave } = useWorkTypeEditForm(props)
  return (
    <View style={commonStyle.gapContainer}>
      <Input
        title={t("Work Type")}
        value={name}
        onChangeText={setName}
        placeholder={t("Enter work type")}
        errorMessage={error}
        regex={nameRegex}
        maxLength={50}
      />
      <Button title={t('Update')} onPress={handleSave} />
    </View>
  );
};

export default WorkTypeEditForm;
