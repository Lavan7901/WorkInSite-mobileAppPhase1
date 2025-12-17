import {Site} from '../../Sites/DTOs/SiteProps';
import {Material} from '../../Materials/DTOs/MaterialProps';
import {WorkMode} from '../../Workers/WorkMode/DTOs/WorkModeProps';

interface MaterialUsedCreationRequest {
  siteId: number;
  materialId: number;
  quantity: string;
  workModeId: number;
  note: string;
  date: string;
}

interface MaterialUsedUpdationRequest {
  siteId: number;
  materialId: number;
  quantity: string;
  workModeId: number;
  note: string;
  date: string;
}

// interface MaterialUsed {
//   workMode: WorkMode;
//   id: number;
//   materialId: number;
//   siteId: number;
//   site: Site;
//   material: Material;
//   quantity: string;
//   workModeId: number;
//   notes: string;
//   date: string;
// }
interface MaterialUsed {
  id: number;
  workMode: WorkMode;
  site: Site;
  material: Material;
  quantity: string;
  notes: string;
  date: string;
}

export type {
  MaterialUsedCreationRequest,
  MaterialUsedUpdationRequest,
  MaterialUsed,
};
