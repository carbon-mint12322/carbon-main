import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';

import {
  Button,
  Box,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
  StepConnector,
  stepConnectorClasses,
  styled,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import { StepIconProps } from '@mui/material/StepIcon';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import ApprovalPopup from '~/container/landparcel/create/ApprovalPopup';

import If from '~/components/lib/If';
import ModalCircularLoader from '~/components/common/ModalCircularLoader';

import { useUser } from '~/contexts/AuthDialogContext';

import styles from '~/styles/theme/brands/styles';
import { LandParcelFormData } from '~/frontendlib/dataModel';

import { coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import { useOperator } from '~/contexts/OperatorContext';

const LandBasicInfoEditor = dynamic(
  import('~/gen/data-views/landparcel_basicinfo/landparcel_basicinfoEditor.rtml'),
);
const LandownerInfoEditor = dynamic(
  import('~/gen/data-views/landparcel_landowner/landparcel_landownerEditor.rtml'),
);
const LandMapEditor = dynamic(
  import('~/gen/data-views/landparcel_map/landparcel_mapEditor.rtml'),
);

export const requiredSteps = [
  { label: 'Land Parcel Info', description: 'Required', key: 'basicinfo' },
  { label: 'Land Owner Info', description: 'Required', key: 'landowner' },
  { label: 'Map Land Parcel Boundaries', description: 'Required', key: 'map' },
];

const Connector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#eaeaf0',
  },
}));

const StepIconRoot = styled(Box)<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
  color: '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: theme.palette.primary.main,
  }),
  '& .StepIcon-completedIcon': {
    color: theme.palette.success.main,
    zIndex: 1,
    fontSize: 24,
  },
  '& .StepIcon-circle': {
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function StepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <StepIconRoot ownerState={{ active }} className={className} sx={{ cursor: 'pointer' }}>
      {completed && !active ? (
        <CheckCircleIcon className='StepIcon-completedIcon' />
      ) : (
        <div className='StepIcon-circle' />
      )}
    </StepIconRoot>
  );
}

export interface LandParcelFormProps {
  onSubmit?: (formData: LandParcelFormData, handleSubmit: (value: boolean) => void) => void;
  onFormSubmit?: (
    formData: LandParcelFormData,
    handleSubmit: (value: boolean) => void,
  ) => Promise<boolean | undefined>;
  currentStep?: number;
  data?: LandParcelFormData;
  onRequiredFieldComplete?: (
    formData: LandParcelFormData,
    handleSubmit: (value: boolean) => void,
  ) => void;
}

