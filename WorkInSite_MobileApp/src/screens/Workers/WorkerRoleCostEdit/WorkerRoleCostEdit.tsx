import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    BackHandler,
} from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import Header from '../../../components/CommonComponets/Header/Header';
import { Colors } from '../../../utils';
import { useTheme } from '../../../context/ThemeContext';
import Icon from '../../../utils/VectorIcons';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import { Input } from '../../../components/CommonComponets';
import { numberRegex } from '../../../utils/regex';
import Button from '../../../components/CommonComponets/Button/Button';
import Loader from '../../../components/Loader/Loader';
import { useWorkerRoleCostEdit } from './useWorkerRoleCostEdit';
import { WorkerRoles } from '../DTOs/WorkerRoleProps';
import { WorkerRoleCostEditRouteParams } from './DTOs';
import commonStyle from '../../../styles/commonStyle';
import Styles from '../../../styles/ListScreenStyle';
import Style from '../../../styles/cardListStyle';
import { usePermission } from '../../../hook/usePermission';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

const WorkerRoleCostEdit = ({ navigation }: any) => {
    const route = useRoute<RouteProp<Record<string, WorkerRoleCostEditRouteParams>, string>>();
    const { redirect, id } = route.params;
    const { theme } = useTheme();
    const { canEdit } = usePermission()
    const editable = canEdit("Worker")
    const {
        bottomSheetRef, costs, setEditingCost, error, editingCost, handleEdit, handleSave, loading, handleBack
    } = useWorkerRoleCostEdit({ navigation });

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.navigate(redirect, { id });
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    if (loading) return <Loader />

    const renderItem = ({ item, index }: { item: WorkerRoles; index: number }) => {
        return (
            <View key={index} style={[Styles.card, { padding: 16 }]}>
                {/* Header Section */}
                <View style={Style.cardHeader}>
                    <View style={[Style.avatarContainer, { backgroundColor: theme.secondaryColor + '15' }]}>
                        <Icon
                            icon="MaterialCommunityIcons"
                            name="account-hard-hat"
                            size={24}
                            color={theme.secondaryColor}
                        />
                    </View>
                    <View style={commonStyle.flex}>
                        <Text style={Style.roleLabel}>Worker Role</Text>
                        <Text style={[Style.roleName, { color: theme.secondaryColor }]} numberOfLines={1}>
                            {item.name}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[Style.editButton, { borderColor: theme.secondaryColor + '30', opacity: !editable ? 0.6 : 1 }]}
                        onPress={() => {
                            handleEdit(item);
                            bottomSheetRef.current.open();
                        }}
                        activeOpacity={0.7}
                        disabled={!editable}
                    >
                        <Icon
                            icon="MaterialIcons"
                            name="mode-edit"
                            size={20}
                            color={theme.secondaryColor}
                        />
                    </TouchableOpacity>
                </View>

                {/* Content Section */}
                <View style={Style.cardContent}>
                    <View style={Style.infoRow}>
                        <View style={Style.infoItem}>
                            <View style={Style.cirleInfoIcon}>
                                <Icon
                                    icon="MaterialIcons"
                                    name="money"
                                    size={18}
                                    color={'#4CAF50'}
                                />
                            </View>
                            <View style={commonStyle.flex}>
                                <Text style={Style.infoLabel}>Salary per shift</Text>
                                <Text style={[Style.roleName, { color: Colors.successColor }]}>₹{parseFloat(item.salaryPerShift.toString()).toLocaleString('en-IN')}</Text>
                            </View>
                        </View>

                        <View style={Style.divider} />

                        <View style={Style.infoItem}>
                            <View style={Style.cirleInfoIcon}>
                                <Icon
                                    icon="MaterialIcons"
                                    name="schedule"
                                    size={18}
                                    color={'#2196F3'}
                                />
                            </View>
                            <View style={commonStyle.flex}>
                                <Text style={Style.infoLabel}>Hours per shift</Text>
                                <Text style={[Style.roleName, { color: theme.secondaryColor }]}>{item.hoursPerShift}h</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderEmptyState = () => (
        <View style={Style.emptyContainer}>
            <Icon
                icon="MaterialCommunityIcons"
                name="account-off"
                size={64}
                color={Colors.lightGray}
            />
            <Text style={Style.emptyText}>No worker roles found</Text>
            <Text style={Style.emptySubtext}>Worker role costs will appear here once added</Text>
        </View>
    );

    return (
        <View style={commonStyle.container}>
            <View style={{ zIndex: 9 }}>
                <ToastNotification />
            </View>
            <Header title="Edit Worker Role Costs" onBackPress={handleBack} />

            <View style={Style.content}>
                <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={costs}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={renderEmptyState}
                    contentContainerStyle={costs.length === 0 ? Style.emptyList : Style.list}
                    showsVerticalScrollIndicator={false}

                />
            </View>

            <CustomBottomSheet
                title="Edit Worker Role Cost"
                ref={bottomSheetRef}
                onClose={() => bottomSheetRef.current.close()}
            >
                <View style={commonStyle.customSheetInputfieldSpacer}>
                    <Input
                        value={editingCost.name}
                        onChangeText={(text) =>
                            setEditingCost((prev) => ({ ...prev, name: text }))
                        }
                        errorMessage={error.name}
                        placeholder="Name"
                        title="Name"
                        disabled={true}
                    />
                    <Input
                        value={editingCost.salaryPerShift}
                        onChangeText={(text) =>
                            setEditingCost((prev) => ({ ...prev, salaryPerShift: text }))
                        }
                        errorMessage={error.salaryPerShift}
                        inputType="numeric"
                        placeholder="Salary Per Shift"
                        title="Salary Per Shift"
                        regex={numberRegex}
                        required
                    />

                    <Input
                        value={editingCost.hoursPerShift}
                        onChangeText={(text) =>
                            setEditingCost((prev) => ({ ...prev, hoursPerShift: text }))
                        }
                        errorMessage={error.hoursPerShift}
                        inputType="numeric"
                        placeholder="Hours Per Shift"
                        title="Hours Per Shift"
                        regex={numberRegex}
                        required
                    />
                    <Button title="Save" onPress={handleSave} />
                </View>
            </CustomBottomSheet>
        </View>
    );
};

export default WorkerRoleCostEdit;