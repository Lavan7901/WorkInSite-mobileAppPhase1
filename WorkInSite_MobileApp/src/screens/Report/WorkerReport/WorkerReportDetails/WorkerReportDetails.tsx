import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from "react-native";
import Header from "../../../../components/CommonComponets/Header/Header";
import { useTheme } from "../../../../context/ThemeContext";
import Loader from "../../../../components/Loader/Loader";
import Icon from "../../../../utils/VectorIcons";
import { useWorkerReportDetails } from "./useWorkerReportDetails";

const WorkerReportDetails = ({ navigation, route }: any) => {
    const { theme } = useTheme();
    const {
        loading,
        report,
        totalAmount,
        handleAttendanceOpen,
        handleWorkerOpen,
        handleBack,
        refreshing,
        handleRefresh,
    } = useWorkerReportDetails({ navigation, route });

    if (loading) return <Loader />;

    const hasItems = report?.items.length;
    const firstItem = report?.items[0];

    const renderRecord = ({ item, index }: any) => (
        <TouchableOpacity
            key={item.attendanceId}
            style={[styles.listItem, index === 0 && styles.firstItem]}
            onPress={() => handleAttendanceOpen(item.attendanceId)}
            activeOpacity={0.7}
        >
            <View style={styles.flex}>
                <View style={styles.dateRow}>
                    <View style={[styles.smallIcon, { backgroundColor: theme.secondaryColor + "10" }]}>
                        <Icon icon="FontAwesome" name="calendar" size={14} color={theme.secondaryColor} />
                    </View>
                    <Text style={[styles.date, { color: theme.secondaryColor }]}>
                        {item.date}
                    </Text>
                </View>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {item.siteName}
                </Text>
            </View>

            <View style={styles.rightAlign}>
                <View style={styles.amountBadge}>
                    <Text style={styles.amountText}>
                        ₹{parseFloat(item.amount).toLocaleString('en-IN')}
                    </Text>
                </View>
                <Icon icon="FontAwesome" name="chevron-right" size={12} color="#cbd5e0" style={styles.ml8} />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header title="Worker Report Details" onBackPress={handleBack} />

            <View style={styles.content}>
                {hasItems ? (
                    <>
                        {/* Summary Cards */}
                        <View style={styles.row}>
                            <View style={[styles.card, styles.borderBlue]}>
                                <View style={[styles.iconCircle, styles.bgBlue]}>
                                    <Icon icon="FontAwesome" name="list-ul" size={18} color="#3b82f6" />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.label}>Total Records</Text>
                                    <Text style={styles.value}>{report.totalCount}</Text>
                                </View>
                            </View>

                            <View style={[styles.card, styles.borderGreen]}>
                                <View style={[styles.iconCircle, styles.bgGreen]}>
                                    <Icon icon="FontAwesome" name="rupee" size={18} color="#16a34a" />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.label}>Total Amount</Text>
                                    <Text style={[styles.value, styles.green]}>
                                        ₹{totalAmount.toLocaleString('en-IN')}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Worker Card */}
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => firstItem?.workerId && handleWorkerOpen(firstItem.workerId)}
                            activeOpacity={0.7}
                            disabled={!firstItem?.workerId}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: theme.secondaryColor + "15" }]}>
                                <Icon icon="MaterialCommunityIcons" name="account-hard-hat" size={16} color={theme.secondaryColor} />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.label}>{firstItem?.workerCategoryName ?? "N/A"}</Text>
                                <Text style={[styles.value, { color: theme.secondaryColor }]} numberOfLines={1}>
                                    {firstItem?.workerName ?? "N/A"}
                                </Text>
                            </View>
                            <Icon icon="FontAwesome" name="chevron-right" size={14} color="#cbd5e0" />
                        </TouchableOpacity>

                        {/* Records List */}
                        <Text style={styles.sectionTitle}>Records :</Text>

                        <FlatList
                            data={report.items}
                            keyExtractor={(item) => item.attendanceId.toString()}
                            renderItem={renderRecord}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    </>
                ) : (
                    <View style={styles.empty}>
                        <View style={styles.emptyIcon}>
                            <Icon icon="FontAwesome" name="file-text-o" size={48} color="#94a3b8" />
                        </View>
                        <Text style={styles.emptyTitle}>No Report Details Found</Text>
                        <Text style={styles.emptyText}>
                            Attendance records will appear here once available
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default WorkerReportDetails;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8fafc" },
    content: { flex: 1, padding: 16 },
    row: { flexDirection: "row", gap: 12, marginBottom: 12 },
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
        marginBottom: 12,
    },
    borderBlue: { flex: 1, borderLeftWidth: 3, borderLeftColor: "#3b82f6" },
    borderGreen: { flex: 1, borderLeftWidth: 3, borderLeftColor: "#16a34a" },
    iconCircle: {
        width: 40, height: 40, borderRadius: 10,
        alignItems: "center", justifyContent: "center", marginRight: 10,
    },
    bgBlue: { backgroundColor: "#dbeafe" },
    bgGreen: { backgroundColor: "#dcfce7" },
    cardContent: { flex: 1 },
    label: { fontSize: 12, color: "#64748b", fontWeight: "500" },
    value: { fontSize: 16, fontWeight: "600", color: "#1e293b" },
    green: { color: "#16a34a" },
    sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b", marginBottom: 12 },
    scrollContent: { paddingBottom: 20 },
    listItem: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", padding: 16, marginBottom: 8,
        borderRadius: 14, backgroundColor: "#fff",
        borderWidth: 1, borderColor: "#f1f5f9",
    },
    firstItem: { borderColor: "#e0e7ff", backgroundColor: "#fafbff" },
    flex: { flex: 1, marginRight: 12 },
    dateRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
    smallIcon: {
        width: 26, height: 26, borderRadius: 6,
        alignItems: "center", justifyContent: "center", marginRight: 8,
    },
    date: { fontSize: 15, fontWeight: "600" },
    subtitle: { fontSize: 13, color: "#64748b", fontWeight: "500", marginLeft: 34 },
    rightAlign: { flexDirection: "row", alignItems: "center" },
    amountBadge: {
        backgroundColor: "#f0fdf4", paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 8, borderWidth: 1, borderColor: "#bbf7d0",
    },
    amountText: { fontSize: 15, fontWeight: "700", color: "#15803d" },
    ml8: { marginLeft: 8 },
    empty: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 },
    emptyIcon: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center",
        marginBottom: 20,
    },
    emptyTitle: { fontSize: 18, fontWeight: "700", color: "#334155", marginBottom: 8 },
    emptyText: { fontSize: 14, color: "#94a3b8", textAlign: "center", lineHeight: 20 },
});
