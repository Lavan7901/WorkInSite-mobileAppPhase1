import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useState, useEffect, useCallback} from 'react';
import {Alert, BackHandler} from 'react-native';
import RouteName from '../../../navigation/RouteName';
import {usePageRightsService} from '../../../services/PageRight';
import {usePageService} from '../../../services/PageService';
import Toast from 'react-native-toast-message';

export const usePageRole = ({navigation, route}: any) => {
  const {role} = route.params;
  const {GetPages} = usePageService();
  const {getPageRights, createPageRights} = usePageRightsService();

  const [pages, setPages] = useState<any[]>([]);
  const [pageRights, setPageRights] = useState<Record<number, number>>({});
  const [originalRights, setOriginalRights] = useState<Record<number, number>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();

  const fetchPageData = async () => {
    try {
      setLoading(true);

      const [pagesRes, rightsRes] = await Promise.all([
        GetPages({ignorePagination: true}),
        getPageRights(role.id),
      ]);

      const allPages = pagesRes?.items || pagesRes || [];
      const rightsList =
        rightsRes?.items?.[0]?.pageRights || rightsRes?.pageRights || [];

      const rightsMap: Record<number, number> = {};
      allPages.forEach((page: any) => {
        const existingRight = rightsList.find((r: any) => r.id === page.id);
        rightsMap[page.id] = existingRight ? existingRight.roleLevel : 0;
      });

      setPages(allPages);
      setPageRights(rightsMap);
      setOriginalRights(rightsMap); // save original copy
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || 'Failed to load pages or rights.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchPageData();
    }
  }, [isFocused]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPageData();
    setRefreshing(false);
  };

  const handleSelectRight = (pageId: number, level: number) => {
    setPageRights(prev => ({...prev, [pageId]: level}));
  };

  const handleSave = async () => {
    try {
      const rightsPayload = Object.entries(pageRights).map(
        ([pageId, roleLevel]) => ({
          pageId: Number(pageId),
          roleLevel,
        }),
      );

      const payload = {
        roleId: role.id,
        pageRights: rightsPayload,
      };

      await createPageRights(payload);
      navigation.navigate(RouteName.ROLES_SCREEN);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.[0]?.message || 'Failed to save rights.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
      });
    }
  };

  // const handleBackPress = useCallback(() => {
  //   navigation.navigate(RouteName.ROLES_SCREEN);
  // }, [navigation]);

  const hasUnsavedChanges = () => {
    return JSON.stringify(originalRights) !== JSON.stringify(pageRights);
  };

  const handleBackPress = useCallback(() => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. What would you like to do?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.navigate(RouteName.ROLES_SCREEN),
          },
          {
            text: 'Save',
            onPress: handleSave,
          },
        ],
      );
    } else {
      navigation.navigate(RouteName.ROLES_SCREEN);
    }
  }, [navigation, pageRights, originalRights]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [handleBackPress]),
  );

  const getDisabledLevels = (page: any): number[] => {
    if (page.id === 1 || page.name === 'Users') return [1, 2];
    if (page.id === 4 || page.name === 'Sites') return [2];
    return [];
  };

  return {
    role,
    pages,
    pageRights,
    loading,
    refreshing,
    handleRefresh,
    handleSelectRight,
    handleSave,
    getDisabledLevels,
    handleBackPress,
  };
};
