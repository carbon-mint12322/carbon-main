import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Image from 'next/image';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  SelectChangeEvent,
} from '@mui/material';

import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

import ImageGroup from '~/components/ImageGroup';
import DropdownList from '~/components/DropdownList';

import eyeClosedImage from '/public/assets/images/EyeClosed.svg';
import { useOperator } from '~/contexts/OperatorContext';
import moment from 'moment';
import { stringDateFormatter } from '~/utils/dateFormatter';
import { useEffect } from 'react';
import { ColouredGrid } from '~/container/landparcel/list/LandParcelListCard';
import dayjs from 'dayjs';
import { ConnectionPoolClosedEvent } from 'mongodb';
// export { default as getServerSideProps } from '~/gen/pages/notifications/data';

const NotificationPanel = (props: any) => {
  const router = useRouter();
  const { changeRoute } = useOperator();

  const [selectedValues, setSelectedValues] = React.useState({
    durationType: 'All',
    NotificationType: 'All',
  });
  const [rendereddata, setRendereddata] = useState([]);

  useEffect(() => {
    let render =
      props.data &&
      props.data.sort(function (a: { createdAt: any }, b: { createdAt: any }) {
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      });
    setRendereddata(render);
  }, [props.data]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValues((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  let filteredVal: React.SetStateAction<never[]> = [];

  useEffect(() => {
    const endDate = dayjs();
    if (selectedValues.NotificationType == 'All' && selectedValues.durationType == 'All') {
      filteredVal = props.data;
    } else {
      filteredVal = props.data?.filter((el: any, index: any) => {
        const diffDays = endDate.diff(el.createdAt, 'day');
        if (
          el.status == selectedValues.NotificationType ||
          (selectedValues.NotificationType == 'All' && selectedValues.durationType != 'All')
        ) {
          if (selectedValues.durationType == 'Today' && diffDays == 0) {
            return el;
          } else if (selectedValues.durationType == 'Yesterday' && diffDays == 1) {
            return el;
          } else if (selectedValues.durationType == '7 Days Activity' && diffDays < 7) {
            return el;
          } else if (selectedValues.durationType == '30 Days Activity' && diffDays < 30) {
            return el;
          }
        }
        if (selectedValues.durationType == 'All') {
          if (el.status == selectedValues.NotificationType) {
            return el;
          }
        }
      });
    }

    setRendereddata(filteredVal);
  }, [selectedValues]);

  const flexContent = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: props.isPageView ? '0px 32px' : '24px 32px',
    gap: '4rem',
  };
  const responsiveCard = props.isPageView
    ? { xs: 8, sm: 8, md: 8, lg: 8, xl: 8 }
    : { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 };

  const cardStyle = props.isPageView
    ? {
        width: '100%',
        padding: '20px 40px',
        display: 'flex',
        gap: '4rem',
        borderLeft: '1px solid #EEEEEE',
        borderRight: '1px solid #EEEEEE',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
      }
    : { padding: '20px 40px', display: 'flex', gap: '2rem', cursor: 'pointer' };

  const handleViewAllNotifications = () => {
    changeRoute('/notifications/list');
    if (props?.handleCloseNotificationsModal) {
      const handleCloseNotificationsModal = props?.handleCloseNotificationsModal;
      handleCloseNotificationsModal();
    }
  };
  const getMomentDate = (date: any) => {
    if (typeof date !== 'string') return;
    let [day, time] = date.split(' ');
    day = day.split('/').reverse().join('-');
    return moment(`${day} ${time}`);
  };
  return (
    <Box sx={{ marginTop: props.isPageView ? 'unset' : '4rem' }}>
      {!props.isPageView && (
        <Box sx={flexContent}>
          <Typography fontSize='24px' fontWeight='normal'>
            Notification
          </Typography>
          <Button sx={{ color: 'black', fontSize: '16px' }} onClick={handleViewAllNotifications}>
            View all Notifications
          </Button>
        </Box>
      )}
      <Box display='flex' width='76%' justifyContent={'space-between'} marginLeft={'35px'}>
        <Box color='orange'>Duration</Box>
        <Box color='orange'>Status</Box>
      </Box>
      <Box
        pb={props.isPageView && '18px'}
        sx={{ padding: props.isPageView ? null : '0px 36px 18px' }}
      >
        <DropdownList
          selectedValues={selectedValues}
          handleChange={handleChange}
          menuItemsList={[
            ['Today', 'Yesterday', '7 Days Activity', '30 Days Activity', 'All'],
            ['New', 'Unread', 'Read', 'All'],
          ]}
        />
      </Box>
      <Box component={Paper} sx={{ borderTop: '1px solid #EEEEEE' }}>
        {rendereddata?.map((itemData: any, index: number) => {
          return (
            <Box sx={{ flexGrow: 1 }} key={`notify${index}${itemData?.id}`}>
              <Grid container sx={{ borderBottom: '1px solid #EEEEEE' }}>
                {props.isPageView && (
                  <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderLeft:
                          itemData?.status === 'Unread' ? '3px solid #FF8F00' : '3px solid #2B9348',
                      }}
                    >
                      <Typography variant='subtitle1'>
                        {stringDateFormatter(itemData?.createdAt)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                <Grid item {...responsiveCard}>
                  <Box
                    sx={cardStyle}
                    onClick={() => {
                      changeRoute(`${itemData.link}`);
                    }}
                  >
                    {!props.isPageView && (
                      <Divider
                        orientation='vertical'
                        sx={{
                          background: 'orange',
                          width: '6px',
                          height: '18px',
                          borderRadius: '4px',
                          marginTop: '8px',
                        }}
                      />
                    )}
                    <Box>
                      <Typography variant='h6'>{itemData.sender.name}</Typography>
                      <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                        {itemData?.message}
                      </Typography>
                      {!props.isPageView && itemData.createdAt && (
                        <Typography variant='subtitle2' sx={{ opacity: '0.6', marginTop: '10px' }}>
                          {stringDateFormatter(itemData.createdAt)}
                        </Typography>
                      )}
                    </Box>
                    {/* <ImageGroup maxImagesCount={4} ImagesList={ImagesList} /> */}
                  </Box>
                </Grid>
                {props.isPageView && (
                  <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                      }}
                    >
                      <IconButton>
                        {itemData?.status === 'Unread' ? (
                          <RemoveRedEyeOutlinedIcon sx={{ color: 'iconColor.secondary' }} />
                        ) : (
                          <Image
                            src={eyeClosedImage.src}
                            alt='eyeClosedImage'
                            height={24}
                            width={24}
                          />
                        )}
                      </IconButton>
                      <IconButton>
                        <DeleteOutlinedIcon sx={{ color: 'error.contrastText' }} />
                      </IconButton>
                      <IconButton>
                        <MoreHorizOutlinedIcon color='inherit' />
                      </IconButton>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default NotificationPanel;
