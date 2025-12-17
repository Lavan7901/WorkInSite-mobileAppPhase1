import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../utils';

type DividerProps = {
    text: string;
};

const Divider: React.FC<DividerProps> = ({ text }) => {
    return (
        <View style={styles.container}>
            <View style={styles.line} />
            <Text style={styles.text}>{text}</Text>
            <View style={styles.line} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    text: {
        marginHorizontal: 8,
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
});

export default Divider;
