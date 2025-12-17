import {Site} from '../../Sites/DTOs/SiteProps';
import {Unit} from '../../Unit/DTOs/UnitProps';
import { WorkType } from '../../Workers/DTOs/WorkTypeProps';

interface WorkRateAbstractProps {
  id: number;
  site: Site;
  workType: WorkType;
  totalRate: string;
  totalQuantity: string;
  unit: Unit;
  note: string;
}

interface workerRateAbstractRequest {
  totalRate: string;
  totalQuantity: string;
  note: string;
  siteId: number;
  workTypeId: number;
  unitId: number;
}

interface WorkRateAbstractValidateProps {
  siteId: string;
  workTypeId: string;
  totalRate: string;
  totalQuantity: string;
  unitId: string;
}

export type {
  WorkRateAbstractProps,
  workerRateAbstractRequest,
  WorkRateAbstractValidateProps,
};
