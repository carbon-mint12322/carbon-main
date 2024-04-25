import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

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
import TitleBarGeneric from '~/components/TitleBarGeneric';
import CardView from '~/components/ui/CardView';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import CircularLoader from '~/components/common/CircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import { useRouter } from 'next/router';
import { getEventSchema, EventForm } from '~/gen/workflows/index-fe';
import MutationWrapper from '~/components/ui/MutationWrapper';

import ValidationWorkflowView from '~/components/workflow/ValidationWorkflowView';
export { default as getServerSideProps } from '~/utils/ggsp';
import styles from '~/styles/theme/brands/styles';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Modal } from '@mui/material';
import { isAudioUrl, isDocumentUrl, isImgUrl, navigateToSuperParentPage } from '~/frontendlib/util';
import { submitWfEvent, WfEventSubmission } from "~/frontendlib/model-lib/workflow";

const EventsGallery = dynamic(() => import('~/components/EventsGallery'));

function EventDetailPageWrapper() {
  const { getAPIPrefix } = useOperator();
  const router = useRouter();
  const { org, id: landParcelId, eventId } = router.query;
  const apiPrefix = getAPIPrefix();
  if (!apiPrefix) {
    throw new Error('No API Prefix!');
  }
  const API_URL = apiPrefix + `/event/${eventId}`;
  const {
    isLoading: isLoadingEventData,
    isError,
    error,
    data: eventData,
    reFetch: eventRefetch,
  } = useFetch<any>(API_URL);
  if (isLoadingEventData) {
    return (
      <CircularLoader value={isLoadingEventData}>
        <div> Loading event data...</div>
      </CircularLoader>
    );
  }
  if (isError) {
    console.error(error);
    return (
      <div>
        {' '}
        Unable to load event data
        <Button onClick={() => eventRefetch(API_URL)}>Retry</Button>
      </div>
    );
  }
  return (
    <EventDetailPage
      org={org as string}
      landParcelId={landParcelId as string}
      eventId={eventId as string}
      eventData={eventData}
      eventRefetch={() => eventRefetch(API_URL)}
      apiUrl={API_URL}
      apiPrefix={apiPrefix}
      evidences={eventData?.details?.evidences || []}
    />
  );
}

interface InternalPageProps {
  org: string;
  landParcelId: string;
  eventId: string;
  eventData: any;
  eventRefetch: any;
  evidences: string[];
  apiUrl: string;
  apiPrefix: string;
}

type LinkType = 'photo' | 'document' | 'audio' | 'notes';
type LinkInfo = {
  link: string;
  type: LinkType;
};
type PhotoLink = LinkInfo & {
  type: 'photo';
};
type DocumentLink = LinkInfo & {
  type: 'document';
};
type AudioLink = LinkInfo & {
  type: 'audio';
};
type NoteLink = LinkInfo & {
  type: 'notes';
};

const statusStep: {
  [key: string]: {
    buttonLabel: string;
  };
} = {
  'editable': {
    buttonLabel: 'Submit for Review',
  },
  'Under Review': {
    buttonLabel: 'Review & Approve',
  },
  'Under Validation': {
    buttonLabel: 'Validate',
  },
  'Review Failed': {
    buttonLabel: 'Submit for Review',
  },
  'Validation Failed': {
    buttonLabel: 'Submit for Review',
  },
};

