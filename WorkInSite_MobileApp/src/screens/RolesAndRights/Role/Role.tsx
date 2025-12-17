import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/CommonComponets/Header/Header';
import { FormActionButton } from '../../../components/CommonComponets/FormActionButton/FormActionButton';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import Loader from '../../../components/Loader/Loader';
import { Input } from '../../../components/CommonComponets';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import Button from '../../../components/CommonComponets/Button/Button';
import { useTheme } from '../../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { nameRegex } from '../../../utils/regex';
import { useRolesScreen } from './useRole';
import RouteName from '../../../navigation/RouteName';
import RoleCard from './RoleCard';
import { Roles } from './DTOs';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

const EmptyState = () => (
  <View style={styles.emptyState}>
    <Icon name="security" size={48} color="#9CA3AF" />
    <Text style={styles.emptyTitle}>No Roles Yet</Text>
    <Text style={styles.emptySubtitle}>Create your first role to get started</Text>
  </View>
);

const RolesScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const {
    roles,
    isLoading,
    name,
    note,
    editId,
    bottomSheetRef,
    handleRefresh,
    refreshing,
    handleSaveRole,
    handleEditRole,
    handleDeleteRole,
    handleBackPress,
    resetForm,
    setName,
    setNote,
  } = useRolesScreen({ navigation });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [handleBackPress])
  );

  const handlePageRoleOpen = (role: Roles) =>
    navigation.navigate(RouteName.PAGE_ROLE_SCREEN, { role });

  if (isLoading) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title="Roles & Rights" onBackPress={handleBackPress} enableHome={false} />
      <View style={styles.wrapper}>
        <FormActionButton
          heading="Create New Role"
          iconType="plus-circle"
          onClick={() => {
            resetForm();
            bottomSheetRef.current?.open();
          }}
        />

        <CustomBottomSheet
          ref={bottomSheetRef}
          title={editId ? 'Edit Role' : 'Create New Role'}
          height={300}
          onClose={() => bottomSheetRef.current.close()}
        >
          <View style={styles.bottomSheetContent}>
            <Input
              title="Name"
              placeholder="Enter Role Name"
              value={name}
              onChangeText={setName}
              regex={nameRegex}
              maxLength={50}
              required
            />
            <Textarea
              label="Note"
              placeholder="Enter Note (optional)"
              value={note}
              onChange={setNote}
            />
            <Button
              title={editId ? 'Update Role' : 'Create Role'}
              onPress={handleSaveRole}
            />
          </View>
        </CustomBottomSheet>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Existing Roles</Text>
          <View style={[styles.roleCount, { backgroundColor: theme.primaryColor }]}>
            <Text style={styles.countText}>{roles.length}</Text>
          </View>
        </View>

        {roles.length > 0 ? (
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={roles}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <RoleCard
                role={item}
                onEdit={handleEditRole}
                onDelete={handleDeleteRole}
                handlePress={handlePageRoleOpen}
              />
            )}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
        ) : (
          <EmptyState />
        )}
      </View>
    </View>
  );
};

export default RolesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  wrapper: { flex: 1, paddingHorizontal: 12, paddingVertical: 10 },
  bottomSheetContent: { gap: 12, paddingBottom: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  roleCount: {
    minWidth: 40,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  listContent: { paddingVertical: 12, paddingHorizontal: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginTop: 8 },
  emptySubtitle: { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
});
