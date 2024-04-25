import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs from 'dayjs';
import { Chip, Grid, Typography } from '@mui/material';
import CardView from '~/components/ui/CardView';
import styles from '~/styles/theme/brands/styles';
import _ from 'lodash';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useSet } from '~/utils/customHooks';
import { fileToDataURL } from '~/utils/fileFormatter';
import moment from 'moment';
import If from './lib/If';

export enum DocumentTypes {
  Audio = 'audio',
  Image = 'image',
  Document = 'document',
  Text = 'text',
}
const EventsGallery = (props: any) => {
  const theme = useTheme();

  const [selectedImages, setSelectedImages] = useState(Array.from(props.selectedImages));
  const [selectedDocument, setSelectedDocument] = useState(Array.from(props.selectedDocument));
  const [selectedAudio, setSelectedAudio] = useState(Array.from(props.selectedAudio));
  const [selectedNotes, setSelectedNotes] = useState(Array.from(props.selectedNotes));
  const [error, setError] = useState<string>();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const responsiveCard = { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 };

  const renderDate = (date: string) => {
    const isCurrentDateValid = moment(date, 'DD/MM/YYYY', true).isValid();
    if (isCurrentDateValid) {
      const currentDate = moment(date, 'DD/MM/YYYY');
      if (moment().format('DD/MM/YYYY') === moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY')) {
        return 'Today';
      }

      if (
        moment().add(-1, 'days').format('DD/MM/YYYY') ===
        moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY')
      ) {
        return 'Yesterday';
      }

      if (
        (currentDate.isBefore(moment().endOf('week')) &&
          currentDate.isAfter(moment().startOf('week'))) ||
        currentDate.isSame(moment().startOf('week')) ||
        currentDate.isSame(moment().endOf('week'))
      ) {
        return 'This Week';
      }

      if (
        (currentDate.isBefore(moment().add(-1, 'weeks').endOf('week')) &&
          currentDate.isAfter(moment().add(-1, 'weeks').startOf('week'))) ||
        currentDate.isSame(moment().add(-1, 'weeks').startOf('week')) ||
        currentDate.isSame(moment().add(-1, 'weeks').endOf('week'))
      ) {
        return 'Last Week';
      }

      if (
        (currentDate.isBefore(moment().endOf('month')) &&
          currentDate.isAfter(moment().startOf('month'))) ||
        currentDate.isSame(moment().startOf('month')) ||
        currentDate.isSame(moment().endOf('month'))
      ) {
        return 'This Month';
      }

      if (
        (currentDate.isBefore(moment().add(-1, 'month').endOf('month')) &&
          currentDate.isAfter(moment().add(-1, 'month').startOf('month'))) ||
        currentDate.isSame(moment().add(-1, 'month').startOf('month')) ||
        currentDate.isSame(moment().add(-1, 'month').endOf('month'))
      ) {
        return 'Last Month';
      }
    }

    return 'Older';
  };

  const dateOrder = {
    Today: 1,
    Yesterday: 2,
    'This Week': 3,
    'Last Week': 4,
    'This Month': 5,
    'Last Month': 6,
    Older: 7,
  };

  const groups = useMemo(
    () =>
      props?.data?.reduce((groups: { [key: string]: any[] }, eventData: any) => {
        const date = moment(`${eventData.createdAt}`, 'DD/MM/YYYY hh:mm a', true).isValid()
          ? moment(`${eventData.createdAt}`, 'DD/MM/YYYY hh:mm a').format('DD/MM/YYYY')
          : moment(`${eventData.createdAt}`, moment.ISO_8601, true).isValid()
            ? moment(`${eventData.createdAt}`, moment.ISO_8601).format('DD/MM/YYYY')
            : 'Older';
        const dateData = renderDate(date);
        if (!groups[dateData]) {
          groups[dateData] = [];
        }
        groups[dateData].push(eventData);
        return groups;
      }, {}),
    [props?.data],
  );

  // Edit: to add it in the array format instead
  const groupArrays = useMemo(() => {
    const data =
      groups &&
      Object.keys(groups).map((date) => {
        return {
          date,
          eventData: groups[date],
        };
      });
    const sortedData =
      data &&
      _.sortBy(
        data,
        (element: {
          date:
          | 'Today'
          | 'Yesterday'
          | 'This Week'
          | 'Last Week'
          | 'This Month'
          | 'Last Month'
          | 'Older';
          eventData: any;
        }) => {
          return dateOrder?.[element?.date];
        },
      );
    return sortedData as {
      date: string;
      eventData: any;
    }[];
  }, [groups]);

  const getRenderFileData = (type: string) => {
    switch (type) {
      case 'audio': {
        return [...(selectedAudio || [])];
      }
      case 'text': {
        return [...(selectedNotes || [])];
      }
      case 'image': {
        return [...(selectedImages || [])];
      }
      case 'document':
      default: {
        return [...(selectedDocument || [])];
      }
    }
  };

  const setRenderFileData = (type: string, data: any) => {
    let value = [];
    switch (type) {
      case 'audio': {
        value = handleMultipleSelection(data, selectedAudio);
        setSelectedAudio(value);
        return;
      }
      case 'text': {
        value = handleMultipleSelection(data, selectedNotes);
        setSelectedNotes(value);
        return;
      }
      case 'image': {
        value = handleMultipleSelection(data, selectedImages);
        setSelectedImages(value);
        return;
      }
      case 'document':
      default: {
        value = handleMultipleSelection(data, selectedDocument);
        setSelectedDocument(value);
        return;
      }
    }
  };

  const handleMultipleSelection = (data: any, currentData: any = []) => {
    const { multipleSelection = true } = props;
    if (!multipleSelection) {
      setSelectedAudio([]);
      setSelectedNotes([]);
      setSelectedImages([]);
      setSelectedDocument([]);
      return [data];
    } else {
      return [...currentData, data];
    }
  };

  const removeRenderFileData = (type: string, index: number, selectedData: any) => {
    const data = [...selectedData];
    data?.splice(index, 1);
    switch (type) {
      case 'audio': {
        setSelectedAudio([...(data || [])]);
        return;
      }
      case 'text': {
        setSelectedNotes([...(data || [])]);
        return;
      }
      case 'image': {
        setSelectedImages([...(data || [])]);
        return;
      }
      case 'document':
      default: {
        setSelectedDocument([...(data || [])]);
        return;
      }
    }
  };

  const renderGridCard = (
    type: DocumentTypes,
    record: any,
    createdBy: any,
    selectCheck: boolean,
  ) => {
    const selectedData = getRenderFileData(type);

    const isDataSelected = selectedData.findIndex((item: any) => {
      return item?.link === record?.link;
    });

    return (
      <Grid item {...responsiveCard}>
        <CardView
          type={type}
          link={record?.link}
          lat={record?.metadata?.location?.lat}
          lng={record?.metadata?.location?.lng}
          timeStamp={record?.metadata?.timestamp}
          createdBy={createdBy.name}
          selectCheck={selectCheck}
          selected={isDataSelected > -1}
          onSelect={() => {
            isDataSelected > -1
              ? removeRenderFileData(type, isDataSelected, selectedData)
              : setRenderFileData(type, record);
          }}
        />
      </Grid>
    );
  };

  const renderGridTextCard = (
    type: DocumentTypes,
    record: any,
    createdBy: any,
    selectCheck: boolean,
  ) => {
    const selectedData = getRenderFileData(type);

    const isDataSelected = selectedData.findIndex((item: any) => {
      return item?.id === record?.id;
    });

    return (
      <Grid item {...responsiveCard}>
        <CardView
          type={type}
          lat={record?.location?.lat}
          lng={record?.location?.lng}
          timeStamp={record?.createdAt}
          notes={record?.notes}
          createdBy={record?.createdBy.name}
          selectCheck={selectCheck}
          selected={isDataSelected > -1}
          onSelect={() => {
            isDataSelected > -1
              ? removeRenderFileData(type, isDataSelected, selectedData)
              : setRenderFileData(type, record);
          }}
        />
      </Grid>
    );
  };
  const getFileType = (type: string) => {
    switch (type) {
      case 'audio':
        return DocumentTypes.Audio;
      case 'text':
        return DocumentTypes.Text;
      case 'image':
        return DocumentTypes.Image;
      case 'document':
      default:
        return DocumentTypes.Document;
    }
  };
  const titleBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  };
  const titleBtnStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    paddingBottom: 'unset',
  };
  const titleBarRightStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    height: '40px',
  };

  const handleSubmit = () => {
    props?.onImageSelect(selectedImages);
    props?.onDocumentSelect(selectedDocument);
    props?.onAudioSelect(selectedAudio);
    props?.onNotesSelect(selectedNotes);
    props?.handleMainBtnClick &&
      props?.handleMainBtnClick({
        audio: selectedAudio,
        text: selectedNotes,
        image: selectedImages,
        document: selectedDocument,
      });
  };

  const onUploadBtnClick = async (event: any) => {
    const getFileType = (file: any) => {
      const type = file.type.split('/')[0];
      return type;
    };
    const file = event.target.files[0];
    setError(undefined);

    if (FileReader && file) {
      if (+(file.size / 1024 / 1024).toFixed(2) > 5) {
        setError('Maximum 5mb file can be uploaded');
      } else if (file.type !== 'application/pdf' && file.type !== 'image/jpeg') {
        setError('Please upload only pdf or jpeg');
      } else {
        const filesDataURL = await fileToDataURL(file);
        const type = getFileType(file);
        const data = {
          link: filesDataURL,
          type: type,
        };
        setRenderFileData(type, data);
        props.handleUploadBtnClick(data, filesDataURL);
      }
    }
  };

  const uploadFileBtnRef = useRef<HTMLInputElement>(null);

  const uploadTrigger = () => {
    uploadFileBtnRef.current?.click();
  }

  useEffect(() => {

    uploadFileBtnRef.current?.addEventListener('click', (e) => {
      e.stopPropagation();
    })

  }, [])

  return (
    <>
      <Box component={'div'} sx={titleBarStyle}>
        <Box component={'div'} sx={titleBarStyle}>
          <Box component={'div'}>
            <Box sx={titleBtnStyle}>
              <Typography variant={'h5'}>Select Files</Typography>
            </Box>
          </Box>
        </Box>
        <Box component={'div'} sx={titleBarRightStyle}>

          <Button
            variant={'contained'}
            component={'label'}
            onClick={uploadTrigger}
          >
            Upload from your system
          </Button>

          <input
            ref={uploadFileBtnRef}
            type={'file'}
            hidden={true}
            onChange={onUploadBtnClick}
            accept='image/jpeg,application/pdf'
          />

          <If value={error}>
            <Typography color='error'>{error}</Typography>
          </If>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            variant={'contained'}
            color={'secondary'}
            onClick={props.handleSubBtnClick}
            sx={props.h100}
          >
            Cancel
          </Button>
          <Button variant={'contained'} color={'primary'} onClick={handleSubmit} sx={props.h100}>
            Done
          </Button>
        </Box>
      </Box>
      <Grid container sx={styles.borderTopContainer}>
        <Grid xs={12} sx={[{ padding: '32px 36px' }, { m: matchDownSM ? '0' : '0 0rem' }]}>
          {props.uploadedFile?.length > 0 && (
            <>
              <Typography variant='h5' sx={styles.dayTitle}>
                Uploaded
              </Typography>
              <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                {props?.uploadedFile?.map?.((file: any) => {
                  return renderGridCard(
                    getFileType(file.cardViewProps.type),
                    file.cardViewProps,
                    'You',
                    true,
                  );
                })}
              </Grid>
            </>
          )}

          <If value={groupArrays?.length > 0}>
            {groupArrays?.map(({ date, eventData }) => (
              <>
                <Typography variant='h5' sx={styles.dayTitle}>
                  {date}
                </Typography>
                <If value={eventData?.length > 0}>
                  <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                    {eventData?.map((items: any, i: number) => {
                      return (
                        <React.Fragment key={i}>
                          <If value={items?.audioRecords?.length > 0}>
                            {items?.audioRecords?.map((record: any, index: number) =>
                              renderGridCard(DocumentTypes.Audio, record, items?.createdBy, true),
                            )}
                          </If>
                          <If value={items?.photoRecords?.length > 0}>
                            {items?.photoRecords?.map((record: any, index: number) =>
                              renderGridCard(DocumentTypes.Image, record, items?.createdBy, true),
                            )}
                          </If>
                          <If value={items?.documentRecords?.length > 0}>
                            {items?.documentRecords?.map((record: any, index: number) =>
                              renderGridCard(
                                DocumentTypes.Document,
                                record,
                                items?.createdBy,
                                true,
                              ),
                            )}
                          </If>
                          <If value={items?.notes}>
                            {items?.notes &&
                              renderGridTextCard(DocumentTypes.Text, items, items?.createdBy, true)}
                          </If>
                        </React.Fragment>
                      );
                    })}
                  </Grid>
                </If>
              </>
            ))}
          </If>
        </Grid>
      </Grid>
    </>
  );
};

export default EventsGallery;
