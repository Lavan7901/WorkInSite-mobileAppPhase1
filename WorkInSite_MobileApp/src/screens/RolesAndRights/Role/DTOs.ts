export interface Roles {
  name: string;
  note?: string;
  isActive?: boolean;
  id: number;
}
 
export interface RoleRequest {
  name: string;
  note?: string;
}