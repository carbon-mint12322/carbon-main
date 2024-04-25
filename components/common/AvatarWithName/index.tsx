import React from 'react';

import { Box, Typography, TypographyProps, SxProps } from '@mui/material';

import Avatar, { AvatarProps } from '~/components/lib/DataDisplay/Avatar';

const styles = {
  avatar: {
    height: '2rem',
    width: '2rem',
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
};

export interface AvatarWithNameProps {
  name: string;
  url?: string;
  avatarProps?: AvatarProps;
  nameProps?: TypographyProps;
  sx?: SxProps;
}

function AvatarWithName({
  name,
  avatarProps = {},
  nameProps = {},
  sx = {},
  url,
}: AvatarWithNameProps) {
  return (
    <Box
      sx={{
        ...styles.root,
        ...sx,
      }}
    >
      {url ? (
        <Avatar src={url} sx={{ ...styles.avatar }} {...avatarProps} />
      ) : (
        <Avatar name={name} sx={{ ...styles.avatar }} {...avatarProps} />
      )}
      <Typography variant='body2' {...nameProps}>
        {name}
      </Typography>
    </Box>
  );
}

export default AvatarWithName;
