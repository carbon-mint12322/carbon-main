import React, { useEffect, useRef, useState } from 'react';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LocationIcon from '@mui/icons-material/LocationOn';
import withAuth from '~/components/auth/withAuth';
import { useTitleBar } from '~/contexts/TitleBar/TitleBarProvider'; 
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import globalStyles from '~/styles/theme/brands/styles';
import CircularLoader from '~/components/common/CircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import { useRouter } from 'next/router';
import { getEventSchema } from '~/gen/workflows/index-fe';
import ReadOnlyView from '~/components/lib/ReadOnlyRjsf';
import ValidationWorkflowView from '~/components/workflow/ValidationWorkflowView';
export { default as getServerSideProps } from '~/utils/ggsp';
import styles from '~/styles/theme/brands/styles';

function EventList() {
  const { getAPIPrefix } = useOperator();
  const [openVerifyFarmerModal, setOpenVerifyFarmerModal] = useState<boolean>(false);

  const { setTitleBarData, setHandleMainBtnClick } = useTitleBar();
  const router = useRouter();
  const { org, id: sheepId, eventId } = router.query;
  const API_URL = getAPIPrefix() + `/event/${eventId}`;
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);
  const handleClose = () => {
    setOpenVerifyFarmerModal(false);
  };

  React.useEffect(() => {
    setTitleBarData({
      ...initialTitleBarContextValues.titleBarData,
      isTitleBarPresent: true,
      title: 'Sheep Event Details',
      mainBtnTitle: 'Review',
      isTitlePresent: true,
      isSubTitlePresent: false,
      isSearchBarPresent: false,
      isMainBtnPresent: true,
    });
    setHandleMainBtnClick(() => {
      return setOpenVerifyFarmerModal(true);
    });
  }, [data]);

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 3,
      }}
    >
      <CircularLoader value={loading}>
        <Box style={globalStyles.dataGridLayer}>
          <DetailView
            data={data}
            handleClose={handleClose}
            openVerifyFarmerModal={openVerifyFarmerModal}
          />
        </Box>
      </CircularLoader>
    </Paper>
  );
}

export default withAuth(EventList);

function DetailView({ data, handleClose, openVerifyFarmerModal }: any) {
  const [eventSchema, setEventSchema] = useState(null);
  const [isPhotoEvent, setIsPhotoEvent] = useState(false);
  const router = useRouter();
  const { eventId } = router.query;
  const eventName: string = data?.name;
  const parentRef = useRef(null);
  useEffect(() => {
    if (!eventName) {
      return;
    }
    getEventSchema(eventName)
      .then((schema) => {
        setEventSchema(schema);
      })
      .catch((err) => {
        console.debug(err);
        setIsPhotoEvent(true);
      });
  }, [data, eventName]);
  if (!data) {
    return null;
  }
  if (isPhotoEvent) {
    return <PhotoSubmissionView data={data} />;
  }
  if (!eventSchema) {
    return <pre>No schema for event {eventName}!</pre>;
  }
  function reload() {
    console.log('TODO - reload');
  }
  return (
    <>
      <ReadOnlyView formData={data.details} schema={eventSchema} />
      <>
        <Grid container>
          <Grid ref={parentRef} item xs={10}>
            <Drawer
              sx={styles.rightDrawer(parentRef)}
              anchor={'right'}
              open={openVerifyFarmerModal}
              onClose={handleClose}
            >
              <div style={{ padding: 20 }}>
                <ValidationWorkflowView
                  domainSchemaName={'event'}
                  domainObjectId={eventId as string}
                  wfId={data?.validationWorkflowId}
                  reload={reload}
                  closeDrawer={handleClose}
                />
              </div>
            </Drawer>
          </Grid>
        </Grid>
      </>
    </>
  );
}
function PhotoSubmissionView({ data }: any) {
  const photoRecords: any[] = data?.photoRecords || [];
  return (
    <div>
      Photos:
      <div>
        {photoRecords.map((evidence: any, i: number) => (
          <PhotoEvidence
            key={i}
            location={data?.location}
            user={data?.createdBy}
            ts={data?.createdAt}
            evidence={evidence}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoEvidence({ user, ts, location, evidence }: any) {
  return (
    <Card sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Typography component='div' variant='h5'>
            Photo Submission
          </Typography>
          <Typography variant='body1' color='text.secondary' component='div'>
            User: {user}
          </Typography>
          <Typography variant='body1' color='text.secondary' component='div'>
            date: {ts}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label='Location'>
            <LocationIcon /> [ {location.lat}, {location.lng} ]
          </IconButton>
        </Box>
      </Box>
      <CardMedia
        component='img'
        sx={{ width: 151 }}
        image={evidence.link}
        alt='Live from space album cover'
      />
    </Card>
  );
}
