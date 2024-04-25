import React from 'react';

import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import {
  LandParcel,
  LandParcelCoreAgriculture as CoreAgricultureData,
} from '~/frontendlib/dataModel';
import Crops from './Crops';
import CroppingSystem from './CroppingSystem';
import Plot from './Plot';

interface CoreAgricultureProps {
  lpData: LandParcel;
  coreAgricultureData: CoreAgricultureData;
  handleFormSubmit: (data: any) => void;
  reFetch: () => void;
}

export default function CoreAgriculture({
  lpData,
  coreAgricultureData,
  handleFormSubmit,
  reFetch,
}: CoreAgricultureProps) {
  const croppingSystems = coreAgricultureData.croppingSystems?.filter(
    (item) => item.status !== 'Completed',
  );
  const croppingPatterns = coreAgricultureData.croppingSystems?.filter(
    (item) => item.status === 'Completed',
  );
  let completedCrops = coreAgricultureData.crops?.filter((item) => item.status === 'Completed');
  let currentCrops = coreAgricultureData.crops?.filter((item) => item.status !== 'Completed');
  currentCrops = currentCrops.map((item) => {
    return {
      ...item,
      fieldId: lpData.fields.filter((f) => f.id === item.field)[0]?.fbId,
    };
  });
  const plots = coreAgricultureData.plots;
  const componentData = [
        {
          label: 'Cropping systems',
          count: croppingSystems?.length,
          component: (
            <CroppingSystem
              lpId={lpData?._id}
              data={croppingSystems}
              buttonVisible={true}
              reFetch={reFetch}
            />
          ),
        },
        {
          label: 'Plots',
          count: plots?.length,
          component: (
            <Plot
              lpId={lpData?._id}
              lpData={lpData}
              data={plots}
              buttonVisible={true}
              reFetch={reFetch}
            />
          ),
        },
        {
          label: 'Crops',
          count: currentCrops?.length,
          component: (
            <Crops
              cropsData={currentCrops}
              lpData={lpData}
              buttonVisible={true}
              reFetch={reFetch}
            />
          ),
        },
        {
          label: 'Completed Crops',
          count: completedCrops?.length,
          component: (
            <Crops
              cropsData={completedCrops}
              lpData={lpData}
              buttonVisible={false}
              reFetch={reFetch}
            />
          ),
        },
        {
          label: 'Cropping patterns',
          count: croppingPatterns?.length,
          component: (
            <CroppingSystem
              lpId={lpData?._id}
              reFetch={reFetch}
              data={croppingPatterns}
              buttonVisible={false}
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
