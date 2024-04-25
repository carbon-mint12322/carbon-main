import React from 'react';
import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import { INestedProps, LandParcel, LandParcelNestedResource } from '~/frontendlib/dataModel';

import SolarDryerUnits from './SolarDryerUnits';
import CompostingUnits from './CompostingUnits';
import ProcessingSystem from './ProcessingSystem';
import OutputProcessingUnits from './OutputProcessingUnits';
import StoreUnits from './StoreUnits';
import InputProcessingUnits from './InputProcessingUnits';
import SeedProcessingUnits from './SeedProcessingUnits';

interface ProcessingAndStoreProps {
  lpData: LandParcel;
  handleFormSubmit: (data: any) => void;
  reFetch: () => void;
  modelName: string;
}

export default function ProcessingAndStore({ lpData, reFetch, modelName }: ProcessingAndStoreProps) {
  const processingSystems =
    lpData?.processingSystems.map((item: any) => {
      return {
        id: item._id,
        field: item.field,

        fieldName: lpData?.fields.filter((f: any) => f.id === item.field)?.[0]?.fbId,
        status: item.status,
        category: item.category,
        name: item.name,
        landParcel: item.landParcel,
      };
    }) || [];

  const getCount = (paramName: keyof LandParcelNestedResource) => lpData?.[paramName]?.length ?? 0;

  const getProps = (paramName: keyof LandParcelNestedResource): INestedProps => ({
    data: lpData?.[paramName] ?? [],
    lpData: lpData,
    reFetch,
    modelName,
    lpMap: lpData?.map,
  });

  const componentData = [
    {
      label: 'Processing systems',
      count: processingSystems?.length,
      component: (
        <ProcessingSystem
          lpId={lpData._id}
          data={processingSystems}
          buttonVisible={true}
          reFetch={reFetch}
        />
      ),
    },
    {
      label: 'Drying yard',
      count: getCount('solarDryerUnits'),
      component: <SolarDryerUnits {...getProps('solarDryerUnits')} />,
    },
    {
      label: 'Composting',
      count: getCount('compostingUnits'),
      component: <CompostingUnits {...getProps('compostingUnits')} />,
    },

    {
      label: 'Output processing',
      count: getCount('outputProcessingUnits'),
      component: <OutputProcessingUnits {...getProps('outputProcessingUnits')} />,
    },
    {
      label: 'Input processing',
      count: getCount('inputProcessingUnits'),
      component: <InputProcessingUnits {...getProps('inputProcessingUnits')} />,
    },
    {
      label: 'Seed processing',
      count: getCount('seedProcessingUnits'),
      component: <SeedProcessingUnits {...getProps('seedProcessingUnits')} />,
    },
    {
      label: 'Store',
      count: getCount('storeUnits'),
      component: <StoreUnits {...getProps('storeUnits')} />,
    },
    // TODO : Get fields and add default categoryDetails components as their editor
    // and with their appropriate params
  ];

  const labels = componentData?.length
    ? componentData?.map((item, index) => ({ label: item.label, count: item.count }))
    : [
      {
        label: 'General',
        count: 0,
      },
    ];

  const panels = componentData?.length
    ? componentData?.map((item, index) => item.component)
    : [<></>];

  return (
    <>
      <VerticalTabs labels={labels} panels={panels} isCountPresent />
    </>
  );
}
