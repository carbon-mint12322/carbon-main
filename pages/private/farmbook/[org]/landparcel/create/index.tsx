/* global google */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { SxProps } from '@mui/material';

import withAuth from '~/components/auth/withAuth';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import { useAlert } from '~/contexts/AlertContext';

import LandParcelForm from '~/container/landparcel/form';
import { LandParcelFormData, PageConfig } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import {
  coordinateStringToCoordinateObject,
  polygonToMapCenter,
} from '~/utils/coordinatesFormatter';
import { calculatePolygonArea } from '~/utils/mapUtils';

export { default as getServerSideProps } from '~/utils/ggsp';

interface CreateLandParcelProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: any;
}

function CreateLandParcel(props: CreateLandParcelProps) {
  const { changeRoute, getApiUrl } = useOperator();
  const { openToast } = useAlert();
  const [formData, setFormData] = useState<LandParcelFormData>({});
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Add Land Parcel',
    isTitlePresent: true,
    isMainBtnPresent: false,
    isSubBtnPresent: false,
  });

  const handleFormSubmit = async (
    data: LandParcelFormData,
    handleSubmit: (value: boolean) => void,
  ) => {
    if (formData?.id) {
      return updateLandParcel(data, handleSubmit);
    }
    return createLandParcel(data, handleSubmit);
  };

  const handleOnSubmit = async (
    data: LandParcelFormData,
    handleSubmit: (value: boolean) => void,
  ) => {
    await updateLandParcel(data, handleSubmit, true);
  };

  const createLandParcel = async (
    data: LandParcelFormData,
    handleSubmit: (value: boolean) => void,
  ) => {
    try {
      handleSubmit(true);
      const res: {
        data: {
          acknowledged: boolean;
          insertedId: string;
        };
      } = await axios.post(getApiUrl('/landparcel'), {
        ...data,
        status: 'Draft',
        climateScore: 0,
        complianceScore: 0,
      });
      if (res) {
        setFormData({
          ...data,
          id: res?.data?.insertedId,
        });
        return true;
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Something went wrong');
      return false;
    } finally {
      handleSubmit(false);
    }
  };

  const updateLandParcel = async (
    data: LandParcelFormData,
    handleSubmit: (value: boolean) => void,
    finalSubmit?: boolean,
  ) => {
    try {
      handleSubmit(true);
      if (data?.map) {
        let paths = coordinateStringToCoordinateObject(data?.map);
        let acres = calculatePolygonArea({ paths: paths });
        let coordinates = polygonToMapCenter(paths[0]);
        data.calculatedAreaInAcres = acres?.toFixed(2);
        data.location = coordinates;
      }
      const res = await axios.post(getApiUrl(`/landparcel/${formData.id}`), data);
      if (res) {
        setFormData({
          ...formData,
          ...data,
        });
        if (finalSubmit) {
          openToast('success', 'Land Parcel Saved');
          changeRoute('/landparcel/list');
        }
        return true;
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Something went wrong');
      return false;
    } finally {
      handleSubmit(false);
    }
  };

  const onRequiredFieldComplete = (
    data: LandParcelFormData,
    handleSubmit: (value: boolean) => void,
  ) => {
    setTitleBarData({
      ...titleBarData,
      mainBtnTitle: 'Submit Land Parcel',
      isMainBtnPresent: true,
    });
  };

  return (
    <>
    <TitleBarGeneric
        titleBarData={titleBarData}
      />
      <LandParcelForm
        onFormSubmit={handleFormSubmit}
        onSubmit={handleOnSubmit}
        onRequiredFieldComplete={onRequiredFieldComplete}
      />
    </>
  
  );
}

export default withAuth(CreateLandParcel);
