import React, { useEffect, useState } from 'react';

import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import TableView from '~/container/landparcel/details/TableView';
import { INestedProps, LandParcel, LandParcelNestedResource } from '~/frontendlib/dataModel';
import Facilities from './Facilities';
import Farmhouses from './Farmhouses';
import Toilets from './Toilets';
import LaborQuarters from './LaborQuarters';
import SecurityHouses from './SecurityHouses';
import ScrapSheds from './ScrapSheds';
import MedicalAssistances from './MedicalAssistances';
import Dinings from './Dinings';
import Attractions from './Attractions';
import SupportJson from '~/gen/jsonschemas/landparcel_supportutilities.json';
import CategoryDetails from '../CategoryDetails';
import dynamic from 'next/dynamic';
const LandParcelSupportUtilEditor = dynamic(
  import('~/gen/data-views/landparcel_supportutilities/landparcel_supportutilitiesEditor.rtml'),
);

const SUPPORT_UTILITIES_CATEGORIES =
  SupportJson.properties.supportUtilities.properties.category.enum;

interface SupportUtilitiesProps {
  lpData: LandParcel;
  handleFormSubmit: (data: any) => void;
  reFetch: () => void;
  modelName: string;
}

interface ISubCompontent {
  label: typeof SUPPORT_UTILITIES_CATEGORIES[number];
  count: number;
  component: JSX.Element;
}

export default function SupportUtilities({ lpData, handleFormSubmit, reFetch, modelName }: SupportUtilitiesProps) {

  //
  const getCount = (paramName: keyof LandParcelNestedResource) => lpData?.[paramName]?.length ?? 0;

  //
  const getProps = (paramName: keyof LandParcelNestedResource): INestedProps => ({
    data: lpData?.[paramName] ?? [],
    lpData: lpData,
    reFetch,
    modelName,
    lpMap: lpData?.map
  })

  const components: Array<ISubCompontent> = [
    {
      label: 'Farmhouse',
      count: getCount('farmhouses'),
      component: <Farmhouses {...getProps('farmhouses')} />,
    },
    {
      label: 'Toilet',
      count: getCount('toilets'),
      component: <Toilets {...getProps('toilets')} />,
    },
    {
      label: 'Labor quarters',
      count: getCount('laborQuarters'),
      component: <LaborQuarters {...getProps('laborQuarters')} />,
    },
    {
      label: 'Security house',
      count: getCount('securityHouses'),
      component: <SecurityHouses {...getProps('securityHouses')} />,
    },
    {
      label: 'Scrap shed',
      count: getCount('scrapSheds'),
      component: <ScrapSheds {...getProps('scrapSheds')} />,
    },
    {
      label: 'Medical assistance',
      count: getCount('medicalAssistances'),
      component: <MedicalAssistances {...getProps('medicalAssistances')} />,
    },
    {
      label: 'Dining',
      count: getCount('dinings'),
      component: <Dinings {...getProps('dinings')} />,
    },
    {
      label: 'Attractions',
      count: getCount('attractions'),
      component: <Attractions {...getProps('attractions')} />,
    },
  ];

  const labels = components?.length
    ? components?.map((item, index) => ({ label: item.label, count: item.count }))
    : [
      {
        label: 'General',
        count: 0,
      },
    ];
  const panels = components?.length
    ? components?.map((item, index) => item.component)
    : [
      <CategoryDetails
        key={1}
        data={[]}
        handleFormSubmit={handleFormSubmit}
        title='General'
        Editor={LandParcelSupportUtilEditor}
      />,
    ];

  return (
    <>
      <VerticalTabs labels={labels} panels={panels} isCountPresent />
    </>
  );
}
