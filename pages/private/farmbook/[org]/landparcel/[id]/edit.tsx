import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { SxProps } from '@mui/material';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import { useAlert } from '~/contexts/AlertContext';

import LandParcelForm, { requiredSteps } from '~/container/landparcel/form';

import { LandParcel, LandParcelFormData, PageConfig } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import CircularLoader from '~/components/common/CircularLoader';
import {
  coordinateStringToCoordinateObject,
  polygonToMapCenter,
} from '~/utils/coordinatesFormatter';
import { calculatePolygonArea } from '~/utils/mapUtils';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditLandParcelProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: LandParcel;
}

function EditLandParcel(props: EditLandParcelProps) {
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const [step, setStep] = useState(0);
  const { openToast } = useAlert();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Edit Land Parcel',
    isTitlePresent: true,
    isMainBtnPresent: false,
  });
  const { isLoading, data } = useFetch<LandParcel[]>(
    `${getAPIPrefix()}/landparcel/${router.query.id}`,
  );

  useEffect(() => {
    const steps = [...requiredSteps];
    const index = steps.findIndex((stepData) => stepData?.key === router?.query?.step);
    if (index > -1) {
      setStep(index);
    }
  }, [router?.query]);

  const handleFormSubmit = async (
    formData: LandParcelFormData,
    handleSubmit: (value: boolean) => void,
  ) => {
    return updateLandParcel({ ...formData }, handleSubmit);
  };

  const updateLandParcel = async (
    formData: LandParcelFormData,
    handleSubmit: (value: boolean) => void,
    finalSubmit?: boolean,
  ) => {
    try {
      handleSubmit(true);
      if (formData?.map) {
        let paths = coordinateStringToCoordinateObject(formData?.map);
        let acres = calculatePolygonArea({ paths: paths });
        let coordinates = polygonToMapCenter(paths[0]);

        formData.calculatedAreaInAcres = acres?.toFixed(2);
        formData.location = coordinates;
      }

      const payload: any = {
        ...formData,
      };
      delete payload['_id'];
      const res = await axios.post(getApiUrl(`/landparcel/${data?.[0]?._id}`), {
        ...payload,
      });
      if (res) {
        if (finalSubmit) {
          openToast('success', 'Land Parcel Saved');
          changeRoute(`/landparcel/${data?.[0]?._id}`);
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

  const handleOnSubmit = async (
    _data: LandParcelFormData,
    handleSubmit: (value: boolean) => void,
  ) => {
    updateLandParcel(_data, handleSubmit, true);
  };

  const onRequiredFieldComplete = (
    _data: LandParcelFormData,
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
      <CircularLoader value={isLoading}>
        <LandParcelForm
          onFormSubmit={handleFormSubmit}
          onSubmit={handleOnSubmit}
          onRequiredFieldComplete={onRequiredFieldComplete}
          currentStep={step}
          data={data?.[0] || {}}
        />
      </CircularLoader>
    </>
  );
}

export default EditLandParcel;
