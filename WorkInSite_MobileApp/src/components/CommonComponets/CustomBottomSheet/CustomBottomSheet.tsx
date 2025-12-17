import React, { forwardRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Colors, SF } from '../../../utils';
import Icon from '../../../utils/VectorIcons';
import commonStyle from '../../../styles/commonStyle';
import componentStyle from '../../../styles/componentStyle';

type BottomSheetProps = {
  title?: string;
  children: React.ReactNode;
  height?: number;
  customStyles?: object;
  onClose?: () => void;
  scrollview?: boolean;
};

const CustomBottomSheet = forwardRef<any, BottomSheetProps>(
  ({ title, children, height = 400, customStyles, onClose, scrollview }, ref) => {
    return (
      <RBSheet
        ref={ref}
        height={height}
        openDuration={250}
        customStyles={{
          container: [componentStyle.customSheetContainer, { flexGrow: 1 }, customStyles],
        }}>
        <View style={[componentStyle.inputWithIcon, commonStyle.spaceBelow]}>
          {title && <Text style={componentStyle.sheetTitle}>{title}</Text>}
          <TouchableOpacity onPress={onClose}>
            <Icon icon="MaterialIcons" name="close" size={24} color={Colors.secondaryColor} />
          </TouchableOpacity>
        </View>

        {scrollview ? (
          <ScrollView  keyboardShouldPersistTaps={'handled'}>{children}</ScrollView>
        ) : (
          <View style={{ flex: 1 }}>{children}</View>
        )}
      </RBSheet>
    );
  },
);

export default CustomBottomSheet;