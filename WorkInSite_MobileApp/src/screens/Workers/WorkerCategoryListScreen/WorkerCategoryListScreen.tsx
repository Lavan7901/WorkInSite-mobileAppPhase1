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
import { useWorkerCategoryList } from './useWorkerCategoryListScreen';
import { useLanguage } from '../../../context/LanguageContext';
import ContactCard from '../../../components/Card/ContactCard';

export default function WorkerCategoryListScreen({ navigation }: any) {
    const { t } = useLanguage();
    const { WorkerCategoryDetails, fetchWorkerCategory, handleEditWorkerCategory, loading, confirmDelete, searchText, setSearchText } =
        useWorkerCategoryList({ navigation });
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setSearchText(''); // reset search text
            const onBackPress = () => {
                navigation.navigate(RouteName.Home_SCREEN);
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, []),
    );

    const filteredWorkerCategoryList = WorkerCategoryDetails.filter(user =>
        user.name.toLowerCase().includes(searchText.trim().toLowerCase()),
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchWorkerCategory();
        setRefreshing(false);
    };

    if (loading && !refreshing) {
        return <Loader />;
    }

    if (!WorkerCategoryDetails.length) {
        return (
            <GetStartedCard
                buttonClick={RouteName.WORKER_CATEGORY_CREATION_SCREEN}
                buttonLabel={t("Create WorkerCategory")}
                imgSrc={images.worker_start_img}
                permissionKey='Worker Category'>
                Simplify the management of your construction workerCategory with WorkInSite.
                Get started today to ensure seamless coordination and productivity on
                your projects.
            </GetStartedCard>
        );
    }

    const handlePress = () => {
        navigation.navigate(RouteName.WORKER_CATEGORY_CREATION_SCREEN);
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
                title={t("Worker Category List")}
                onBackPress={handleBack}
                handleCreate={handlePress}
                permissionKey='Worker Category'
            />
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
            <View>
                {filteredWorkerCategoryList.length === 0 ? (
                    <Text style={Styles.emptyText}>{t("No Worker Category found")}</Text>
                ) : (
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        data={filteredWorkerCategoryList}
                        keyExtractor={workerCategory => workerCategory.id.toString()}
                        renderItem={({ item: workerCategory }) => (
                            <ContactCard
                                key={workerCategory.id}
                                name={workerCategory.name}
                                workType={`${t("Work Type Count")} : ${workerCategory?.workTypes?.length}` || ""}
                                workerRole={`${t("Worker Role Count")} : ${workerCategory?.workerRoles?.length}` || ""}
                                onDelete={() => confirmDelete(workerCategory.id)}
                                onPress={() => handleEditWorkerCategory(workerCategory.id)}
                                permissionKey='Worker Category'
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
