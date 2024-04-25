import React from 'react';

import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';

import LandParcelsCardContent from './LandParcelsCardContent';

export interface LandParcel {
  id: number;
  name: string;
  surveyNumber: string;
  areaInAcres: number;
  climateScore: number;
  complianceScore: number;
  farmer_id: string;
  own: boolean;
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
  address: Address;
  adjacentLands_north: string;
  adjacentLands_south: string;
  adjacentLands_east: string;
  adjacentLands_west: string;
  crops: Crop[];
}

export interface Address {
  village: string;
  mandal: string;
  state: string;
  pincode: number;
}

export interface Crop {
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

interface LandParcelsListProps {
  data: LandParcel[];
}

const LandParcelsList = ({ data }: LandParcelsListProps) => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2 }}>
          {data &&
            data?.map((landParcelData: LandParcel, index: number) => (
              <Grid item lg={4} md={6} sm={6} xs={12} key={`landParcelsCard${index}`}>
                <LandParcelsCardContent key={`FDLP${index}`} landParcelData={landParcelData} />
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
};

export default LandParcelsList;
