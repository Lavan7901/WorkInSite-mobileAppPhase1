import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    BackHandler,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
} from "react-native";
import Header from "../../../components/CommonComponets/Header/Header";
import SearchComponent from "../../../components/CommonComponets/Search/Search";
import CustomBottomSheet from "../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet";
import { Combo } from "../../../components/CommonComponets/Combo/Combo";
import { useLanguage } from "../../../context/LanguageContext";
import Button from "../../../components/CommonComponets/Button/Button";
import Loader from "../../../components/Loader/Loader";
import StatsCard from "./StatsCard";
import DateFilter from "./DateFilter";
import commonStyle from "../../../styles/commonStyle";
import Style from "../../../styles/cardListStyle";
import { useWorkerReportScreen } from "./useWorkerReportScreen";
import WorkerReportCard from "../../../components/Card/WorkerReportCard";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useTheme } from "../../../context/ThemeContext";

type WorkerReport = {
    workerId: number;
    workerName: string;
    workerCategoryName: string;
    amount: string;
};

const WorkerReportScreen = ({ navigation }: any) => {
    const { t } = useLanguage();
    const { theme } = useTheme();

    const {
        workerReport,
        loading,
        refreshing,
        site,
        worker,
        dateRange,
        bottomSheetRef,
        selectedOption,
        error,
        siteDetails,
        workerDetails,
        totalAmount,
        totalWorkers,
        paginationLoading,
        hasMore,
        appliedFilters,
        setSite,
        setWorker,
        setDateRange,
        setSelectedOption,
        fetchSites,
        fetchWorkers,
        handleBack,
        handleRefresh,
        handleSearch,
        handleClearSearch,
        handleViewDetails,
        fetchWorkerReports
    } = useWorkerReportScreen({ navigation });

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                handleBack();
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [handleBack])
    );


    const renderItem = ({ item }: { item: WorkerReport }) => (
        <WorkerReportCard workerName={item.workerName}
            onPress={() => handleViewDetails(item.workerId)}
            workerId={item.workerId}
            workerCategoryName={item.workerCategoryName}
            amount={item.amount} />
    );

    const renderEmptyState = () => (
        <View style={Style.emptyContainer}>
            <Text style={Style.emptyText}>No Data Found</Text>
        </View>
    );

    if (loading && !refreshing) return <Loader />;

    return (
        <SafeAreaView style={commonStyle.container}>
            <Header title="Worker Report" onBackPress={handleBack} enableHome={false} />
            <SearchComponent
                onSearch={() => bottomSheetRef.current.open()}
                setSearch={appliedFilters || "Search"}
                onClear={handleClearSearch}
            />
            <StatsCard totalWorkers={totalWorkers} totalAmount={totalAmount} />
            <FlatList
                keyboardShouldPersistTaps="handled"
                data={workerReport}
                renderItem={renderItem}
                keyExtractor={(item) => item.workerId.toString()}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={
                    workerReport.length === 0 ? commonStyle.flex : Style.listTopSpace
                }
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListFooterComponent={() => {
                    if (!hasMore) return null;
                    return (
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 10, paddingHorizontal: 16 }}>
                            {paginationLoading ? (
                                <Loader size="small" />
                            ) : (
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 8,
                                        paddingHorizontal: 14,
                                        backgroundColor: theme.primaryColor,
                                        borderRadius: 8,
                                    }}
                                    onPress={() => fetchWorkerReports()}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('View More')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            />

            <CustomBottomSheet
                title="Filter Worker Reports"
                ref={bottomSheetRef}
                onClose={() => bottomSheetRef?.current?.close()}
            >
                <ScrollView keyboardShouldPersistTaps="handled" style={commonStyle.customSheetInputfieldSpacer}>
                    <Combo
                        label={t("Site")}
                        items={siteDetails}
                        selectedValue={site.value}
                        onValueChange={setSite}
                        onSearch={fetchSites}
                        returnFullObject={true}
                    />
                    <Combo
                        label={t("Worker")}
                        items={workerDetails}
                        selectedValue={worker.value}
                        onValueChange={setWorker}
                        onSearch={fetchWorkers}
                        returnFullObject={true}
                    />
                    <DateFilter
                        label={"Select Date Range"}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        onChange={(from, to) => setDateRange({ from, to })}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        required
                        errorMessage={error.fromDate || error.toDate}
                    />

                    <Button title="Search" onPress={handleSearch} />
                </ScrollView>
            </CustomBottomSheet>
        </SafeAreaView>
    );
};

export default WorkerReportScreen;