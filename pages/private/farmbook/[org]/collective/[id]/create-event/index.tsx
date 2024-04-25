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

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import { AppConfigContext } from '~/contexts/AppConfigContext';

import getWorkflowDef, { EventEditor } from '~/gen/workflows/index-fe';
import { useSet } from '~/utils/customHooks';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import { useEventCxt } from '~/contexts/EventContext';
import { startWorkflowRQ } from '~/frontendlib/model-lib/workflow';
import MutationWrapper from '~/components/ui/MutationWrapper';
import { navigateToParentPage } from '~/frontendlib/util';

export { default as getServerSideProps } from '~/utils/ggsp';

// const UploadEvent = dynamic(() => import('~/components/UploadEvent'));

const EventsGallery = dynamic(() => import('~/components/EventsGallery'));

export default function CreateEvent(props: any) {
  const [isUpload, setIsUpload] = React.useState(false);
  const router = useRouter();
  const { images, audio, documents, notes, clearState } = useEventCxt();
  const [selectedImages, , , toggleSelectedImages, clearSelectedImages] = useSet(images);
  const [selectedDocument, , , toggleSelectedDocument, clearSelectedDocument] = useSet(documents);
  const [selectedAudio, , , toggleSelectedAudio, clearSelectedAudio] = useSet(audio);
  const [selectedNotes, , , toggleSelectedNotes, clearSelectedNotes] = useSet(notes);
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Create New Event',
    mainBtnTitle: 'Create Event',
    subBtnTitle: 'Save Draft',
    subBtnColor: 'grey',
    isTitlePresent: true,
    isMainBtnPresent: false,
    isSubBtnPresent: false,
  });
  const [uploadTitleBarData, setUploadTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Select Files',
    mainBtnTitle: 'Done',
    subBtnTitle: 'Cancel',
    subBtnColor: 'grey',
    isUploadBtnPresent: true,
    isMoreIconPresent: true,
    isTitlePresent: true,
    isMainBtnPresent: true,
    isSubBtnPresent: true,
  });
  const { changeRoute, getAPIPrefix } = useOperator();

  const { isLoading: loading, data } = useFetch<any[]>(
    `${getAPIPrefix()}/event/list?category=Submission`,
  );


  const responsiveCard = { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 };
  const itemsLenth =
    selectedAudio.size + selectedDocument.size + selectedImages.size + selectedNotes.size;

  const handleUploadOpen = () => {
    setIsUpload(true);
  };

  const handleUploadClose = () => {
    setIsUpload(false);
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
    <Grid
      container
      spacing={2}
      sx={{ borderTop: '1px solid rgba(196, 196, 196, 0.6)', marginTop: '24px' }}
    >
      <TitleBarGeneric
        titleBarData={titleBarData}
      />
      <Modal open={isUpload} onClose={handleUploadClose}>
        <Box sx={uploadModelStyle}>
          <EventsGallery
            data={data}
            selectedImages={selectedImages}
            selectedDocument={selectedDocument}
            selectedAudio={selectedAudio}
            selectedNotes={selectedNotes}
            onImageSelect={toggleSelectedImages}
            onDocumentSelect={toggleSelectedDocument}
            onAudioSelect={toggleSelectedAudio}
            onNotesSelect={toggleSelectedNotes}
          />
        </Box>
      </Modal>
      <Grid xs={7} sx={{ borderRight: '1px solid rgba(196, 196, 196, 0.6)', padding: '32px 36px' }}>
        <AppConfigContext.Provider value={props?.pageConfig}>
          <Content pageProps={props} />
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
            {Array.from(selectedAudio)?.map((record: any, index: number) => (
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

            {Array.from(selectedImages)?.map((record: any, index: number) => (
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
                />
              </Grid>
            ))}

            {Array.from(selectedDocument)?.map((record: any, index: number) => (
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
                />
              </Grid>
            ))}
            {Array.from(selectedNotes)?.map((record: any, index: number) => (
              <Grid item {...responsiveCard} key={index}>
                <CardView
                  type='text'
                  // lat={items?.location?.lat}
                  // lng={items?.location?.lng}
                  // timeStamp={items?.createdAt}
                  notes={record}
                  // createdBy={record?.metadata?.createdBy}
                  selectCheck={false}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

const workflowNames = [
  [
    'certificationBodyInspectionReportWorkflow',
    'certificationBodyAuditingReportWorkflow',
    'operatorInternalAuditingReportWorkflow',
    'operatorInternalInspectionReportWorkflow',
  ],

  ['collectiveInputLogWorkflow'],
];

function Content(props: any) {
  const router = useRouter();
  const [selectedMainEvent, setSelectedMainEvent] = useState(0);
  const [selectedSubEvent, setSelectedSubEvent] = useState(0);

  const handleTitleChange = (evt: any) => {
    setSelectedSubEvent(0), setSelectedMainEvent(evt.target.value);
  };

  const wfName = workflowNames[selectedMainEvent][selectedSubEvent];
  const workflowDef = getWorkflowDef(wfName);
  const collectiveId: string | undefined = router?.query?.id as string;

  const handleSubTitleChange = (evt: any) => setSelectedSubEvent(evt.target.value);

  if (!collectiveId) {
    return <div> Operator ID is required </div>;
  }

  if (!workflowDef) {
    return <div> Event is not defined </div>;
  }

  const Events = ['Reports', 'Input Log'];

  const EventSubTitles = [
    [
      'Certification Body - Auditing report',
      'Certification Body - Inspection report',
      'Internal auditing report',
      'Internal inspection report',
    ],

    ['None'],
  ];

  const submitMutation = startWorkflowRQ({ onSuccess: navigateToParentPage(router) });
  const { mutate } = submitMutation;

  function createEvent(input: any) {
    return mutate(input);
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
            <EventEditor onSubmit={createEvent} wfName={wfName} domainObjectId={collectiveId} />
          </MutationWrapper>
        </Suspense>
      </Paper>
    </Stack>
  );
}