function LandParcelForm({
  onSubmit = () => null,
  onFormSubmit = () =>
    new Promise<boolean | undefined>((resolve) => {
      resolve(true);
    }),
  onRequiredFieldComplete = () => null,
  currentStep,
  data,
}: LandParcelFormProps) {
  const [activeStep, setActiveStep] = useState(currentStep || 0);
  const [submit, setSubmit] = useState<boolean>(false);
  const [necessaryFilled, setNecessaryFilled] = useState(false);
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [stepCount, setStepCount] = useState(currentStep || 0);
  const [formData, setFormData] = useState<LandParcelFormData>(data || {});
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useUser();
  const [completedSteps, setCompletedSteps] = useState<any>({});
  const { getAPIPrefix } = useOperator();
  const MAP_API_URL = getAPIPrefix() + '/landparcel-maps';
  const [polygonData, setPolygonData] = useState<any[]>([]);

  useEffect(() => {
    if (activeStep === 2) {
      try {
        axios.get(MAP_API_URL).then((res) => {
          setPolygonData(res?.data?.map((item: any) => {
            return {
              id: item?.id,
              paths: coordinateStringToCoordinateObject(item?.map),
              options: { strokeColor: '#EE4B2B', strokeOpacity: 1, strokeWeight: 4, zIndex: 2, clickable: false },
            };
          })
            .filter((item: any) => item?.id !== data?.id))
        })
      } catch (err) {
        console.error(err)
      }
    }
  }, [activeStep])

  useEffect(() => {
    if (currentStep) {
      if (currentStep >= 0) {
        let completed: any = {};
        for (let i = 0; i < currentStep; i++) {
          completed[i] = true;
        }
        setCompletedSteps(completed);
      }
      if (currentStep != activeStep) {
        setActiveStep(currentStep);
        setStepCount(currentStep);
      }
      if (currentStep == 3) setNecessaryFilled(true);
    }
  }, [currentStep]);

  const handleStepForward = () => {
    setCompletedSteps({ ...completedSteps, [activeStep]: true });
    setActiveStep(activeStep + 1);
    setStepCount(stepCount + 1);
    if (activeStep + 1 == 3) {
      setNecessaryFilled(true);
      onRequiredFieldComplete(formData, handleSubmit);
    }
  };

  const scrollToTop = () => {
    ref?.current?.scrollTo(0, 0);
  };

  const onHandleBack = (e: any, index: any, required?: any) => {
    const stepNumber = required ? index : index + 2;
    if (stepCount <= stepNumber) return;
    !required && necessaryFilled ? setNecessaryFilled(true) : setNecessaryFilled(false);
    required ? setActiveStep(index) : setActiveStep(index + 3);
  };

  const handleOnFormSubmit = async (_data: LandParcelFormData) => {
    setFormData({
      ...formData,
      ..._data,
    });

    const result = await onFormSubmit(
      {
        ..._data,
      },
      handleSubmit,
    );
    if (result) {
      handleStepForward();
      scrollToTop();
    }
  };

  const handleSubmit = (value: boolean) => {
    setSubmit(value);
  };

  const onSubmitForm = (_data: LandParcelFormData) => {
    setFormData({
      ...formData,
      ..._data,
    });

    onSubmit(
      {
        ..._data,
      },
      handleSubmit,
    );
  };


  async function landownerFilter() {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/landowner`);

    return res.data;
  }

  const formContext: any = {
    foreignObjectLoader: landownerFilter,
  };

  const renderForm = () => {
    const props = {
      mainBtnLabel: 'Save & Continue',
      onSubmit: (_data: LandParcelFormData) => handleOnFormSubmit(_data),
    };

    switch (activeStep) {
      case 0:
        return (
          <LandBasicInfoEditor
            {...props}
            formData={{
              data: {
                name: formData?.name,
                surveyNumber: formData?.surveyNumber,
                areaInAcres: formData?.areaInAcres,
                passbookNumber: formData?.passbookNumber,
                landOwnershipDocument: formData?.landOwnershipDocument,
                landGovtMap: formData?.landGovtMap,
                landSupportDocument: formData?.landSupportDocument,
                address: formData?.address,
                adjacentLands: formData?.adjacentLands,
              },
            }}
          />
        );

      case 1:
        return (
          <LandownerInfoEditor
            {...props}
            formData={{
              data: {
                landowners: formData?.landowners,
                landownerRef: formData?.landownerRef || 'No',
                landOwner: formData?.landOwner,
              },
            }}
            formContext={formContext}
          />
        );

      case 2:
        return (
          <LandMapEditor
            {...props}
            formData={{
              data: {
                map: formData?.map,
                location: formData?.location,
              },
            }}
            formContext={{ polygon: polygonData }}
            onSubmit={(_data: LandParcelFormData) => {
              onSubmitForm({
                ..._data,
              });
            }}
            mainBtnLabel='Submit'
          />
        );

      default:
        return null;
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Grid
        container
        flexWrap='nowrap'
        rowGap='24px'
        overflow='auto'
        height='calc(100% - 128px)'
        px={{ xs: 0, md: 3, lg: 8 }}
        mt={4}
      >
        <If value={showApprovalPopup}>
          <ApprovalPopup
            open={showApprovalPopup}
            handleClose={() => setShowApprovalPopup(!showApprovalPopup)}
          />
        </If>

        <Grid container spacing={4} overflow='auto' ref={ref}>
          <Grid
            container
            direction={{ xs: 'row', sm: 'column' }}
            rowGap='10px'
            overflow='auto'
            item
            xs={12}
            sm={3}
          >
            <If value={(mobileView && !necessaryFilled) || !mobileView}>
              <Grid>
                <Grid>
                  <Typography>FOR VERIFICATION</Typography>
                </Grid>
                <Grid>
                  <Stepper
                    activeStep={activeStep}
                    orientation={mobileView ? 'horizontal' : 'vertical'}
                    connector={<Connector />}
                    alternativeLabel={mobileView}
                    sx={{
                      pt: {
                        xs: 2,
                        md: 0,
                      },
                    }}
                  >
                    {requiredSteps.map((step, index) => (
                      <Step
                        key={step.label}
                        onClick={(e) => onHandleBack(e, index, 'validation')}
                        completed={completedSteps[index] || false}
                      >
                        <StepLabel
                          StepIconComponent={StepIcon}
                          optional={<Typography variant='caption'>{step.description}</Typography>}
                        >
                          {step.label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>
              </Grid>
            </If>
          </Grid>

          <Grid
            item
            container
            direction='column'
            flexWrap='nowrap'
            rowGap='24px'
            sx={styles.formFields}
            xs={12}
            sm={9}
          >
            <Grid container flexWrap='nowrap' justifyContent='space-between'>
              <Grid container>
                <Typography variant={'h5'}>{requiredSteps[activeStep]?.label}</Typography>
              </Grid>

              {activeStep < 9 && (
                <Grid container flexWrap='nowrap' gap='8px' justifyContent='flex-end'>
                  {necessaryFilled && (
                    <Button
                      sx={{ backgroundColor: '#FFEBD6', color: 'black' }}
                      variant='contained'
                      onClick={handleStepForward}
                    >
                      Skip
                    </Button>
                  )}
                  {/* <Button variant='contained' onClick={handleStepForward}>
                  Save & Continue
                </Button> */}
                </Grid>
              )}
            </Grid>

            {renderForm()}
          </Grid>
        </Grid>
      </Grid>
    </ModalCircularLoader>
  );
}

export default LandParcelForm;
