import { Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../../utils/VectorIcons';
import { Colors } from '../../../utils';
import { useWorkTypeList } from './useWorkTypeList';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import WorkTypeEditForm from '../WorkTypeEditForm/WorkTypeEditForm';
import { WorkTypeListProps } from '../DTOs/WorkTypeProps';
import Styles from '../../../styles/TableStyle';
import { useLanguage } from '../../../context/LanguageContext';
import { usePermission } from '../../../hook/usePermission';
import IconButton from '../../../components/CommonComponets/IconButton/IconButton';

const WorkTypeList = (props: WorkTypeListProps) => {
    const { t } = useLanguage();
    const { canEdit } = usePermission()
    const { handleDelete, handleEdit, selectedItem, bottomSheetRef } = useWorkTypeList(props);
    const {
        workTypeList,
        setWorkTypeList,
        updatedWorkTypeList,
        setUpdatedWorkTypeList,
        deletedWorkTypeList,
        setDeletedWorkTypeList
    } = props

    const combinedList = [
        ...(workTypeList || []).map((item: any, index) => ({
            name: typeof item === 'string' ? item : item.name,
            index,
            source: 'new',
        })),
        ...(updatedWorkTypeList || []).map((item, index) => ({
            ...item,
            index,
            source: 'update',
        })),
    ];

    return (
        <View>
            {combinedList.map((item, index) => (
                <View key={`${item.name}-${index}`} style={[Styles.tableListItem, item?.source === 'new' ? { backgroundColor: '#cbf5dd' } : {}]}>
                    <Text style={[Styles.tableCell, { flex: 1 }]} numberOfLines={1} ellipsizeMode="middle">
                        {item.name}
                    </Text>
                    <View style={Styles.tableSpaceActions}>
                        <IconButton
                            onPress={() => handleEdit(item.index, item, item.source)}
                            iconType="MaterialIcons"
                            name="edit"
                            size={20}
                            color={Colors.secondaryColor}
                            disabled={!canEdit("Worker Category")}
                        />
                        <IconButton
                            onPress={() => handleDelete(item.index, item.source, item)}
                            iconType="MaterialIcons"
                            name="delete"
                            size={20}
                            color={Colors.dangerColor}
                            disabled={!canEdit("Worker Category")}
                        />
                    </View>
                </View>
            ))}

            <CustomBottomSheet
                ref={bottomSheetRef}
                title={t("Edit Work Type")}
                onClose={() => bottomSheetRef.current?.close()}
            >
                {selectedItem && (
                    <WorkTypeEditForm
                        workTypeList={workTypeList}
                        setWorkTypeList={setWorkTypeList}
                        Ref={bottomSheetRef}
                        selectedItem={selectedItem}
                        updatedWorkTypeList={updatedWorkTypeList}
                        setUpdatedWorkTypeList={setUpdatedWorkTypeList}
                        deletedWorkTypeList={deletedWorkTypeList}
                        setDeletedWorkTypeList={setDeletedWorkTypeList}
                    />
                )}
            </CustomBottomSheet>
        </View>
    );
};

export default WorkTypeList;
