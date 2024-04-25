import React from 'react';

import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import TableView from '~/container/landparcel/details/TableView';
import { LandParcel } from '~/frontendlib/dataModel';
import PowerSources from './PowerSources';
import WaterSources from './WaterSources';

interface BasicUtilitiesProps {
  lpData: LandParcel;
  handleFormSubmit: (data: any) => void;
  reFetch: () => void;
}

export default function BasicUtilities({ lpData, reFetch }: BasicUtilitiesProps) {
  const componentData = [
    {
      label: 'Water Sources',
      count: lpData?.waterSources?.length,
      component: (
        <WaterSources
          data={lpData?.waterSources}
          lpMap={lpData?.map}
          lpData={lpData}
          reFetch={reFetch}
          modelName={`landparcel`}
        />
      ),
    },
    {
      label: 'Power Sources',
      count: lpData?.powerSources?.length,
      component: (
        <PowerSources
          data={lpData?.powerSources}
          lpMap={lpData?.map}
          lpData={lpData}
          reFetch={reFetch}
          modelName='landparcel'
        />
      ),
    },
  ];

  return (
    <>
      <VerticalTabs
        labels={componentData?.map((item, index) => ({ label: item.label, count: item.count }))}
        panels={componentData?.map((item, index) => item.component)}
        isCountPresent
      />
    </>
  );
}
