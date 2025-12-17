// import {useMemo} from 'react';
// import { useUser } from '../context/UserContext';

// export const usePermission = () => {
//   const { user } = useUser();

//   const isSuperAdmin = user?.role?.id === 1;
//   const isAdmin = user?.role?.id === 2;

//   const getPageLevel = (pageName: string): number => {
//     if (!user) return 0;
//     if (isSuperAdmin || isAdmin) return 2; // full rights

//     const page = user.pageRights?.find(
//       (p) => p.name.toLowerCase() === pageName.toLowerCase(),
//     );
//     return page?.roleLevel ?? 0;
//   };

//   const hasViewPermission = (pageName: string): boolean => getPageLevel(pageName) >= 1;
//   const hasEditPermission = (pageName: string): boolean => getPageLevel(pageName) === 2;

//   return useMemo(
//     () => ({
//       isSuperAdmin,
//       isAdmin,
//       getPageLevel,
//       hasViewPermission,
//       hasEditPermission,
//     }),
//     [user],
//   );
// };

//2

// src/helpers/PermissionHelper.ts

import {UserProfile, RoleLevel} from '../screens/ProfileScreen/profile';

export const PermissionHelper = {
  hasFullAccess(user?: UserProfile | null): boolean {
    return [1, 2].includes(user?.role?.id ?? 0); // SuperAdmin(1), Admin(2)
  },

  getPageLevel(user: UserProfile | null, page: string): RoleLevel {
    if (!user) return RoleLevel.NONE;
    if (this.hasFullAccess(user)) return RoleLevel.EDIT;

    const right = user.pageRights?.find(
      p => p.name.toLowerCase() === page.toLowerCase(),
    );
    return right?.roleLevel ?? RoleLevel.NONE;
  },

  canView(user: UserProfile | null, page: string): boolean {
    return this.getPageLevel(user, page) >= RoleLevel.VIEW;
  },

  canEdit(user: UserProfile | null, page: string): boolean {
    return this.getPageLevel(user, page) === RoleLevel.EDIT;
  },
};
