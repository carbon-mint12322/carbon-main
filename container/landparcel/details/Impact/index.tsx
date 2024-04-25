import React from 'react';

import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import TableView from '~/container/landparcel/details/TableView';
import { LandParcel } from '~/frontendlib/dataModel';
import SolarDryerEvents from './SolarDryerEvents';
import { LPEvent } from '~/frontendlib/dataModel';
import TabPanel from "~/components/lib/Navigation/Tabs/TabPanel";
import { Grid } from "@mui/material";

interface ImpactProps {
  lpData: LandParcel;
  handleFormSubmit: (data: any) => void;
  reFetch: () => void;
}

export default function Impact({ lpData, reFetch }: ImpactProps) {

  return (
    <>
      <Grid>
        <SolarDryerEvents
          data={lpData?.events.filter(
            (event: LPEvent) =>
              event.category === 'Land Parcel' && (event.name === 'solarDryerLoadEvent' || event.name === 'compostingInputEvent' || event.name === 'compostingHarvestEvent'),
          )}
          lpMap={lpData?.map}
          lpData={lpData}
          reFetch={reFetch}
        />
      </Grid>
    </>
  );
}
