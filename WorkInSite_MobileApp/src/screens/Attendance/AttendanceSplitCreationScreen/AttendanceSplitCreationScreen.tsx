import { View } from "react-native-animatable"
import { useAttendanceSplitCreationScreen } from "./useAttendanceSplitCreationScreen"
import { Input } from "../../../components/CommonComponets"
import Button from "../../../components/CommonComponets/Button/Button"
import { useLanguage } from "../../../context/LanguageContext"
import { AttendanceSplit } from "../DTOs/AttendanceProps"
import { Combo } from "../../../components/CommonComponets/Combo/Combo"
import commonStyle from "../../../styles/commonStyle"

interface AttendanceSplitProps {
    attendanceSplit: AttendanceSplit[],
    setAttendanceSplit: (value: AttendanceSplit[]) => void,
    Ref?: any
    workerCategoryId: number,
}
export const AttendanceSplitCreationScreen = (props: AttendanceSplitProps) => {
    const { t } = useLanguage();
    const {
        workerRoleDetails,
        error,
        workerRoleId,
        noOfPersons,
        shiftId,
        shiftDetails,
        setShiftId,
        fetchShifts,
        setNoOfPersons,
        setWorkerRoleId,
        fetchWorkerRoles,
        handleSubmit
    } = useAttendanceSplitCreationScreen(props)

    return (
        <View style={commonStyle.customSheetInputfieldSpacer}>
            <Combo
                label={t("Worker Role")}
                items={workerRoleDetails}
                selectedValue={workerRoleId}
                onValueChange={setWorkerRoleId}
                required
                onSearch={fetchWorkerRoles}
                errorMessage={error.workerRoleId}
                isDisabled={props.workerCategoryId ? false : true}
                returnFullObject={true}
            />
            <Combo
                label={t("Shift")}
                items={shiftDetails}
                selectedValue={shiftId}
                onValueChange={setShiftId}
                onSearch={fetchShifts}
                required
                errorMessage={error.shiftId}
                returnFullObject={true}
            />
            <Input
                title={t("No Of Persons")}
                placeholder={t("Enter No Of Persons")}
                value={noOfPersons}
                onChangeText={setNoOfPersons}
                inputType='numeric'
                required
                errorMessage={error.noOfPersons}
            />
            <Button buttonStyle={{ marginTop: 10 }} title={t("Add")} onPress={handleSubmit} />
        </View>
    )
}