import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomAvatar from '../../../screens/ProfileScreen/CustomAvatar';
import { Colors } from '../../../utils';
import { useTheme } from '../../../context/ThemeContext';
import { Roles } from './DTOs';

interface RoleCardProps {
    role: Roles;
    onEdit: (role: Roles) => void;
    onDelete: (id: number) => void;
    handlePress: (role: Roles) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
    role,
    onEdit,
    onDelete,
    handlePress,
}) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handlePress(role)}
            activeOpacity={0.7}
        >
            <View style={styles.roleInfo}>
                <CustomAvatar
                    size={36}
                    name={role.name}
                    backgroundColor={theme.primaryColor}
                    textColor={theme.secondaryColor}
                />
                <Text style={styles.roleName}>{role.name}</Text>
            </View>

            <View style={styles.actionGroup}>
                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => onEdit(role)}
                    activeOpacity={0.6}
                >
                    <Icon name="edit" size={18} color={theme.secondaryColor} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => onDelete(role.id)}
                    activeOpacity={0.6}
                >
                    <Icon name="delete-outline" size={18} color={Colors.dangerColor} />
                </TouchableOpacity>
                <Icon
                    name="chevron-right"
                    size={24}
                    color="#9CA3AF"
                    style={styles.navIcon}
                />
            </View>
        </TouchableOpacity>
    );
};

export default RoleCard;

const styles = StyleSheet.create({
    roleCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    roleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    roleName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    actionGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    iconBtn: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navIcon: {
        marginLeft: 6,
    },
});
