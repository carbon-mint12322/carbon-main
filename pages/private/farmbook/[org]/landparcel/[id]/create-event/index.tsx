import React, { useState, Suspense } from 'react';

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

import { EventEditor } from '~/gen/workflows/index-fe';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import { useEventCxt } from '~/contexts/EventContext';
import EventAttachmentDataContext from '~/contexts/EventAttachmentDataContext';

import { createEventRQ } from '~/frontendlib/model-lib/workflow';
import MutationWrapper from '~/components/ui/MutationWrapper';

export { default as getServerSideProps } from '~/utils/ggsp';
import { navigateToParentPage } from '~/frontendlib/util';
import axios from 'axios';

// const UploadEvent = dynamic(() => import('~/components/UploadEvent'));

const EventsGallery = dynamic(() => import('~/components/EventsGallery'));

export default function CreateEvent(props: any) {
  const [isUpload, setIsUpload] = React.useState(false);
  const [uploadedFile, setUploadedFile] = useState<any[]>([]);
  const router = useRouter();
  const { images, audio, documents, notes, clearState } = useEventCxt();

  const [selectedImages, setSelectedImages] = useState(images || []);
  const [selectedDocument, setSelectedDocument] = useState(documents || []);
  const [selectedAudio, setSelectedAudio] = useState(audio || []);
  const [selectedNotes, setSelectedNotes] = useState(notes || []);
  const { getAPIPrefix } = useOperator();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'New Event',
    subBtnColor: 'grey',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isMainBtnPresent: false,
    isSubBtnPresent: false,
  });

  const { isLoading: loading, data } = useFetch<any[]>(
    `${getAPIPrefix()}/event?landParcelId=${router.query.id}&category=Submission`,
  );

  const getLpData = async () => {
    try {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/landparcel/${router.query.id}`);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const setCreateEventTitle = () => {
    getLpData().then((res) => {
      const lpData = res?.data?.[0];
      setTitleBarData({
        ...titleBarData,
        subTitle: lpData?.name,
      });
    });
  };

  React.useEffect(() => {
    setCreateEventTitle();
    return () => clearState();
  }, []);

  const responsiveCard = { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 };
  const itemsLength =
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
      url={`/event?landParcelId=${router.query.id}&category=Submission`}
    >
      <TitleBarGeneric
        titleBarData={titleBarData}
      />
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
                {itemsLength} Media files attached
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
  [
    'lpSoilInfoLifecycle',
    'lpWaterTestLifecycle',
    'lpOtherTestLifecycle',
    'certificationBodyAuditingReportLifecycle',
    'certificationBodyInspectionReportLifecycle',
    'internalAuditingReportLifecycle',
    'internalInspectionReportLifecycle',
    'internalInspectionReport_farmer_IndGAPLifecycle',
  ],
  [
    'solarDryerLoadEventLifecycle',
    'compostingInputEventLifecycle',
    'compostingHarvestEventLifecycle',
    'lpOutputProcessingLifecycle',
  ],
  ['lpInputLogLifecycle'],
  ['farmerTrainingLifecycle'],
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
  const landParcelId: string | undefined = router?.query?.id as string;

  const handleSubTitleChange = (evt: any) => setSelectedSubEvent(evt.target.value);

  if (!landParcelId) {
    return <div> Land Parcel ID is required </div>;
  }

  if (!wfName) {
    return <div> Event is not defined </div>;
  }

  const Events = ['Reports', 'Processing Events', 'Input Log', 'Trainings'];

  const EventSubTitles = [
    [
      'Farm resources - Soil test',
      'Farm resources - Water test',
      'Farm resources - Others',
      'Certification Body - Auditing report',
      'Certification Body - Inspection report',
      'Internal auditing report',
      'Internal inspection report',
      'Internal inspection report - farmer (IndGAP)',
    ],
    [
      'Solar dryer load event',
      'Composting input event',
      'Composting harvest event',
      'Output processing event',
    ],
    ['None'],
    ['Farmer Training'],
  ];

  const evidences = Array.from(selectedImages).map((img: any) => img.link);

  const submitMutation = createEventRQ({ onSuccess: navigateToParentPage(router) });
  const { mutate } = submitMutation;

  function createEvent(input: any) {
    return mutate({ ...input, domainSchemaName: 'landparcel', domainInstanceId: landParcelId });
  }

  async function solarDryerFilter() {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/landparcel/${router.query.id}`);
    return res.data?.[0]?.solarDryerUnits;
  }

  async function compostingUnitFilter() {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/landparcel/${router.query.id}`);
    return res.data?.[0]?.compostingUnits;
  }

  async function outputProcessingUnitFilter(options: any) {
    if (options?.uiOptions.filterKey === 'processingunit') {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/landparcel/${router.query.id}`);
      return res.data?.[0]?.outputProcessingUnits;
    } else {
      const res: {
        data: any;
      } = await axios.get(`/api${options.schemaId}`);

      // Filter the data array based on the product batch is active or not
      const filteredData = res.data.filter((productbatch: any) => productbatch?.status != 'Approved');
      return filteredData;
    }
  }

  const formContext: any = {
    getApiUrl,
    foreignObjectLoader:
      wfName === 'solarDryerLoadEventLifecycle'
        ? solarDryerFilter
        : wfName === 'lpOutputProcessingLifecycle'
          ? outputProcessingUnitFilter
          : wfName === 'compostingInputEventLifecycle' || wfName === 'compostingHarvestEventLifecycle'
            ? compostingUnitFilter
            : undefined,
  };

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
              domainObjectId={landParcelId}
              evidences={evidences}
            />
          </MutationWrapper>
        </Suspense>
      </Paper>
    </Stack>
  );
}
