export enum RoleLevel {
  NONE = 0, // No access
  VIEW = 1, // View only
  EDIT = 2, // View + Edit
}

export interface PageRight {
  id: number;
  name: string;
  isActive: boolean;
  note?: string;
  roleLevel: RoleLevel;
}

export interface UserProfile {
  id: number;
  name: string;
  phone: string;
  language: string;
  role: {
    id: number;
    name: string;
    isActive: boolean;
    note?: string;
  };
  isActive: boolean;
  pageRights: PageRight[] | null;
  note: string | null;
}
