import { Circle } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import _ from 'lodash';
import React, { ReactNode } from 'react';

interface IProps {
  marker: any;
}

export default function MarkerToolTip(props: IProps) {
  const { marker } = props;
  const subTexts: ReactNode[] = React.useMemo(() => {
    return (
      _.flatMap(
        marker?.subTexts?.map((text: string, index: number) => {
          let comps = [
            <Typography color='#959595' key={index}>
              {text}
            </Typography>,
          ];
          if (index < marker?.subTexts?.length - 1)
            comps.push(<Circle sx={{ color: '#959595', fontSize: '6px' }} key={index} />);
          return comps;
        }),
      ) || null
    );
  }, [marker]);

  const tags: ReactNode[] = React.useMemo(() => {
    return (
      _.flatMap(
        marker?.tags?.map((text: string, index: number) => (
          <Grid
            key={index}
            borderRadius='16px'
            bgcolor='#e3e3e3'
            px='8px'
            py='4px'
            maxWidth='fit-content'
          >
            <Typography>{text}</Typography>
          </Grid>
        )),
      ) || null
    );
  }, [marker]);

  return (
    <Grid container direction='column' flexWrap='nowrap' gap={1}>
      <Typography>{marker.title}</Typography>
      <Grid container flexWrap='nowrap' alignItems='center' gap='4px'>
        {subTexts}
      </Grid>
      {tags}
    </Grid>
  );
}
