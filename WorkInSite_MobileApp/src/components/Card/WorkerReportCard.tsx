import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { getCardStyle } from "../../styles/cardStyle";
import Icon from "../../utils/VectorIcons";
import { Colors } from "../../utils";

type WorkerReportCardProps = {
    workerId: number;
    workerName: string;
    workerCategoryName: string;
    amount: string;
    onPress: () => void;
};

const WorkerReportCard: React.FC<WorkerReportCardProps> = ({ workerName, workerCategoryName, amount, onPress }) => {
    const { theme } = useTheme();
    const Style = getCardStyle(theme);

    return (
        <TouchableOpacity
            style={[Style.cardContainer, Style.cardRow]}
            activeOpacity={0.8}
            onPress={onPress}
        >
            {/* Avatar / Icon */}
            <View style={[
                Style.cardAvatarIconContainer,
                { backgroundColor: theme.secondaryColor + "15" },
            ]}>
                <Icon
                    icon="MaterialCommunityIcons"
                    name="account-hard-hat"
                    size={26}
                    color={theme.secondaryColor}
                />
            </View>

            {/* Main Content */}
            <View style={Style.cardFlex}>
                {/* Header: Name + Amount */}
                <View style={Style.cardSpaceBetweenContent}>
                    <Text style={Style.cardTitle} numberOfLines={1}>
                        {workerName}
                    </Text>

                    <View style={[Style.cardDetailItemCircle, { backgroundColor: Colors.paymentLightGreen + "10" }]}>
                        <Text style={[Style.cardAmountText, { color: Colors.paymentGreen }]}>
                            ₹{parseFloat(amount).toLocaleString('en-IN')}
                        </Text>
                    </View>
                </View>

                {/* Category */}
                <View style={[Style.cardRowContent]}>
                    <Icon icon="MaterialIcons" name="category" size={14} color={Colors.grayColor} />
                    <Text style={[Style.cardText]}>
                        {workerCategoryName}
                    </Text>
                </View>
            </View>

            {/* Action Icon */}
            <View style={[Style.cardIconCircle]}>
                <Icon icon="MaterialIcons" name="chevron-right" size={22} color={Colors.grayColor} />
            </View>
        </TouchableOpacity>
    );
};

export default WorkerReportCard;
