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
import CardView from '~/components/ui/CardView';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TitleBarGeneric from '~/components/TitleBarGeneric';
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
import { Button, Modal } from '@mui/material';
import { isAudioUrl, isDocumentUrl, isImgUrl, navigateToSuperParentPage } from '~/frontendlib/util';
import { submitWfEvent, WfEventSubmission } from '~/frontendlib/model-lib/workflow';
import EventAttachmentDataContext from '~/contexts/EventAttachmentDataContext';

const EventsGallery = dynamic(() => import('~/components/EventsGallery'));

function EventDetailPageWrapper(props: any) {
  const { getAPIPrefix } = useOperator();
  const apiPrefix = getAPIPrefix();
  if (!apiPrefix) {
    throw new Error('No API Prefix!');
  }
  const API_URL = apiPrefix + `/event/${props.eventId}?simple=true`;
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
      org={props.org as string}
      eventData={eventData}
      apiUrl={API_URL}
      evidences={eventData?.details?.evidences || []}
      evidenceUrl={props.evidenceUrl}
      titleBarConfig={props.titleBarConfig}
    />
  );
}

interface InternalPageProps {
  org: string;
  eventData: any;
  evidences: string[];
  apiUrl: string;
  evidenceUrl: string;
  titleBarConfig: any;
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
  notes: string;
  type: 'notes';
};

function EventDetailPage(props: InternalPageProps) {
  const {
    org,
    eventData: eventDataFromServer,
    apiUrl,
    evidences,
    evidenceUrl,
    titleBarConfig,
  } = props;
  const [openVerifyFarmerModal, setOpenVerifyFarmerModal] = useState<boolean>(false);
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

  const statusStep: {
    [key: string]: {
      buttonLabel: string;
    };
  } = {
    editable: {
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
    return (evidences || []).filter(noneof).map((notes: string) => ({ notes: notes, link: '', type: 'notes' }));
  }

  const handleClose = () => {
    setOpenVerifyFarmerModal(false);
  };
  const updateMutation = useMutation(submitWfEvent, {
    onSuccess: navigateToSuperParentPage(router),
  });

  const data = formData || eventData;

  const { isLoading: isLoadingEvidences, data: evidenceList } = useFetch<any[]>(
    `${evidenceUrl}`,
  );

  function onChangeDetails(details: any) {
    setFormData({ ...data, details });
  }
  const deleteEvent = () => {
    setMutationType('delete');
    const wfEventSubmission: WfEventSubmission = {
      org,
      instanceId: eventData.lifecycleWorkflowId || eventData.validationWorkflowId,
      eventName: 'deleteRequest',
      eventData: data,
    };
    return updateMutation.mutate(wfEventSubmission);
  };
  function saveChanges(updatedData: any) {
    toggleEditMode();
    setMutationType('update');
    let evidences = [];
    evidences.push(...Array.from(selectedImages).map((img: any) => img.link));
    evidences.push(...Array.from(selectedAudio).map((aud: any) => aud.link));
    evidences.push(...Array.from(selectedDocuments).map((doc: any) => doc.link));
    evidences.push(...Array.from(selectedNotes).map((note: any) => note.notes));
    const wfEventSubmission: WfEventSubmission = {
      org,
      instanceId: eventData.lifecycleWorkflowId || eventData.validationWorkflowId,
      eventName: 'update',
      eventData: { details: { ...updatedData, evidences } },
    };
    return updateMutation.mutate(wfEventSubmission);
  }
  const toggleEditMode = () => setEditMode(!editMode);

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
        titleBarData={{
          isTitleBarPresent: titleBarConfig.showTitlebar,
          title: titleBarConfig.pageTitle,
          subTitle: titleBarConfig.subTitle,
          isTitlePresent: titleBarConfig.showTitlebarTitle,
          isSubTitlePresent: titleBarConfig.showTitlebarSubTitle,
          isMainBtnPresent: titleBarConfig.showTitlebarMainBtn,
          isSubBtnPresent: titleBarConfig.showTitlebarSubBtn,
          mainBtnTitle: titleBarConfig.mainBtnTitle,
          subBtnTitle: editMode ? `Cancel ${titleBarConfig.subBtnTitle}` : titleBarConfig.subBtnTitle,
          isViewDeleteBtnsPresent: titleBarConfig.showTitlebarDelBtn,
        }}
        handleMainBtnClick={() => {
          return setOpenVerifyFarmerModal(true)
        }}
      handleSubBtnClick={toggleEditMode}
      handleDeleteBtnClick={deleteEvent}
      />
      <EventAttachmentDataContext url={evidenceUrl}>
        <Grid
          container
          spacing={2}
          sx={{ borderTop: '1px solid rgba(196, 196, 196, 0.6)', marginTop: '24px' }}
        >
          <Modal open={isUpload} onClose={handleUploadClose}>
            <Box sx={uploadModelStyle}>
              <EventsGallery
                data={evidenceList}
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
      </EventAttachmentDataContext>
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
            notes={record.notes}
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
  eventId,
}: any) {
  const [eventSchema, setEventSchema] = useState(null);
  const [isPhotoEvent, setIsPhotoEvent] = useState(false);
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
      <EventForm
        eventName={eventName}
        readonly={readonly}
        formData={{ data: data.details }}
        evidences={{ evidences: data.evidences }}
        onChange={onChange}
        onSubmit={onSubmit}
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
        alt=''
      />
    </Card>
  );
}
