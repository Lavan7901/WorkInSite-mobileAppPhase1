import React from 'react';
import { View, Text } from 'react-native';
import { UpiEditDeleteButtons } from '../UpiEditDeleteButtons/UpiEditDeleteButtons';
import { Icons } from './UpiTypesIcon';
import { UpiTypes as UpipProps } from '../DTOs/DTOs';
import componentStyle from '../../../../styles/componentStyle';

interface UpiTypesProp<T> {
  details: T;
  setDetails: any;
  permissionKey?: string;
}

const UpiTypes = <
  T extends { upiDetails: { upiType: UpipProps; value: string }[] },
>({
  details,
  setDetails,
  permissionKey
}: UpiTypesProp<T>) => {
  return (
    <>
      {details.upiDetails.map((item, index) => (
        <React.Fragment key={index}>
          {item.value && (
            <View style={componentStyle.typeRowBetweenContainer}>
              <View style={componentStyle.typeRowIconWithText}>
                <View style={componentStyle.typeIconRightSpacing}>
                  {Icons[item.upiType] || Icons.DEFAULT}
                </View>
                <Text style={componentStyle.typeText}>{item.value}</Text>
              </View>
              <UpiEditDeleteButtons
                details={details}
                setDetails={setDetails}
                selectedItem={{ id: index, item }}
                permissionKey={permissionKey}
              />
            </View>
          )}
        </React.Fragment>
      ))}
    </>
  );
};
export { UpiTypes };
