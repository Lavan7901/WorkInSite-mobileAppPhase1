// hooks/useHome.ts
import {useIsFocused} from '@react-navigation/native';
import {useState, useRef, useEffect} from 'react';
import {TextInput, Alert, BackHandler} from 'react-native';
import RouteName from '../../navigation/RouteName';
import {useSiteService} from '../../services/SiteService';
import {Site} from '../Sites/DTOs/SiteProps';
import {Colors} from '../../utils';

export const useHome = ({navigation}: any) => {
  const [siteDetails, setSiteDetails] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Working');
  const [refreshing, setRefreshing] = useState(false);

  const siteService = useSiteService();
  const isFocused = useIsFocused();
  const searchInputRef = useRef<TextInput>(null);

  // Fetch sites when focused
  useEffect(() => {
    if (isFocused) {
      fetchSite();
    } else {
      setShowSearch(false);
      setStatusFilter('Working');
      setSearch('');
    }
  }, [isFocused]);

  // Focus search bar when shown
  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus();
    }
  }, [showSearch]);

  // Android back button handling
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('', 'Are you sure you want to exit the app?', [
          {text: 'No', onPress: () => null, style: 'cancel'},
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigation]);

  // Fetch sites
  const fetchSite = async (searchString: string = '') => {
    try {
      setLoading(true);
      const siteData = await siteService.getSites({searchString});
      setSiteDetails(Array.isArray(siteData) ? siteData : []);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setSiteDetails([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate status counts
  const getStatusCounts = () => {
    const counts = {Working: 0, Completed: 0, 'Yet to start': 0, Hold: 0};
    siteDetails.forEach(site => {
      const status = site.status || 'Unassigned';
      if (counts.hasOwnProperty(status)) {
        counts[status as keyof typeof counts]++;
      }
    });
    return counts;
  };

  const statusData = getStatusCounts();

  // Chart data
  const chartData = [
    {value: statusData.Working, color: Colors.successColor, text: 'Working'},
    {value: statusData.Completed, color: Colors.completeColor, text: 'Completed'},
    {
      value: statusData['Yet to start'],
      color: Colors.warningColor,
      text: 'Yet to start',
    },
    {value: statusData.Hold, color: Colors.dangerColor, text: 'Hold'},
  ].filter(item => item.value > 0);

  const handlePress = () => {
    navigation.navigate(RouteName.SITE_CREATION_SCREEN);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSite(); // already fetching shift list
    setRefreshing(false);
  };

  return {
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
  };
};
