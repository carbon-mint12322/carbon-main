import { Avatar, Box, Card, IconButton, Typography } from '@mui/material';
import React from 'react';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { deepOrange } from '@mui/material/colors';

const ProfileCard = (props: any) => {
  return (
    <Card sx={{ padding: '24px', borderRadius: '0', marginBottom: '0.5rem' }}>
      <Typography variant='h6' sx={{ fontSize: '18px' }}>
        {props?.data?.title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          marginTop: '8px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {props.data.isAvatarPresent && <Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar>}
          <Box>
            <Typography variant='h6' sx={{ fontSize: '16px' }}>
              {props?.data?.name}
            </Typography>
            <Typography variant='subtitle2' sx={{ opacity: '0.4' }}>
              {props?.data?.subText}
            </Typography>
          </Box>
        </Box>
        <IconButton>
          <MoreHoriz />
        </IconButton>
      </Box>
    </Card>
  );
};
export default ProfileCard;
