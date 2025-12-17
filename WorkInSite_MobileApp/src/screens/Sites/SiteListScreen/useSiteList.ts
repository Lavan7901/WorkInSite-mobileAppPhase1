import {useEffect, useState} from 'react';
import {Site} from '../DTOs/SiteProps';
import {useSiteService} from '../../../services/SiteService';
import RouteName from '../../../navigation/RouteName';
import {useIsFocused} from '@react-navigation/native';
import {useRefresh} from '../../../context/RefreshContext';

const useSiteList = ({navigation}: any) => {
  const siteService = useSiteService();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.SITE_LIST_SCREEN];

  const [siteDetails, setSiteDetails] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const isFocused = useIsFocused();

  const fetchSite = async (searchString: string = '') => {
    const siteData = await siteService.getSites({searchString});
    setSiteDetails(siteData);
    if (siteData) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchSite();
    }
    if (refreshKey) {
      setSearchText('');
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.SITE_LIST_SCREEN);
    }
  }, [isFocused]);

  const handleSiteSelect = (id: number) => {
    navigation.navigate(RouteName.SITE_EDIT_SCREEN, {id});
  };

  return {
    siteDetails,
    fetchSite,
    handleSiteSelect,
    loading,
    searchText,
    setSearchText,
  };
};

export {useSiteList};
