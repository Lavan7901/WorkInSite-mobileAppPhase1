import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';
import {Colors, Fonts} from '../../../utils';
import Icon from '../../../utils/VectorIcons';
import componentStyle from '../../../styles/componentStyle';

const ToastNotification = () => {
  const toastConfig = {
    success: ({text1, text2, hide}: any) => (
      <ToastContainer
        backgroundColor={Colors.successColor}
        text1={text1}
        text2={text2}
        hide={hide}
      />
    ),
    error: ({text1, text2, hide}: any) => (
      <ToastContainer
        backgroundColor={Colors.dangerColor}
        text1={text1}
        text2={text2}
        hide={hide}
      />
    ),
    info: ({text1, text2, hide}: any) => (
      <ToastContainer
        backgroundColor={Colors.black}
        text1={text1}
        text2={text2}
        hide={hide}
      />
    ),
    warning: ({text1, text2, hide}: any) => (
      <ToastContainer
        backgroundColor={Colors.warningColor}
        text1={text1}
        text2={text2}
        hide={hide}
      />
    ),
  };

  return <Toast config={toastConfig} />;
};

const ToastContainer = ({
  backgroundColor,
  text1,
  text2,
  hide,
}: {
  backgroundColor: string;
  text1: string;
  text2: string;
  hide: () => void;
}) => {
  return (
    <View style={[styles.toastContainer, {backgroundColor}]}>
      <View style={componentStyle.inputWithIcon
}>
        <View>
          <Text style={styles.toastTitle}>{text1}</Text>
          <Text style={styles.toastMessage}>{text2}</Text>
        </View>
        <TouchableOpacity onPress={hide}>
          <Icon icon='Ionicons' name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 30,
    borderRadius: 8,
  },
  toastTitle: {
    fontWeight: 'bold',
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.Inter_Bold,
  },
  toastMessage: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 5,
    overflow: 'scroll',
  },
});

export default ToastNotification;
