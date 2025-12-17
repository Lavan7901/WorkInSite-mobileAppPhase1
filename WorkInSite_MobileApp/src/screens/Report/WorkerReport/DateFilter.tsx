import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getWeekRange } from "../../../utils/functions";
import DatePicker from "../../../components/CommonComponets/DatePicker/DatePicker";
import componentStyle from "../../../styles/componentStyle";
import { useTheme } from "../../../context/ThemeContext";

type Props = {
    label: string;
    dateRange: { from: string; to: string };
    setDateRange: React.Dispatch<React.SetStateAction<{ from: string; to: string }>>;
    onChange: (fromDate: string, toDate: string) => void;
    selectedOption: "lastWeek" | "currentWeek" | "custom";
    setSelectedOption: React.Dispatch<
        React.SetStateAction<"lastWeek" | "currentWeek" | "custom">
    >;
    errorMessage?: string;
    required?: boolean;
};

const DateFilter: React.FC<Props> = ({
    label,
    onChange,
    dateRange,
    setDateRange,
    selectedOption,
    setSelectedOption,
    errorMessage,
    required = false,
}) => {
    const { theme } = useTheme();

    useEffect(() => {
        if (selectedOption === "currentWeek" && !dateRange.from && !dateRange.to) {
            const { from, to } = getWeekRange("currentWeek");
            setDateRange({ from: from, to: to });
            onChange(from, to);
        }
    }, [selectedOption]);


    const handleOptionSelect = (option: "lastWeek" | "currentWeek" | "custom") => {
        setSelectedOption(option);

        if (option === "lastWeek" || option === "currentWeek") {
            const { from, to } = getWeekRange(option);
            setDateRange({ from: from, to: to });
            onChange(from, to);
        } else {
            setDateRange({ from: "", to: "" });
        }
    };

    const handleFromDateChange = (date: string) => {
        setDateRange((prev) => ({ ...prev, from: date }));
        if (date && dateRange.to) {
            onChange(date, dateRange.to);
        }
    };

    const handleToDateChange = (date: string) => {
        setDateRange((prev) => ({ ...prev, to: date }));
        if (dateRange.from && date) {
            onChange(dateRange.from, date);
        }
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text style={componentStyle.label}>
                    {label}
                    {required && <Text style={componentStyle.requiredAsterisk}> *</Text>}
                </Text>
            )}

            {/* Quick Options */}
            <View style={styles.optionsRow}>
                {["lastWeek", "currentWeek", "custom"].map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.option,
                            selectedOption === option && {
                                backgroundColor: theme.primaryColor,
                                borderColor: theme.primaryColor,
                            },
                        ]}
                        onPress={() =>
                            handleOptionSelect(option as "lastWeek" | "currentWeek" | "custom")
                        }
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedOption === option && styles.activeOptionText,
                            ]}
                        >
                            {option === "lastWeek"
                                ? "Last Week"
                                : option === "currentWeek"
                                    ? "Current Week"
                                    : "Custom"}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Custom Date Picker */}
            {selectedOption === "custom" && (
                <View style={styles.dateRow}>
                    <View style={styles.dateColumn}>
                        <DatePicker
                            date={dateRange.from}
                            onDateChange={handleFromDateChange}
                            label="From Date"
                        />
                    </View>
                    <View style={styles.dateColumn}>
                        <DatePicker
                            date={dateRange.to}
                            onDateChange={handleToDateChange}
                            label="To Date"
                        />
                    </View>
                </View>
            )}

            {/* Selected range display */}
            {selectedOption !== "custom" && selectedOption && (
                <View
                    style={[
                        styles.selectedRangeContainer,
                        { backgroundColor: theme.primaryColor + "10" },
                    ]}
                >
                    <Text
                        style={[
                            styles.selectedRangeText,
                            { color: theme.secondaryColor },
                        ]}
                    >
                        {dateRange.from && dateRange.to
                            ? `${dateRange.from} - ${dateRange.to}`
                            : "Date range will appear here"}
                    </Text>
                </View>
            )}

            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>
    );
};

export default DateFilter;

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    optionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    option: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#ccc",
        alignItems: "center",
    },
    optionText: {
        color: "#000",
        fontWeight: "600",
    },
    activeOptionText: {
        color: "#fff",
    },
    dateRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    dateColumn: {
        flex: 1,
        marginHorizontal: 4,
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginTop: 6,
    },
    selectedRangeContainer: {
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    selectedRangeText: {
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
    },
});