function EventDetailPage(props: InternalPageProps) {
  const {
    org,
    landParcelId,
    eventId,
    eventData: eventDataFromServer,
    eventRefetch,
    apiUrl,
    apiPrefix,
    evidences,
  } = props;
  const [openVerifyFarmerModal, setOpenVerifyFarmerModal] = useState<boolean>(false);

  const API_URL = apiUrl;
  const [eventData, setEventData] = useState<any>(eventDataFromServer);
  const [editMode, setEditMode] = useState<boolean>(false); // true when editing
  const [formData, setFormData] = useState<any>(null);

  const [selectedImages, setSelectedImages] = useState(filterPhotos(evidences));
  const [selectedDocuments, setSelectedDocument] = useState(filterDocuments(evidences));
  const [selectedAudio, setSelectedAudio] = useState(filterAudio(evidences));
  const [selectedNotes, setSelectedNotes] = useState(filterNotes(evidences));
  const [isUpload, setIsUpload] = React.useState(false);
  const [uploadedFile, setUploadedFile] = useState<any[]>([]);
  const [mutationType, setMutationType] = useState<string>('');
  const router = useRouter();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Land Parcel Event Details',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: false,
    isMainBtnPresent: true,
  });

  const { isLoading: isLoadingEvidences, data: lpEvidenceList } = useFetch<any[]>(
    `${apiPrefix}/event?landParcelId=${landParcelId}&category=Submission`,
  );

  function filterPhotos(evidences: any[]): PhotoLink[] {
    const imgArr: PhotoLink[] = (evidences || [])
      .filter(isImgUrl)
      .map((link: string) => ({ link, type: 'photo' }));
    return imgArr;
  }
  function filterDocuments(evidences: any[]): DocumentLink[] {
    return (evidences || [])
      .filter(isDocumentUrl)
      .map((link: string) => ({ link, type: 'document' }));
  }
  function filterAudio(evidences: any[]): AudioLink[] {
    return (evidences || []).filter(isAudioUrl).map((link: string) => ({ link, type: 'audio' }));
  }
  function filterNotes(evidences: any[]): NoteLink[] {
    const noneof = (url: string) => !(isImgUrl(url) || isDocumentUrl(url) || isAudioUrl(url));
    return (evidences || []).filter(noneof).map((link: string) => ({ link, type: 'notes' }));
  }

  const handleClose = () => {
    setOpenVerifyFarmerModal(false);
  };

  const updateMutation = useMutation(submitWfEvent, { onSuccess: navigateToSuperParentPage(router) });

  const data = formData || eventData;
  function onChangeDetails(details: any) {
    setFormData({ ...data, details });
  }
  const deleteEvent = () => {
    setMutationType('delete');
    const wfEventSubmission: WfEventSubmission = {
      org,
      instanceId: eventData.lifecycleWorkflowId || eventData.validationWorkflowId,
      eventName: 'deleteRequest',
      eventData: eventData,
    };
    return updateMutation.mutate(wfEventSubmission);
  }
  function saveChanges(updatedData: any) {
    toggleEditMode();
    setMutationType('update');
    const allEvidences = [
      ...selectedImages,
      ...selectedDocuments,
      ...selectedAudio,
      ...selectedNotes,
    ];
    const evidences = Array.from(allEvidences).map((img: any) => img.link);
    const wfEventSubmission: WfEventSubmission = {
      org,
      instanceId: eventData.lifecycleWorkflowId || eventData.validationWorkflowId,
      eventName: 'update',
      eventData: { details: { ...updatedData, evidences } },
    };
    return updateMutation.mutate(wfEventSubmission);
  }
  const toggleEditMode = () => setEditMode(!editMode);

  const validStatuses = {
    EDITABLE: 'editable',
    DRAFT: 'Draft',
    REVIEW_FAILED: 'Review Failed',
    VALIDATION_FAILED: 'Validation Failed',
  };

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: data?.landparcel?.name + ' • ' + (data?.landparcel?.surveyNumber || ''),
      mainBtnTitle:
        data?.status == 'Approved' ? 'Approved' : statusStep[data?.status]?.buttonLabel,
      subBtnTitle: editMode ? 'Cancel Edit' : 'Edit',
      isSubBtnPresent: !data?.locked && (!data.status || Object.values(validStatuses).includes(data.status)),
      isViewDeleteBtnsPresent: !data?.locked && (!data.status || data.status !== 'Approved'),
    });
  }, [data, editMode]);

  const responsiveCard = { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 };
  const itemsLenth =
    [...(selectedAudio || [])].length +
    [...(selectedNotes || [])].length +
    [...(selectedImages || [])].length +
    [...(selectedDocuments || [])].length;

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
    <>
    <TitleBarGeneric
        titleBarData={titleBarData}
        handleMainBtnClick={() => {
          setOpenVerifyFarmerModal(true)
        }}
        handleSubBtnClick={toggleEditMode}
        handleDeleteBtnClick={() => {deleteEvent()}}
      />
      <Grid
        container
        spacing={2}
        sx={{ borderTop: '1px solid rgba(196, 196, 196, 0.6)', marginTop: '24px' }}
      >
        <Modal open={isUpload} onClose={handleUploadClose}>
          <Box sx={uploadModelStyle}>
            <EventsGallery
              data={lpEvidenceList}
              uploadedFile={uploadedFile}
              selectedImages={selectedImages}
              selectedDocument={selectedDocuments}
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
        <Grid item xs={7}>
          <Paper
            elevation={0}
            sx={{
              padding: 3,
              width: '100%',
              height: '100%',
            }}
          >
            <Box>
              <MutationWrapper mutation={updateMutation} type={mutationType}>
                <DetailView
                  readonly={!editMode}
                  data={data}
                  handleClose={handleClose}
                  openVerifyFarmerModal={openVerifyFarmerModal}
                  onChange={onChangeDetails}
                  onSubmit={saveChanges}
                />
              </MutationWrapper>
            </Box>
          </Paper>
        </Grid>
        <Grid xs={5} sx={{ padding: '32px 36px' }}>
          <EvidencePanelHeader
            itemsLenth={itemsLenth}
            editMode={editMode}
            handleUploadOpen={handleUploadOpen}
          />
          <EvidencePanelBody
            gridCfg={responsiveCard}
            selectedAudio={selectedAudio}
            selectedImages={selectedImages}
            selectedDocuments={selectedDocuments}
            selectedNotes={selectedNotes}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default withAuth(EventDetailPageWrapper);

