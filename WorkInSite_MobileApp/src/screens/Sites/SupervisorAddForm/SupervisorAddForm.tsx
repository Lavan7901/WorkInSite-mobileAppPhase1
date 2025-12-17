import React from "react";
import { View } from "react-native";
import { useSupervisorAddForm } from "./useSupervisorAddForm";
import { Combo } from "../../../components/CommonComponets/Combo/Combo";
import Button from "../../../components/CommonComponets/Button/Button";
import { useLanguage } from "../../../context/LanguageContext";
import { User } from "../../Users/DTOs/User";

interface Props {
  siteId?: string;
  supervisors: User[];
  setSupervisors: React.Dispatch<React.SetStateAction<User[]>>;
  navigation: any;
  redirectUrl: string;
  Ref?: React.MutableRefObject<any>;
}

const SupervisorAddForm: React.FC<Props> = (props) => {
  const { t } = useLanguage();
  const {
    options,
    selected,
    setSelected,
    error,
    fetchUsers,
    handleAdd,
    handleCreate,
  } = useSupervisorAddForm(props);

  return (
    <View>
      <Combo
        label={t("Supervisor")}
        showCreateButton
        items={options}
        selectedValue={selected}
        onCreate={handleCreate}
        onValueChange={setSelected}
        onSearch={fetchUsers}
        required
        errorMessage={error}
      />
      <Button buttonStyle={{ marginTop: 16 }} title={t("Add")} onPress={handleAdd} />
    </View>
  );
};

export { SupervisorAddForm };
