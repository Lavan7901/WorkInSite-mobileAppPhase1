import { Text, TouchableOpacity, View } from "react-native";
import { ContactDetailFormProps } from "./DTOs";
import { ContactTypes } from "../../../screens/Contacts/ContactTypes/ContactTypes";
import { useTheme } from "../../../context/ThemeContext";
import { getCreateAndEditScreenStyles } from "../../../styles/CreateAndEditScreenStyle";
import { useLanguage } from "../../../context/LanguageContext";
import { FormActionButton } from "../FormActionButton/FormActionButton";
import { usePermission } from "../../../hook/usePermission";

const ContactDetailForm = (props: ContactDetailFormProps) => {
  const { handleContactEdit, primaryContactDetails, hasMoreDetails, handleMoreDetails, permissionKey } = props;
  const { t } = useLanguage();
  const { theme } = useTheme()
  const { canEdit } = usePermission();
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;
  const Style = getCreateAndEditScreenStyles(theme)
  return (
    <View>
      <FormActionButton
        heading={t("Contact detail")}
        iconType="edit"
        onClick={handleContactEdit}
        isIconDisabled={!hasPermission}
      />
      <View>
        <ContactTypes contactList={primaryContactDetails} showEditDeleteButtons={false} />
      </View>
      {hasMoreDetails && (
        <TouchableOpacity onPress={handleMoreDetails}>
          <Text style={Style.moreDetails}>{t("More details...")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export { ContactDetailForm };

