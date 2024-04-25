import React, { useState, Suspense, useRef, useCallback } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextProgress from 'next-progress';

import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  Modal,
} from '@mui/material';

import CardView from '~/components/ui/CardView';

import AttachFileIcon from '@mui/icons-material/AttachFile';

import { useTitleBar } from '~/contexts/TitleBar/TitleBarProvider'; 
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import { AppConfigContext } from '~/contexts/AppConfigContext';

import { EventEditor } from '~/gen/workflows/index-fe';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import { useEventCxt } from '~/contexts/EventContext';
import EventAttachmentDataContext from '~/contexts/EventAttachmentDataContext';

import { createEventRQ } from '~/frontendlib/model-lib/workflow';
import MutationWrapper from '~/components/ui/MutationWrapper';

export { default as getServerSideProps } from '~/utils/ggsp';
import { navigateToSuperParentPage } from '~/frontendlib/util';
import _ from 'lodash';
import axios from 'axios';

// const UploadEvent = dynamic(() => import('~/components/UploadEvent'));

const EventsGallery = dynamic(() => import('~/components/EventsGallery'));

export default function CreateEvent(props: any) {
  const { getAPIPrefix } = useOperator();
  const [isUpload, setIsUpload] = React.useState(false);
  const [uploadedFile, setUploadedFile] = useState<any[]>([]);
  const router = useRouter();
  const { images, audio, documents, notes, clearState } = useEventCxt();

  const [selectedImages, setSelectedImages] = useState(images || []);
  const [selectedDocument, setSelectedDocument] = useState(documents || []);
  const [selectedAudio, setSelectedAudio] = useState(audio || []);
  const [selectedNotes, setSelectedNotes] = useState(notes || []);

  const { setTitleBarData } = useTitleBar();

  const { isLoading: loading, data } = useFetch<any[]>(
    `${getAPIPrefix()}/event?productionSystemId=${router.query.id}&category=Submission`,
  );

  const getProductionSystemData = async () => {
    try {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/productionsystem/${router.query.id}`);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const setCreateEventTitle = () => {
    getProductionSystemData().then((res) => {
      const productionSystemData = res?.data;
      setTitleBarData({
        ...initialTitleBarContextValues.titleBarData,
        isTitleBarPresent: true,
        title: 'New Event',
        subTitle:
          productionSystemData?.name +
          ' • ' +
          productionSystemData?.category +
          ' • ' +
          productionSystemData?.landParcels[0].name,
        subBtnColor: 'grey',
        isTitlePresent: true,
        isSubTitlePresent: true,
        isMainBtnPresent: false,
        isSubBtnPresent: false,
      });
    });
  };

  React.useEffect(() => {
    setCreateEventTitle();
    return () => clearState();
  }, []);

  const responsiveCard = { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 };
  const itemsLenth =
    [...(selectedAudio || [])].length +
    [...(selectedNotes || [])].length +
    [...(selectedImages || [])].length +
    [...(selectedDocument || [])].length;

  const handleUploadOpen = () => {
    setIsUpload(true);
  };

  const handleUploadClose = () => {
    setIsUpload(false);
  };

  const handleUploadBtnClick = async (data: any, filesDataURL: string) => {
    const cardViewProps = {
      ...data,
    };
    setUploadedFile((uploadedFiles) => [
      ...uploadedFiles,
      {
        filesDataURL,
        cardViewProps,
      },
    ]);
  };

  const uploadModelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '75%',
    maxHeight: '85%',
    bgcolor: 'background.paper',
    border: '1px solid #EFEFEF',
    boxShadow: 24,
    p: 4,
    overflow: 'scroll',
  };

  return (
    <EventAttachmentDataContext
      url={`/event?productionSystemId=${router.query.id}&category=Submission`}
    >
      <Grid
        container
        spacing={2}
        sx={{ borderTop: '1px solid rgba(196, 196, 196, 0.6)', marginTop: '24px' }}
      >
        <Modal open={isUpload} onClose={handleUploadClose}>
          <Box sx={uploadModelStyle}>
            <EventsGallery
              data={data}
              uploadedFile={uploadedFile}
              selectedImages={selectedImages}
              selectedDocument={selectedDocument}
              selectedAudio={selectedAudio}
              selectedNotes={selectedNotes}
              onImageSelect={setSelectedImages}
              onDocumentSelect={setSelectedDocument}
              onAudioSelect={setSelectedAudio}
              onNotesSelect={setSelectedNotes}
              handleMainBtnClick={handleUploadClose}
              handleSubBtnClick={handleUploadClose}
              handleUploadBtnClick={handleUploadBtnClick}
            />
          </Box>
        </Modal>
        <Grid
          xs={7}
          sx={{ borderRight: '1px solid rgba(196, 196, 196, 0.6)', padding: '32px 36px' }}
        >
          <AppConfigContext.Provider value={props?.pageConfig}>
            <Content pageProps={props} selectedImages={selectedImages} />
          </AppConfigContext.Provider>
        </Grid>
        <Grid xs={5} sx={{ padding: '32px 36px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <div>
              <Typography variant='h5' sx={{ fontSize: '18px' }}>
                Evidence Attached
              </Typography>
              <Typography variant='subtitle2' color='textSecondary'>
                {itemsLenth} Media files attached
              </Typography>
            </div>
            <IconButton
              sx={{ bgcolor: 'common.white', borderRadius: '8px' }}
              onClick={handleUploadOpen}
            >
              <AttachFileIcon
                sx={{
                  fontSize: '24px',
                  color: 'inProgress.contrastText',
                  transform: 'rotate(45deg)',
                }}
              />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {Array.from(selectedAudio || [])?.map((record: any, index: number) => (
                <Grid item {...responsiveCard} key={index}>
                  <CardView
                    type='audio'
                    link={record?.link}
                    lat={record?.metadata?.location?.lat}
                    lng={record?.metadata?.location?.lng}
                    timeStamp={record?.metadata?.timestamp}
                    notes={record?.notes}
                    createdBy={record?.metadata?.createdBy}
                    selectCheck={false}
                  />
                </Grid>
              ))}

              {Array.from(selectedImages || [])?.map((record: any, index: number) => (
                <Grid item {...responsiveCard} key={index}>
                  <CardView
                    type='image'
                    link={record?.link}
                    lat={record?.metadata?.location?.lat}
                    lng={record?.metadata?.location?.lng}
                    timeStamp={record?.metadata?.timestamp}
                    notes={record?.notes}
                    createdBy={record?.metadata?.createdBy}
                    selectCheck={false}
                    isPreviewAllowed
                  />
                </Grid>
              ))}

              {Array.from(selectedDocument || [])?.map((record: any, index: number) => (
                <Grid item {...responsiveCard} key={index}>
                  <CardView
                    type='document'
                    link={record?.link}
                    lat={record?.metadata?.location?.lat}
                    lng={record?.metadata?.location?.lng}
                    timeStamp={record?.metadata?.timestamp}
                    notes={record}
                    createdBy={record?.metadata?.createdBy}
                    selectCheck={false}
                    isPreviewAllowed
                  />
                </Grid>
              ))}
              {Array.from(selectedNotes || [])?.map((record: any, index: number) => (
                <Grid item {...responsiveCard} key={index}>
                  <CardView
                    type='text'
                    // lat={items?.location?.lat}
                    // lng={items?.location?.lng}
                    // timeStamp={items?.createdAt}
                    notes={record.notes}
                    // createdBy={record?.metadata?.createdBy}
                    selectCheck={false}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </EventAttachmentDataContext>
  );
}

const workflowNames = [
  ['sheepFeedPSLifecycle', 'sheepMedicationPSLifecycle', 'sheepVaccinationPSLifecycle'],
  ['sheepSalePSLifecycle'],
];

function Content(props: any) {
  const { selectedImages } = props;
  const router = useRouter();
  const [selectedMainEvent, setSelectedMainEvent] = useState(0);
  const [selectedSubEvent, setSelectedSubEvent] = useState(0);
  const { getAPIPrefix, getApiUrl } = useOperator();

  const handleTitleChange = (evt: any) => {
    setSelectedSubEvent(0), setSelectedMainEvent(evt.target.value);
  };

  const wfName = workflowNames[selectedMainEvent][selectedSubEvent];
  const productionSystemId: string | undefined = router?.query?.id as string;

  const handleSubTitleChange = (evt: any) => setSelectedSubEvent(evt.target.value);

  if (!productionSystemId) {
    return <div> Production System ID is required </div>;
  }

  if (!wfName) {
    return <div> Event is not defined </div>;
  }

  const Events = ['Health and Medication', 'Sales'];

  const EventSubTitles = [['Feed', 'Medication', 'Vaccination'], ['None']];

  const evidences = Array.from(selectedImages).map((img: any) => img.link);

  const submitMutation = createEventRQ({ onSuccess: navigateToSuperParentPage(router) });
  const { mutate } = submitMutation;

  async function sheepsFilter() {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/sheep`);

    // Filter the data array based on the productionSystemId
    const filteredData = res.data.filter(
      (sheep: any) => sheep.productionSystem === productionSystemId,
    );

    return filteredData;
  }

  const formContext: any = {
    getApiUrl,
    foreignObjectLoader:
      wfName === 'sheepFeedPSLifecycle' ||
        wfName === 'sheepMedicationPSLifecycle' ||
        wfName === 'sheepVaccinationPSLifecycle' ||
        wfName === 'sheepSalePSLifecycle'
        ? sheepsFilter
        : undefined,
  };

  function createEvent(input: any) {
    return mutate({
      ...input,
      domainSchemaName: 'productionsystem',
      domainInstanceId: productionSystemId,
    });
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', gap: '2rem' }}>
        <FormControl fullWidth>
          <InputLabel htmlFor='Event'>Select event category</InputLabel>
          <Select
            value={selectedMainEvent}
            label='Select event category'
            onChange={handleTitleChange}
            id='Editor'
          >
            {Events.map((EventTitle: string, index: number) => (
              <MenuItem value={index} key={`eventTitle${index}`}>
                {EventTitle}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {EventSubTitles[selectedMainEvent][0] !== 'None' && (
          <FormControl fullWidth>
            <InputLabel htmlFor='Editor'>Select event</InputLabel>
            <Select
              value={selectedSubEvent}
              label='Select event'
              onChange={handleSubTitleChange}
              id='Editor'
            >
              {EventSubTitles[selectedMainEvent].map((EventSubTitle: string, index: number) => (
                <MenuItem value={index} key={`eventSubTitle${index}`}>
                  {EventSubTitle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <Paper elevation={4} sx={{ padding: 4 }}>
        <Suspense fallback={<NextProgress delay={10} options={{ showSpinner: true }} />}>
          <MutationWrapper mutation={submitMutation}>
            <EventEditor
              onSubmit={createEvent}
              wfName={wfName}
              formContext={formContext}
              domainObjectId={productionSystemId}
              evidences={evidences}
            />
          </MutationWrapper>
        </Suspense>
      </Paper>
    </Stack>
  );
}