function EvidencePanelBody({
  gridCfg,
  selectedAudio,
  selectedImages,
  selectedDocuments,
  selectedNotes,
}: {
  gridCfg: { xs: number; sm: number; md: number; lg: number; xl: number };
  selectedAudio: AudioLink[];
  selectedImages: PhotoLink[];
  selectedDocuments: DocumentLink[];
  selectedNotes: NoteLink[];
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <PhotoCards selectedImages={selectedImages} gridCfg={gridCfg} />
        <DocumentCards selectedDocuments={selectedDocuments} gridCfg={gridCfg} />{' '}
        <AudioCards selectedAudio={selectedAudio} gridCfg={gridCfg} />
        <NoteCards linkInfos={selectedNotes} gridCfg={gridCfg} />
      </Grid>
    </Box>
  );
}

function NoteCards({
  linkInfos,
  gridCfg,
}: {
  linkInfos: NoteLink[];
  gridCfg: { xs: number; sm: number; md: number; lg: number; xl: number };
}) {
  return (
    <>
      {Array.from(linkInfos || []).map((record: any, index: number) => (
        <Grid item {...gridCfg} key={index}>
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
    </>
  );
}

function DocumentCards({
  selectedDocuments,
  gridCfg,
}: {
  selectedDocuments: DocumentLink[];
  gridCfg: { xs: number; sm: number; md: number; lg: number; xl: number };
}) {
  return (
    <>
      {Array.from(selectedDocuments || [])?.map((record: any, index: number) => (
        <Grid item {...gridCfg} key={index}>
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
    </>
  );
}

function PhotoCards({
  selectedImages,
  gridCfg,
}: {
  selectedImages: PhotoLink[];
  gridCfg: { xs: number; sm: number; md: number; lg: number; xl: number };
}) {
  return (
    <>
      {Array.from(selectedImages || [])?.map((record: any, index: number) => (
        <Grid item {...gridCfg} key={index}>
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
    </>
  );
}

function AudioCards({
  selectedAudio,
  gridCfg,
}: {
  selectedAudio: AudioLink[];
  gridCfg: { xs: number; sm: number; md: number; lg: number; xl: number };
}) {
  return (
    <>
      {Array.from(selectedAudio || [])?.map((record: any, index: number) => (
        <Grid item {...gridCfg} key={index}>
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
    </>
  );
}

function EvidencePanelHeader({
  itemsLenth,
  editMode,
  handleUploadOpen,
}: {
  itemsLenth: number;
  editMode: boolean;
  handleUploadOpen: () => void;
}) {
  return (
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
      {editMode && (
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
      )}
    </Box>
  );
}

function DetailView({
  readonly,
  data,
  handleClose,
  openVerifyFarmerModal,
  onChange,
  onSubmit,
}: any) {
  const [eventSchema, setEventSchema] = useState(null);
  const [isPhotoEvent, setIsPhotoEvent] = useState(false);
  const router = useRouter();
  const { eventId } = router.query;
  const eventName: string = data?.name;
  const parentRef = useRef(null);
  const { getAPIPrefix, getApiUrl } = useOperator();

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
      return res.data;
    }
  }

  const formContext: any = {
    getApiUrl,
    foreignObjectLoader:
      eventName === 'landParcelSolarDryerLoadEvent'
        ? solarDryerFilter
        : eventName === 'lpOutputProcessing'
          ? outputProcessingUnitFilter
          : eventName === 'landParcelCompostingInputEvent' ||
            eventName === 'landParcelCompostingHarvestEvent'
            ? compostingUnitFilter
            : undefined,
  };

  return (
    <>
      <EventForm
        eventName={eventName}
        readonly={readonly}
        formData={{ data: data.details }}
        evidences={{ evidences: data.evidences }}
        onChange={onChange}
        onSubmit={onSubmit}
        formContext={formContext}
      />
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
