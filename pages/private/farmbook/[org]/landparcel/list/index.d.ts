import { SxProps } from '@mui/system';

// Props Models

export interface LandParcelListPageProps {
  data: Data[];
  pageConfig: PageConfig;
  sx: SxProps;
}

// Page Config Model
export interface PageConfig {
  appName: string;
  title: string;
  menuItems: MenuItem[];
  dashPageData: {
    dashMenuItems: MenuItem[];
  };
  operatorPageData: {
    operatorMenuItems: MenuItem[];
  };
}

export interface MenuItem {
  title: string;
  href: string;
  selected?: boolean;
}

export interface Data {
  id: string;
  _id: string;
  personalDetails: PersonalDetails;
  totalFarmingExperienceYears: number;
  organicFarmingExperienceYears: number;
  cropsWithOrganicFarmingExperience: string;
  livestockExperience: number;
  agriAlliedActivitiesExperience: string;
  personalOrgDetails: PersonalOrgDetails;
  crops?: CropsEntity[] | null;
  landParcels?: LandParcelsEntity[] | null;
}
export interface PersonalDetails {
  identityNumber: number;
  firstName: string;
  lastName: string;
  primaryPhone: string;
  address: Address;
}
export interface Address {
  village: string;
  state: string;
}
export interface PersonalOrgDetails {
  orgName: string;
  identificationNumber: string;
  joiningDate: string;
}
export interface CropsEntity {
  id: number;
  name: string;
  landParcel: string;
  areaInAcres: number;
  estimatedYieldTones: number;
  croppingSystem: string;
  startDate: string;
  farmer_id: string;
  farmer_name: string;
  plannedSowingDate: string;
  estHarvestDate: string;
  category: string;
  field_id: number;
  climateScore: number;
  complianceScore: number;
  seedVariety: string;
  seedSource: string;
  seedType: string;
}
export interface LandParcelsEntity {
  id: number;
  name: string;
  surveyNumber: string;
  areaInAcres: number;
  climateScore: number;
  complianceScore: number;
  farmer_id: string;
  own: string;
  landOwner_id: string;
  landOwner_identityNumber: string;
  landOwner_firstName: string;
  landOwner_lastName: string;
  landOwner_primaryPhone: string;
  landOwner_village: string;
  landOwner_state: string;
  location_lat: number;
  location_lng: number;
  map: string;
  address_village: string;
  address_mandal: string;
  address_state: string;
  address_pincode: number;
  adjacentLands_north: string;
  adjacentLands_south: string;
  adjacentLands_east: string;
  adjacentLands_west: string;
  crops?: CropsEntity[] | null;
}
