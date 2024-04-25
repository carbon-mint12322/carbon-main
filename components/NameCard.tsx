import { KeyboardArrowDown } from '@mui/icons-material';
import { Avatar, Grid, Typography } from '@mui/material';
import React from 'react';

interface IProps {
  name: string;
  role: string;
}

export default function NameCard(props: IProps) {
  const nameInitials = React.useMemo(() => {
    const { name } = props;
    if (!name?.length) return 'NA';
    const initials = name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('');
    return initials;
  }, [props.name]);

  return (
    <Grid container width='fit-content' flexWrap='nowrap' columnGap='12px' alignItems='center'>
      <Avatar>{nameInitials}</Avatar>
      <Grid container direction='column'>
        <Typography variant='caption'>{props.role}</Typography>
        <Grid container flexWrap='nowrap'>
          <Typography noWrap>{props.name}</Typography>
          <KeyboardArrowDown />
        </Grid>
      </Grid>
    </Grid>
  );
}
