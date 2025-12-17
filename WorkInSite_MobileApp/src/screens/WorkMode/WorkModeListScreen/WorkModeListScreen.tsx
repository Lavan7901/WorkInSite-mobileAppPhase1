import React from "react";
import { View, Text, FlatList } from "react-native";
import IconButton from "../../../components/CommonComponets/IconButton/IconButton";
import commonStyle from "../../../styles/commonStyle";
import Styles from "../../../styles/ListScreenStyle";
import { Colors } from "../../../utils";
import { WorkModeListProps } from "../DTOs/WorkModeDetails";
import { useTheme } from "../../../context/ThemeContext";
import { getCreateAndEditScreenStyles } from "../../../styles/CreateAndEditScreenStyle";
import { usePermission } from "../../../hook/usePermission";

const WorkModeListScreen = ({
  workModeDetails,
  handleWorkModeDelete,
  handleWorkModeEdit,
  editingWorkModeId,
  refreshing,
  handleRefresh
}: WorkModeListProps) => {

  const { theme } = useTheme();
  const Style = getCreateAndEditScreenStyles(theme);
  const { canEdit } = usePermission();
  const editable = canEdit("Work Mode")

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1 }}
      data={workModeDetails}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      renderItem={({ item }) => {
        const isEditing = item.id === editingWorkModeId;

        return (
          <View
            style={[
              Styles.card,
              Style.spaceContainer,
              {
                paddingHorizontal: 15,
                paddingVertical: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                backgroundColor: isEditing ? Colors.lightGray : "white",
                opacity: isEditing ? 0.5 : 1,
              },
            ]}
          >
            <Text
              style={[
                commonStyle.labelText,
                { color: isEditing ? Colors.grayColor : Colors.black },
              ]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {item.name}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <IconButton
                iconType="MaterialIcons"
                name="edit"
                color={isEditing ? Colors.grayColor : theme.secondaryColor}
                disabled={isEditing || !editable}
                onPress={() => handleWorkModeEdit(item)}
                style={{ marginRight: 10 }}
              />
              <IconButton
                iconType="MaterialIcons"
                name="delete"
                color={isEditing ? Colors.grayColor : Colors.dangerColor}
                disabled={isEditing || !editable}
                onPress={() => handleWorkModeDelete(item.id)}
              />
            </View>
          </View>
        );
      }}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      ListEmptyComponent={
        <View style={{ alignItems: "center", marginTop: 30 }}>
          <Text style={{ fontSize: 16, color: Colors.grayColor }}>
            No Work Modes Available
          </Text>
          <Text style={{ fontSize: 14, color: Colors.grayColor }}>
            Add a new Work Mode to get started.
          </Text>
        </View>
      }
    />
  );
};

export default WorkModeListScreen;
