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
import { useUserList } from './useUserList';
import SearchBar from '../../../components/CommonComponets/SearchBar/Searchbar';
import images from '../../..';
import RouteName from '../../../navigation/RouteName';
import commonStyle from '../../../styles/commonStyle';
import Styles from '../../../styles/ListScreenStyle';
import Header from '../../../components/CommonComponets/Header/Header';
import Loader from '../../../components/Loader/Loader';
import UserStatus from '../../../components/CommonComponets/UserStatus/UserStatus';
import { useLanguage } from '../../../context/LanguageContext';
import UserCard from '../../../components/Card/UserCard';

export default function UserListScreen({ navigation }: any) {
  const { t } = useLanguage();
  const { userList, loading, handleEditUser, fetchUser, searchText, setSearchText } =
    useUserList({ navigation });
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
    }, []),
  );

  const filteredUserList = userList.filter(user =>
    user.name.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return <Loader />;
  }

  if (!userList.length) {
    return (
      <GetStartedCard
        buttonClick={'UserCreationScreen'}
        buttonLabel={t("Create User")}
        imgSrc={images.user_start_img}>
        Get started by creating a user to manage your team effortlessly.
      </GetStartedCard>
    );
  }

  const handlePress = () => {
    navigation.navigate(RouteName.USER_CREATION_SCREEN, {
      SupervisorOnly: false,
    });
  };

  const handleBack = () => {
    navigation.navigate(RouteName.Home_SCREEN);
  };

  return (
    <View style={commonStyle.container}>
      <Header
        title={t("User List")}
        onBackPress={handleBack}
        handleCreate={handlePress}
        rightNode={<UserStatus />}
      />
      <View>
        <SearchBar searchText={searchText} setSearchText={setSearchText} />

        {filteredUserList.length === 0 ? (
          <Text style={Styles.emptyText}>{t("No users found")}</Text>
        ) : (
          <FlatList
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            data={filteredUserList}
            keyExtractor={user => user.id.toString()}
            renderItem={({ item }) => (
              <UserCard
                name={item.name}
                role={item.role.name}
                phoneNumber={item.phone}
                isActive={item.isActive}
                onPress={() => handleEditUser(item.id)}
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
