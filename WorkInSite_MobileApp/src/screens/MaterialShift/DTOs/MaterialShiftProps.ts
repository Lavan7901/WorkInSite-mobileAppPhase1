import { Site } from "../../Sites/DTOs/SiteProps";
import { Material } from "../../Materials/DTOs/MaterialProps";

interface MaterialShift {
  id: number;
  date: string;
  material: Material;
  sourceSite: Site;
  targetSite: Site;
  quantity: string;
  note: string;
}


interface MaterialShiftCreationRequest {
  date: string;
  quantity: string;
  note: string;
  materialId: number;
  sourceSiteId: number;
  targetSiteId: number;

}

interface MaterialShiftFilterRequest {
  date?: string;
  materialId?: number;
  sourceSiteId?: number;
  targetSiteId?: number;
  quantity?: string;
  pageNumber?: number;
  pageSize?: number;
}

export type { MaterialShiftCreationRequest, MaterialShift,MaterialShiftFilterRequest };
