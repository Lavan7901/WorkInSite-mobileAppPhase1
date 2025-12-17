import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "../../../utils/VectorIcons";
import { useTheme } from "../../../context/ThemeContext";

type Props = {
    totalWorkers: number;
    totalAmount: number;
};

const StatsCard: React.FC<Props> = ({ totalWorkers, totalAmount }) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.statsContainer, { borderColor: theme.primaryColor, backgroundColor: theme.primaryColor + "10" }]}>
            {/* Workers */}
            <View style={styles.statItem}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primaryColor }]}>
                    <Icon icon="MaterialCommunityIcons" name="account-group" size={22} color="#fff" />
                </View>
                <View style={styles.statContent}>
                    <Text style={styles.statValue}>{totalWorkers}</Text>
                    <Text style={styles.statLabel}>Workers</Text>
                </View>
            </View>

            {/* Divider */}
            <View style={styles.statDivider} />

            {/* Amount */}
            <View style={styles.statItem}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primaryColor }]}>
                    <Text style={styles.rupeeIcon}>₹</Text>
                </View>
                <View style={styles.statContent}>
                    <Text style={styles.statValue}>₹{parseFloat(totalAmount.toString()).toLocaleString('en-IN')}</Text>
                    <Text style={styles.statLabel}>Amount</Text>
                </View>
            </View>
        </View>
    );
};

export default StatsCard;

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: "row",
        marginHorizontal: 16,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
    },
    statItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    statContent: {
        flex: 1,
        justifyContent: "center",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
    },
    statLabel: {
        fontSize: 13,
        fontWeight: "500",
        color: "#777",
    },
    statDivider: {
        width: 1,
        backgroundColor: "rgba(0,0,0,0.1)",
        marginHorizontal: 12,
    },
    rupeeIcon: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
    },
});
