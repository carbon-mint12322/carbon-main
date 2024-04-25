import * as React from 'react';
import MUiAvatar, { AvatarProps as MUiAvatarProps } from '@mui/material/Avatar';
import { SxProps, Theme } from '@mui/material';

export interface AvatarProps extends MUiAvatarProps {
  name?: string;
}

export default function Avatar({ name, sx, ...props }: AvatarProps) {
  return <MUiAvatar {...stringAvatar(name || '', sx)} {...props} />;
}

export function stringAvatar(name: string, sx?: SxProps<Theme> | null) {
  return {
    sx: {
      bgcolor: avatarColor(name.length),
      fontSize: '0.75rem',
      width: '1.875rem',
      height: '1.875rem',
      lineHeight: 1.2,
      marginRight: '1rem',
      fontWeight: 600,
      ...(sx ? sx : {}),
    },
    children: name
      ? `${name.split(' ')[0][0] || ''}${
          name.split(' ')[1] && name.split(' ')[1][0] && name.split(' ')[1][0] != '(' ? name.split(' ')[1][0] : '' || ''
        }`
      : '',
  };
}

export const avatarColor = (length: number): string => {
  const index = length % 5;
  const color = ['#795548', '#3A7BFA', '#0E8140', '#F79023', '#007DBB'];
  return color[index] || '#795548';
};
