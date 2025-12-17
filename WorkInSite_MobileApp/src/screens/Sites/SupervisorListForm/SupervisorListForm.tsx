import React from "react";
import { View, Text, Alert, Linking } from "react-native";
import { Colors } from "../../../utils";
import commonStyle from "../../../styles/commonStyle";
import { useTheme } from "../../../context/ThemeContext";
import { getCreateAndEditScreenStyles } from "../../../styles/CreateAndEditScreenStyle";
import { useLanguage } from "../../../context/LanguageContext";
import { User } from "../../Users/DTOs/User";
import { usePermission } from "../../../hook/usePermission";
import IconButton from "../../../components/CommonComponets/IconButton/IconButton";

interface Props {
  supervisors: User[];
  setSupervisors: React.Dispatch<React.SetStateAction<User[]>>;
}

const SupervisorListForm: React.FC<Props> = ({ supervisors, setSupervisors }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const Style = getCreateAndEditScreenStyles(theme);
  const { canEdit } = usePermission()
  const editable = canEdit("Sites")

  const handlePhoneCall = (phone?: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`).catch(err => console.error("Call failed", err));
  };

  const onDelete = (id: number) => {
    Alert.alert(
      t("Confirm Delete"),
      t("Are you sure you want to remove this supervisor?"),
      [
        { text: t("Cancel"), style: "cancel" },
        {
          text: t("Delete"),
          style: "destructive",
          onPress: () => setSupervisors(prev => prev.filter(s => s.id !== id)),
        },
      ],
    );
  };

  return (
    <>
      {supervisors?.map(s => (
        <View key={s.id} style={Style.spaceContainer}>
          <View style={commonStyle.header}>
            <View style={Style.badge}>
              <Text style={Style.badgeText}>{s.name?.[0] ?? ""}</Text>
            </View>
            <Text>
              {s.name} {s.role?.name ? `(${s.role?.name})` : ""}
            </Text>
          </View>

          <View style={Style.iconContainer}>
            <IconButton
              iconType="MaterialCommunityIcons"
              name="phone"
              size={24}
              color={theme.secondaryColor}
              onPress={() => handlePhoneCall(s.phone)}
            />
            <IconButton
              iconType="MaterialCommunityIcons"
              name="delete"
              size={26}
              color={Colors.dangerColor}
              onPress={() => onDelete(s.id)}
              disabled={!editable}
            />
          </View>
        </View>
      ))}
    </>
  );
};

export { SupervisorListForm };
