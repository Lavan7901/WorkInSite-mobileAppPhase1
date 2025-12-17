import {Alert} from 'react-native';
import {useWorkerRoleInputValidate} from '../InputValidate/WorkerRoleValidate';
import {useWorkerRoleCostService} from '../../../services/WorkerRoleCostService';
import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {useState, useRef, useEffect} from 'react';
import {WorkerRoles} from '../DTOs/WorkerRoleProps';
import {WorkerRoleCostEditRouteParams} from './DTOs';
import Toast from 'react-native-toast-message';

export const useWorkerRoleCostEdit = ({navigation}: any) => {
  const route =
    useRoute<
      RouteProp<Record<string, WorkerRoleCostEditRouteParams>, string>
    >();
  const {workerCategoryId, redirect, id} = route.params;
  const {getWorkerRoleCosts, createWorkerRoleCost} = useWorkerRoleCostService();

  const initalCost = {
    id: 0,
    name: '',
    salaryPerShift: '',
    hoursPerShift: '',
  };

  const [costs, setCosts] = useState<WorkerRoles[]>([]);
  const [editingCost, setEditingCost] = useState<WorkerRoles>(initalCost);
  const [loading, setLoading] = useState(true);
  const bottomSheetRef = useRef<any>(null);
  const isFocuse = useIsFocused();

  const {error, validate, setError, initialError} = useWorkerRoleInputValidate(
    editingCost.name,
    editingCost.salaryPerShift,
    editingCost.hoursPerShift,
  );

  useEffect(() => {
    if (isFocuse) {
      fetchCosts();
    }
  }, [isFocuse]);

  const fetchCosts = async () => {
    setLoading(true);
    try {
      const response = await getWorkerRoleCosts({
        WorkerCategoryId: workerCategoryId,
        WorkerId: id,
      });
      setCosts(response || []);
    } catch (err) {
      console.error('Error fetching costs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cost: WorkerRoles) => {
    setEditingCost(cost);
    setError(initialError);
  };

  const handleBack = () => {
    navigation.navigate(redirect, {id});
  };

  const handleSave = async () => {
    if (validate()) {
      const originalCost = costs.find(cost => cost.id === editingCost.id);
      const hasChanges =
        originalCost &&
        (originalCost.salaryPerShift !== editingCost.salaryPerShift ||
          originalCost.hoursPerShift !== editingCost.hoursPerShift);

      if (!hasChanges) {
        Alert.alert('No Changes', 'Nothing to update');
        bottomSheetRef.current.close();
        setEditingCost(initalCost);
        return;
      }

      try {
        const updatedCost = {
          workerId: id,
          workerRoleId: editingCost.id,
          salaryPerShift: editingCost.salaryPerShift,
          hoursPerShift: editingCost.hoursPerShift,
        };
        await createWorkerRoleCost(updatedCost);
        bottomSheetRef.current.close();
        setEditingCost(initalCost);
        fetchCosts();
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0].message || 'Failed to create unit';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  return {
    bottomSheetRef,
    loading,
    error,
    costs,
    editingCost,
    setEditingCost,
    handleEdit,
    handleSave,
    handleBack,
  };
};
