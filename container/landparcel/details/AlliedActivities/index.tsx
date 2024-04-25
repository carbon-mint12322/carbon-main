import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import {
  LandParcel,
  LandParcelAlliedActivity as AlliedActivityData,
} from '~/frontendlib/dataModel';
import CategoryDetails from '../CategoryDetails';
import PoultryBatchDetails from './PoultryBatchDetails';
import LiveStockDetails from './LiveStockDetails';
import Aquaculture from './Aquaculture';
import ProductionSystem from './ProductionSystem';
import AlliedActivitiesJson from '~/gen/jsonschemas/landparcel_alliedactivities.json';
import dynamic from 'next/dynamic';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import { Paper, Box, Button } from '@mui/material';
import axios from 'axios';

const LandParcelAlliedActEditor = dynamic(
  import(
    '~/gen/data-views/landparcel_alliedactivities/landparcel_alliedactivitiesEditor.rtml'
  ),
);

const ALLIED_ACTIVITY_CATEGORIES =
  AlliedActivitiesJson.properties.alliedActivities.properties.category.enum;
interface AlliedActivitiesProps {
  lpData: LandParcel;
  alliedActivityData: AlliedActivityData;
  handleFormSubmit: (data: any) => void;
  reFetch: () => void;
}

export default function AlliedActivities(props: AlliedActivitiesProps) {
  const [categories, setCategories] = useState<any>({});
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();
  useEffect(() => {
    let categories: any = {};
    ALLIED_ACTIVITY_CATEGORIES.forEach((category) => (categories[category] = []));
    props?.lpData?.alliedActivity?.forEach((activity) => {
      const category = activity.category || 'General';
      categories[category].push(activity);
    });
    setCategories(categories);
  }, [props?.alliedActivityData]);

  const handleAddPoultryFormSubmit = async (data: any) => {
    try {
      data = {
        ...data,
        landParcel: props?.lpData?._id,
        status: 'Draft',
      };
      const res = await axios.post(getApiUrl('/poultry'), data);
      if (res) {
        props?.reFetch && props.reFetch();
        openToast('success', 'Successfully added a poultry batch');
        setOpenDialog(false);
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add poultry batch');
    }
  };

  //console.log('Props.data', props?.lpData);

  const productionSystems = props?.alliedActivityData?.productionSystems?.filter(
    (item: any) => item.status !== 'Completed',
  );

  const componentData = [
    {
      label: 'Production systems',
      count: productionSystems?.length,
      component: (
        <ProductionSystem
          lpId={props?.lpData?._id}
          data={productionSystems}
          buttonVisible={true}
          reFetch={props?.reFetch}
        />
      ),
    },
    ...Object.keys(categories).map((category: string) => ({
      label: category,
      count:
        category === 'Poultry Batches'
          ? props?.alliedActivityData?.poultryBatches?.length
          : category === 'Aquaculture'
            ? props?.alliedActivityData?.aquacrops?.length
            : category === 'Livestock'
              ? props?.alliedActivityData?.cows?.length +
              props?.alliedActivityData?.goats?.length +
              props?.alliedActivityData?.sheeps?.length
              : categories?.[category]?.length || 0,
      component: (
        <>
          {category === 'Poultry Batches' ? (
            <PoultryBatchDetails data={props} title={category} reFetch={props?.reFetch} />
          ) : category === 'Livestock' ? (
            <LiveStockDetails data={props} title={category} reFetch={props?.reFetch} />
          ) : category === 'Aquaculture' ? (
            <Aquaculture
              data={props}
              title={category}
              reFetch={props?.reFetch}
              handleFormSubmit={props.handleFormSubmit}
            />
          ) : (
            <CategoryDetails
              data={categories?.[category]}
              handleFormSubmit={props.handleFormSubmit}
              title={category}
              Editor={LandParcelAlliedActEditor}
              lpMap={props.lpData?.map}
            />
          )}
        </>
      ),
    })),
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
    : [
      <CategoryDetails
        key={1}
        data={[]}
        handleFormSubmit={props.handleFormSubmit}
        title='General'
        Editor={LandParcelAlliedActEditor}
      />,
    ];
  return (
    <>
      <VerticalTabs labels={labels} panels={panels} isCountPresent />
    </>
  );
}
