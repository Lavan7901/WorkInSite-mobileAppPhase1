import React, { useState } from 'react';
import { ScrollView, View, Text, FlatList, RefreshControl, TouchableOpacity, KeyboardAvoidingView, BackHandler } from 'react-native';
import RouteName from '../../../navigation/RouteName';
import SearchBar from '../../../components/CommonComponets/SearchBar/Searchbar';
import Loader from '../../../components/Loader/Loader';
import commonStyle from '../../../styles/commonStyle';
import Header from '../../../components/CommonComponets/Header/Header';
import { useMaterialList } from './useMaterialList';
import GetStartedCard from '../../GetStartScreen/GetStartScreen';
import images from '../../../images';
import { useFocusEffect } from '@react-navigation/native';
import Styles from '../../../styles/ListScreenStyle';
import { useLanguage } from '../../../context/LanguageContext';
import MaterialCard from '../../../components/Card/MaterialCard';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

export default function MaterialListScreen({ navigation }: any) {
  const { t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const { materialDetails, fetchMaterial, handleMaterialDelete, handleMaterialSelect, loading, searchText, setSearchText } = useMaterialList({ navigation });

  const filteredMaterialList = materialDetails.filter((item: { name: string; }) =>
    item.name.toLowerCase().includes(searchText.trim().toLowerCase())
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMaterial(searchText);
    setRefreshing(false);
  };

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

  if (loading && !refreshing) {
    return <Loader />;
  }

  if (!materialDetails.length) {
    return (
      <GetStartedCard
        buttonClick="MaterialCreationScreen"
        buttonLabel={t("Create Materials")}
        imgSrc={images.site_creation}
        permissionKey='Material'>
        Dive into the heart of construction site management. Create, edit, and
        view site information effortlessly. Assign workers, supervisors, and
        track project progress.
      </GetStartedCard>
    );
  }

  const renderMaterialItem = ({ item }: any) => (
    <MaterialCard
      material={item}
      unit={item.unit.name}
      hsnCode={item.hsnCode}
      onDelete={() => handleMaterialDelete(item.id)}
      onPress={() => handleMaterialSelect(item.id)}
      permissionKey='Material'
    />
  );

  const handlePress = () => {
    navigation.navigate(RouteName.MATERIAL_CREATION_SCREEN);
  };

  const handleBack = () => {
    navigation.navigate(RouteName.Home_SCREEN);
  };

  if (loading && !refreshing) {
    return <Loader />;
  }

  return (
    <View style={commonStyle.container}>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header
        title={t("Material List")}
        onBackPress={handleBack}
        handleCreate={handlePress}
        permissionKey='Material'
      />
      <SearchBar searchText={searchText} setSearchText={setSearchText} />
      <KeyboardAvoidingView enabled style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          <View>
            {filteredMaterialList.length === 0 ? (
              <Text style={Styles.emptyText}>{t("No materials found")}</Text>
            ) : (
              <FlatList
                keyboardShouldPersistTaps="handled"
                style={{ paddingBottom: 10 }}
                // contentContainerStyle={Styles.listContainer}
                data={filteredMaterialList}
                renderItem={renderMaterialItem}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
