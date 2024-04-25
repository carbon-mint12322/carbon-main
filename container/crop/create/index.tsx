import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const CropEditor = dynamic(import('~/gen/data-views/add_crop/add_cropEditor.rtml'));
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { Grid } from '@mui/material';

import SoilInfoSummary from '~/gen/data-views/soilInfoSummary/soilInfoSummaryEditor.rtml';

import { CropFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

const styles = {
  cardTitleBarStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardStyle: {
    padding: '2px 20px',
  },
};

interface CropFormProps {
  lpData: LandParcel;
  handleSubmit: () => void;
  reFetch?: () => void;
  handleClose: () => void;
}

function CropForm({ lpData, handleSubmit, reFetch, handleClose }: CropFormProps) {
  const router = useRouter();
  const landParcelId = router.query.id;
  const csFilter = {
    landParcel: landParcelId
  };
  const plotFilter = {
    landParcel: landParcelId,
  };
  const popFilter = {};
  const masterCropFilter = {};
  const [submit, setSubmit] = useState<boolean>(false);

  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: CropFormData) => {
    try {
      setSubmit(true);
      data = {
        ...data,
        landParcel: {
          id: lpData?._id,
          name: lpData?.name,
        },
        farmer: {
          id: lpData?.farmer?.id,
          name:
            (lpData?.farmer?.personalDetails?.firstName || '') +
            (lpData?.farmer?.personalDetails?.lastName
              ? ' ' + lpData.farmer.personalDetails.lastName
              : ''),
        },
        status: 'Draft',
      };
      const res = await axios.post(getApiUrl('/crop'), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Crop Saved');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.response?.data.error || error?.message || 'Something went wrong');
    } finally {
      setSubmit(false);
    }
  };

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'croppingSystem': // this key is defined as ui:options in yaml
          return csFilter;
        case 'plot': // this key is defined as ui:options in yaml
          return plotFilter;
        case 'pop': // this key is defined as ui:options in yaml
          return popFilter;
        case 'mastercrop': // this key is defined as ui:options in yaml
          return masterCropFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CropEditor
            onSubmit={handleFormSubmit}
            formContext={formContext}
            onCancelBtnClick={handleClose}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ borderLeft: '1px solid grey', pl: 2 }}>
            <Paper sx={{ ...styles.cardStyle, marginTop: '0px' }} elevation={0} square={true}>
              <SoilInfoSummary
                formData={{
                  data: {
                    soilInfo: lpData?.soilInfo,
                  },
                }}
                readonly={true}
              />
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </ModalCircularLoader>
  );
}

export default CropForm;
