import {useMemo} from 'react';
import {useUser} from '../context/UserContext';
import {PermissionHelper} from '../helpers/PermissionsHelper';

export const usePermission = () => {
  const {user} = useUser();

  const isSuperAdmin =
    PermissionHelper.hasFullAccess(user) && user?.role?.id === 1;
  const isAdmin = PermissionHelper.hasFullAccess(user) && user?.role?.id === 2;

  const canView = (page: string) => PermissionHelper.canView(user, page);
  const canEdit = (page: string) => PermissionHelper.canEdit(user, page);

  return useMemo(
    () => ({
      isSuperAdmin,
      isAdmin,
      canView,
      canEdit,
    }),
    [user],
  );
};
