import React from 'react';

import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import {
  LandParcel,
  LandParcelCoreAgriculture as CoreAgricultureData,
} from '~/frontendlib/dataModel';
import FieldParcels from './FieldParcels';

interface ConfigurationProps {
  lpData: LandParcel;
  coreAgricultureData: CoreAgricultureData;

  handleFormSubmit: (data: any) => void;
  reFetch: () => void;
}

export default function Configuration({
  lpData,
  coreAgricultureData,
  handleFormSubmit,
  reFetch,
}: ConfigurationProps) {
  const componentData = [
    {
      label: 'Field Parcels',
      count: coreAgricultureData?.fields?.length,
      component: (
        <FieldParcels
          fieldsData={coreAgricultureData.fields}
          lpMap={lpData?.map}
          handleFormSubmit={handleFormSubmit}
          reFetch={reFetch}
        />
      ),
    },
  ];

  return (
    <>
      <VerticalTabs
        labels={componentData?.map((item) => ({ label: item.label, count: item.count }))}
        panels={componentData?.map((item) => item.component)}
        isCountPresent
      />
    </>
  );
}
