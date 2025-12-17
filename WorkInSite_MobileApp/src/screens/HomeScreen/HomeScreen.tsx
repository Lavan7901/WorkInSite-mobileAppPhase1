import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Image
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../context/ThemeContext';
import { useHome } from './useHome';
import { Site } from '../Sites/DTOs/SiteProps';
import Loader from '../../components/Loader/Loader';
import SiteCard from './SiteCard';
import { Colors } from '../../utils';
import RouteName from '../../navigation/RouteName';
import { getHomeScreenStyle } from '../../styles/homeScreenStyle';
import { usePermission } from '../../hook/usePermission';
import images from '../..';
import Button from '../../components/CommonComponets/Button/Button';

const HomeScreen = ({ navigation }: any) => {
  const {
    siteDetails,
    loading,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    statusFilter,
    setStatusFilter,
    chartData,
    searchInputRef,
    handlePress,
    refreshing,
    handleRefresh,
  } = useHome({ navigation });

  const { theme } = useTheme();
  const { canEdit } = usePermission()
  const editable = canEdit("Sites")
  const Styles = getHomeScreenStyle(theme);

  // Filter sites by name and status
  const filteredSiteList = siteDetails.filter(site =>
    site.name.toLowerCase().includes(search.trim().toLowerCase()) &&
    (statusFilter === '' || site.status === statusFilter)
  );
  const redirectUrl = RouteName.Home_SCREEN;

  const handleSiteGo = (id: number) => {
    navigation.navigate(RouteName.SITE_EDIT_SCREEN, { id })
  }

  const onAddAttendance = (id: number) => {
    navigation.navigate(RouteName.ATTENDANCE_CREATION_SCREEN, { redirect: redirectUrl, redirectParams: { siteId: id } });
  };

  const handleShowSearch = () => {
    setShowSearch(prev => !prev)
    setSearch("")
  }

  const renderItem = ({ item }: { item: Site }) => <SiteCard site={item} onSiteGo={handleSiteGo} onAttendanceGo={onAddAttendance} />;

  if (loading) return <Loader />;

  if (siteDetails.length === 0)
    return (
      <View style={[Styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <View style={Styles.welcomeCard}>
          <Image
            source={images.site_creation}
            style={Styles.welcomeImage}
            resizeMode="contain"
          />
          <Text style={Styles.welcomeTitle}>Welcome to WorkiSite!</Text>
          <Text style={Styles.welcomeDescription}>
            Organize, track, and manage all your construction sites in one place.
            Create your first site to get started.
          </Text>
          <Button buttonStyle={{ width: 300 }} title='Create New Site'
            onPress={() => navigation.navigate(RouteName.SITE_CREATION_SCREEN)}
            disable={!editable} />
        </View>
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={Styles.container}>
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={filteredSiteList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Text style={Styles.heading}>📊 Site Status Overview</Text>
              <View style={{ paddingHorizontal: 12 }}>
                {chartData.length > 0 ? (
                  <View style={Styles.chartCard}>
                    <PieChart
                      data={chartData}
                      donut
                      radius={100}
                      innerRadius={60}
                      isAnimated
                      showTooltip
                      focusOnPress
                      strokeColor="#fff"
                      strokeWidth={2}
                      centerLabelComponent={() => (
                        <View>
                          <Text style={Styles.centerLabel}>Total</Text>
                          <Text style={Styles.centerValue}>{siteDetails.length}</Text>
                        </View>
                      )}
                    />
                    <View style={Styles.legendContainer}>
                      <View style={Styles.legendColumn}>
                        {chartData.filter((_, i) => i % 2 === 0).map((item, idx) => (
                          <View key={idx} style={Styles.legendItem}>
                            <View style={[Styles.legendColor, { backgroundColor: item.color }]} />
                            <Text style={Styles.legendText}>{item.text}: {item.value}</Text>
                          </View>
                        ))}
                      </View>
                      <View style={Styles.legendColumn}>
                        {chartData.filter((_, i) => i % 2 !== 0).map((item, idx) => (
                          <View key={idx} style={Styles.legendItem}>
                            <View style={[Styles.legendColor, { backgroundColor: item.color }]} />
                            <Text style={Styles.legendText}>{item.text}: {item.value}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                ) : (
                  <Text style={Styles.noDataText}>data not found</Text>
                )}
              </View>
              <Text style={Styles.heading}> All Sites</Text>
              <View style={Styles.filterRow}>
                <TouchableOpacity onPress={handleShowSearch} style={Styles.searchIconWrapper}>
                  <Icon name={showSearch ? "x" : "search"} size={22} color="#333" />
                </TouchableOpacity>
                {showSearch && (
                  <TextInput
                    ref={searchInputRef}
                    style={Styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search Site..."
                    placeholderTextColor="#aaa"
                  />
                )}
                <View style={Styles.pickerWrapper}>
                  <Picker
                    selectedValue={statusFilter}
                    onValueChange={(itemValue) => setStatusFilter(itemValue)}
                    style={Styles.picker}
                    dropdownIconColor={Colors.grayColor}
                    mode="dropdown"
                  >
                    <Picker.Item label="All Status" value="" color={Colors.grayColor} />
                    <Picker.Item label="Working" value="Working" color={Colors.successColor} />
                    <Picker.Item label="Completed" value="Completed" color={Colors.completeColor} />
                    <Picker.Item label="Yet to start" value="Yet to start" color={Colors.warningColor} />
                    <Picker.Item label="Hold" value="Hold" color={Colors.dangerColor} />
                  </Picker>
                </View>

                {!showSearch && (
                  <TouchableOpacity
                    style={[Styles.addButton, { backgroundColor: theme.primaryColor, opacity: !editable ? 0.6 : 1 }]}
                    onPress={handlePress}
                    disabled={!editable}
                  >
                    <Text style={Styles.addButtonText}>New Site</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          }
          ListEmptyComponent={<Text style={Styles.noDataText}>No sites found for the selected status: {statusFilter}.</Text>}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </KeyboardAvoidingView>
  );
};


export default HomeScreen;



// import React, { useState } from "react";
// import { View } from "react-native";
// import TimePicker from "../../components/CommonComponets/TimePicker/TimePicker";

// export default function App() {
//   const [time, setTime] = useState(new Date());

//   return (
//     <View style={{ marginTop: 100, padding: 20 }}>
//       <TimePicker
//         label="Start Time"
//         value={time}
//         onChange={setTime}
//         is24Hour={false}
//       />
//     </View>
//   );
// }



