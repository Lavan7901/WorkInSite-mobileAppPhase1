import { Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../../utils/VectorIcons';
import { Colors } from '../../../utils';
import { useWorkerRoleList } from './useWorkerRoleList';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import WorkerRoleEditForm from '../WorkerRoleEditForm/WorkerRoleEditForm';
import { WorkerRoleListProps } from '../DTOs/WorkerRoleProps';
import Styles from "../../../styles/TableStyle";
import { useLanguage } from '../../../context/LanguageContext';
import { usePermission } from '../../../hook/usePermission';
import IconButton from '../../../components/CommonComponets/IconButton/IconButton';

const WorkerRoleList = (props: WorkerRoleListProps) => {
    const { t } = useLanguage();
    const { canEdit } = usePermission()
    const {
        handleDelete,
        handleEdit,
        selectedItem,
        workerRoleBottomSheetRef
    } = useWorkerRoleList(props);

    const {
        workerRoleList,
        setWorkerRoleList,
        updateworkerRoleList,
        setUpdateWorkerRoleList,
        deleteworkerRoleList,
        setDeleteWorkerRoleList
    } = props

    // Combine lists with a source flag
    const combinedList = [
        ...(workerRoleList || []).map((item, index) => ({
            ...item,
            index,
            source: 'new'
        })),
        ...(updateworkerRoleList || []).map((item, index) => ({
            ...item,
            index,
            source: 'update'
        }))
    ];


    return (
        <>
            {combinedList.length > 0 && (
                <View>
                    {combinedList.map((item, combinedIndex) => (
                        <View
                            key={`${item.name}-${combinedIndex}`}
                            style={[
                                Styles.tableListItem,
                                item?.source === 'new' ? { backgroundColor: '#cbf5dd' } : {}
                            ]}
                        >
                            <Text
                                style={[Styles.tableCell, { flex: 3 }]}
                                numberOfLines={1}
                                ellipsizeMode="middle"
                            >
                                {item.name}
                            </Text>
                            <Text style={Styles.tableCell}>₹{parseFloat(item.salaryPerShift).toLocaleString('en-IN')}</Text>
                            <Text style={Styles.tableCell}>{item.hoursPerShift}</Text>
                            <View style={Styles.tableActions}>
                                <IconButton
                                    iconType="MaterialIcons"
                                    name="edit"
                                    size={20}
                                    color={Colors.secondaryColor}
                                    onPress={() => handleEdit(item.index, item)}
                                    disabled={!canEdit("Worker Category")}
                                />
                                <IconButton
                                    iconType="MaterialIcons"
                                    name="delete"
                                    size={20}
                                    color={Colors.dangerColor}
                                    onPress={() => handleDelete(item.index, item.source, item)}
                                    disabled={!canEdit("Worker Category")}
                                />
                            </View>
                        </View>
                    ))}

                    <CustomBottomSheet
                        ref={workerRoleBottomSheetRef}
                        title={t("Edit Worker Role")}
                        onClose={() => workerRoleBottomSheetRef.current?.close()}
                    >
                        {selectedItem && (
                            <WorkerRoleEditForm
                                workerRoleList={workerRoleList}
                                setWorkerRoleList={setWorkerRoleList}
                                updateworkerRoleList={updateworkerRoleList}
                                setUpdateWorkerRoleList={setUpdateWorkerRoleList}
                                deleteworkerRoleList={deleteworkerRoleList}
                                setDeleteWorkerRoleList={setDeleteWorkerRoleList}
                                selectedItem={selectedItem}
                                bottomSheetRef={workerRoleBottomSheetRef}
                            />
                        )}
                    </CustomBottomSheet>
                </View>
            )}
        </>
    );
};

export default WorkerRoleList;

