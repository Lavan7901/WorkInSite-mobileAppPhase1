import React, { useState } from 'react';
import {
    View,
    FlatList,
    BackHandler,
    Text,
    RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import GetStartedCard from '../../GetStartScreen/GetStartScreen';
import SearchBar from '../../../components/CommonComponets/SearchBar/Searchbar';
import images from '../../..';
import RouteName from '../../../navigation/RouteName';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import commonStyle from '../../../styles/commonStyle';
import Styles from '../../../styles/ListScreenStyle';
import Header from '../../../components/CommonComponets/Header/Header';
import Loader from '../../../components/Loader/Loader';
import { useWorkRateAbstractionList } from './useWorkRateAbstractList';
import { WorkRateAbstractProps } from '../DTOs/WorkRateAbstract';
import { useLanguage } from '../../../context/LanguageContext';
import ContactCard from '../../../components/Card/ContactCard';

export default function WorkRateAbstractListScreen({ navigation }: any) {
    const { t } = useLanguage();

    const { workRateAbstract, fetchWorkRateAbstract, handleEditworkRateAbstract, loading, confirmDelete, searchText, setSearchText } =
        useWorkRateAbstractionList({ navigation });
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setSearchText('');
            const onBackPress = () => {
                navigation.navigate(RouteName.Home_SCREEN);
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [navigation]),
    );

    const filteredWorkRateAbstractList = workRateAbstract?.filter(
        (item: WorkRateAbstractProps) =>
            item.site?.name?.toLowerCase().includes(searchText.trim().toLowerCase())
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchWorkRateAbstract();
        setRefreshing(false);
    };

    if (loading && !refreshing) {
        return <Loader />;
    }

    if (!workRateAbstract.length) {
        return (
            <GetStartedCard
                buttonClick={RouteName.WORK_RATE_ABSTRACT_CREATION}
                buttonLabel={t("Create WorkRateAbstract")}
                imgSrc={images.worker_start_img}
                permissionKey='Work Rate Abstract'>
                Simplify the management of your construction WorkRateAbstract with WorkInSite.
                Get started today to ensure seamless coordination and productivity on
                your projects.
            </GetStartedCard>
        );
    }

    const handlePress = () => {
        navigation.navigate(RouteName.WORK_RATE_ABSTRACT_CREATION);
    };

    const handleBack = () => {
        navigation.navigate(RouteName.Home_SCREEN);
    };

    return (
        <View style={commonStyle.container}>
            <View style={{ zIndex: 9 }}>
                <ToastNotification />
            </View>
            <Header
                title={t("Work Rate Abstract List")}
                onBackPress={handleBack}
                handleCreate={handlePress}
                permissionKey='Work Rate Abstract'
            />
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
            <View>
                {filteredWorkRateAbstractList.length === 0 ? (
                    <Text style={Styles.emptyText}>{t("No Work Rate Abstract found")}</Text>
                ) : (
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        data={filteredWorkRateAbstractList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }: { item: WorkRateAbstractProps }) => (
                            <ContactCard
                                key={item.id}
                                name={item.site.name}
                                workType={item.workType.name}
                                onDelete={() => confirmDelete(item.id)}
                                onPress={() => handleEditworkRateAbstract(item.id)}
                                permissionKey='Work Rate Abstract'
                            />
                        )}
                        contentContainerStyle={Styles.listContainer}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                )}
            </View>
        </View>
    );
}
