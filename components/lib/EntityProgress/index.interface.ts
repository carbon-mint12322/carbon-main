import { Coordinate } from '~/utils/coordinatesFormatter';
import { CropProgress as CropProgressParams, Farmer } from '~/frontendlib/dataModel';
import { EntityEventsProps } from '../EntityEvents/index.interface';

export interface CropData {
  id: string;
  name: string;
  landParcel: string;
  croppingSystem: string;
  startDate: string;
  farmer: Farmer;
  landParcelMap: string;
  fieldMap: string;
  areaInAcres: number;
  estimatedYieldTones: number;
  plannedSowingDate: string;
  estHarvestDate: string;
  category: string;
  cropProgress: CropProgressParams;
  location?: Coordinate;
}
export interface EntityProgressProps {
  data: any;
  category: string;
  eventData: EntityEventsProps;
  reFetch?: () => void;
  eventPlanModalHandler: string;
  entity: string
  EntityEventEditor: any
}

