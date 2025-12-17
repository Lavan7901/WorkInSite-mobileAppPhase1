import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loader from '../../../components/Loader/Loader';
import Button from '../../../components/CommonComponets/Button/Button';
import Header from '../../../components/CommonComponets/Header/Header';
import { usePageRole } from './usePageRole';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

type RoleLevel = {
  label: string;
  value: number;
  icon: string;
  color: string;
};

const ROLE_LEVELS: RoleLevel[] = [
  { label: 'No Rights', value: 0, icon: 'block', color: '#EF4444' },
  { label: 'View', value: 1, icon: 'visibility', color: '#F59E0B' },
  { label: 'Edit', value: 2, icon: 'edit', color: '#10B981' },
];

interface PageRoleProps {
  route: any;
  navigation: any;
}

const PageRole: React.FC<PageRoleProps> = ({ route, navigation }) => {

  const {
    role,
    pages,
    pageRights,
    loading,
    refreshing,
    handleRefresh,
    handleSelectRight,
    handleSave,
    getDisabledLevels,
    handleBackPress
  } = usePageRole({ navigation, route });

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={`${role.name} Rights`} onBackPress={handleBackPress} />
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={pages}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item: page }) => {
          const disabledLevels = getDisabledLevels(page);

          return (
            <View style={styles.pageCard}>
              <Text style={styles.pageName}>{page.name}</Text>

              <View style={styles.rightOptions}>
                {ROLE_LEVELS.map(level => {
                  const isSelected = pageRights[page.id] === level.value;
                  const isDisabled = disabledLevels.includes(level.value);

                  return (
                    <TouchableOpacity
                      key={level.value}
                      style={[
                        styles.rightButton,
                        isSelected && [
                          styles.selectedButton,
                          { backgroundColor: level.color },
                        ],
                        isDisabled && styles.disabledButton,
                      ]}
                      onPress={() =>
                        !isDisabled && handleSelectRight(page.id, level.value)
                      }
                      activeOpacity={isDisabled ? 1 : 0.7}
                      disabled={isDisabled}
                    >
                      <Icon
                        name={level.icon}
                        size={16}
                        color={
                          isDisabled
                            ? '#D1D5DB'
                            : isSelected
                              ? '#fff'
                              : '#6B7280'
                        }
                        style={styles.iconStyle}
                      />
                      <Text
                        style={[
                          styles.rightText,
                          isSelected && styles.selectedText,
                          isDisabled && styles.disabledText,
                        ]}
                      >
                        {level.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        }}
      />

      <View style={styles.footer}>
        <Button title="Save Rights" onPress={handleSave} />
      </View>
    </View>
  );
};

export default PageRole;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: 12, paddingBottom: 120 },
  pageCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 3,
  },
  pageName: { fontSize: 15, fontWeight: '600', marginBottom: 10 },
  rightOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  rightButton: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 11,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  selectedButton: { borderWidth: 0 },
  rightText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
  selectedText: { color: '#fff', fontWeight: '700' },
  disabledButton: { opacity: 0.5 },
  disabledText: { color: '#9CA3AF' },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  iconStyle: {
    marginRight: 5,
  },
});
