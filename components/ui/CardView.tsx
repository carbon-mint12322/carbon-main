import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import ReactPlayer from 'react-player';
import { Card, CardContent, CardHeader, Typography, CardMedia, Box, Button, Stack } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import dayjs from 'dayjs';
import styles from '~/styles/theme/brands/styles';
import axios from 'axios';
import If from '../lib/If';
import CircularLoader from '../common/CircularLoader';
import Dialog from '~/components/lib/Feedback/Dialog';
import { isoToLocal, stringDateFormatter } from '~/utils/dateFormatter';
import PDFViewer from '../pdf-viewer';
const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 },
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

interface CardViewProps {
  border?: boolean;
  boxShadow?: boolean;
  children?: React.ReactNode;
  content?: boolean;
  contentClass?: string;
  contentSX?: object;
  darkTitle?: string;
  secondary?: React.ReactNode;
  shadow?: string;
  sx?: object;
  title?: string;
  type?: string;
  link?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  createdBy?: string;
  selectCheck?: boolean;
  timeStamp?: any;
  onSelect?: () => void;
  selected?: boolean;
  isPreviewAllowed?: boolean;
  onPlantHealthClick?: () => void
  showHealthCheckBtn?: boolean;
}

const CardView = ({
  border = true,
  boxShadow,
  children,
  content = true,
  contentClass = '',
  contentSX = {},
  darkTitle,
  secondary,
  shadow,
  sx = {},
  title,
  type = 'image',
  link = '',
  timeStamp,
  lat = 0,
  lng = 0,
  notes = '',
  createdBy = '',
  selectCheck = true,
  onSelect = () => { },
  selected = false,
  isPreviewAllowed = true,
  onPlantHealthClick = () => { },
  showHealthCheckBtn = false,
  ...others
}: CardViewProps) => {
  const [data, setData] = useState<any>();
  const [metaData, setMetaData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [isDataAvailable, setIsDataAvailable] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const getBase64 = (file: File, cb: (data: string | ArrayBuffer | null) => void) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  };

  const checkDataUrlLink = (linkUrl: string): boolean => {
    const regex = /^data:(.+);name=(.+);base64,(.*)$/;
    const matches = linkUrl.match(regex);
    if (matches && matches.length > 0) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (link && type !== 'text') {
      if (!checkDataUrlLink(link)) {
        fetchFile();
      } else {
        setData(link);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
    return () => {
      // second;
    };
  }, [link]);

  const fetchFile = async () => {
    try {
      setLoading(true);
      const filename = link.substring(link.lastIndexOf('/') + 1);
      const url = `/api/file/public?id=/gridfs:${process.env.NEXT_PUBLIC_TENANT_NAME}/${filename}`;
      const res = await axios.get(url, {
        responseType: 'blob', // important
      });

      if (type === 'image') {
        getBase64(new File([res.data], 'sample'), (result) => {
          setData(result);
        });
      } else {
        setData(res.data);
      }
      setMetaData({
        location: {
          lat: res.headers?.['x-image-meta-property-location-lat'],
          lng: res.headers?.['x-image-meta-property-location-lng'],
        },
        timeStamp: res.headers?.['x-image-meta-property-timestamp'],
      });
      setLoading(false);
    } catch (error) {
      //
      setIsDataAvailable(false);
    }
  };

  const handleModalOpen = () => {
    isPreviewAllowed && setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  return (
    <If value={isDataAvailable}>
      <Card sx={{ minHeight: "292px", ...(styles?.cardView || {}) }}>
        <CircularLoader
          value={loading}
          sx={{
            minHeight: '15rem',
            maxHeight: '15rem',
          }}
        >
          {type === 'image' && (
            <CardMedia
              component='img'
              height='180px'
              image={data}
              alt={link}
              sx={{ borderRadius: 0 }}
              onClick={handleModalOpen}
            />
          )}

          {type === 'audio' && (
            <>
              <Box sx={styles.audio}>
                <ReactPlayer url={link} controls width='100%' height='100%' />
              </Box>
            </>
          )}
          {type === 'document' && (
            <>
              <Box sx={styles.pdf} onClick={handleModalOpen}>
                <PictureAsPdfIcon sx={{ fontSize: 80 }} />
                <Typography variant='caption'>No Preview Available</Typography>
              </Box>
            </>
          )}
          {type === 'text' && (
            <>
              <div
                style={{
                  display: 'flex',
                  height: '180px',
                  alignItems: 'top',
                  backgroundColor: '#F8F8F8',
                  padding: '0 5px',
                  overflow: 'hidden',
                }}
                onClick={() => handleModalOpen()}
              >
                <Box component='h5'></Box>
                <Typography
                  sx={{ fontSize: '14px', padding: '24px 24px 32px 12px', wordBreak: 'break-all' }}
                >
                  {notes?.length > 200 ? notes?.substring(0, 200) + '...' : notes}
                </Typography>
              </div>
            </>
          )}
          <CardContent sx={{ padding: 0 }}>
            <Stack>
              <Typography gutterBottom variant='h5' component='div' sx={styles.title}>
                {createdBy}
              </Typography>
              <Typography variant='caption' color='textSecondary' sx={styles.caption}>
                {`${isoToLocal(timeStamp ? timeStamp : metaData?.timeStamp)} ${lat && lng
                  ? `• Lat: ${lat.toFixed(2)}º, Lng: ${lng.toFixed(2)}º`
                  : metaData?.location?.lat && metaData?.location?.lng
                    ? `• Lat: ${parseFloat(metaData?.location?.lat).toFixed(2)}º, Lng: ${parseFloat(
                      metaData?.location?.lng,
                    ).toFixed(2)}º`
                    : ''
                  }`}
              </Typography>
              {type === 'image' && showHealthCheckBtn && process.env.NEXT_PUBLIC_APP_NAME !== 'poultrybook' && (
                <Button variant='contained' onClick={onPlantHealthClick} >
                  Check Crop Health
                </Button>
              )}
            </Stack>
          </CardContent>
          {selectCheck && (
            <input
              type='checkbox'
              style={{ position: 'absolute', top: 8, right: 8, width: '15px', height: '15px' }}
              name=''
              checked={selected}
              onClick={onSelect}
            />
          )}
        </CircularLoader>
      </Card>
      <Dialog
        open={openModal}
        onClose={handleModalClose}
        fullWidth
        maxWidth={'md'}
        title={'Preview'}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 'fit-object',
          }}
        >
          {type === 'image' && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                width: 'auto',
                aspectRatio: '1/1',
                maxHeight: '70vh',
                minHeight: '45vh',
                overflow: 'hidden',
              }}
            >
              <img
                src={data}
                alt='uploaded-image'
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'contain', // or 'cover' depending on your preference
                }}
              />
            </Box>
          )}

          {type === 'audio' && (
            <>
              <Box sx={styles.audio}>
                <ReactPlayer url={link} controls />
              </Box>
            </>
          )}
          {type === 'document' && (
            <>
              <PDFViewer url={link} />
            </>
          )}
          {type === 'text' && (
            <>
              <div
                style={{
                  display: 'flex',
                  height: '180px',
                  alignItems: 'top',
                  backgroundColor: '#F8F8F8',
                  padding: '0 5px',
                  overflow: 'hidden',
                }}
              >
                <Box component='h5'></Box>
                <Typography
                  sx={{ fontSize: '14px', padding: '24px 24px 32px 12px', wordBreak: 'break-all' }}
                >
                  {notes}
                </Typography>
              </div>
            </>
          )}
        </Box>
      </Dialog>
    </If>
  );
};

export default CardView;
