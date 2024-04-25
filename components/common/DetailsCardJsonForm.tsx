import React from 'react';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import { SxProps } from '@mui/material';

import ReadOnlyView from '~/components/lib/ReadOnlyRjsf';

interface DetailsCardJsonFormProps {
  title?: string;
  schema: any;
  formData: any;
  uiSchema?: any;
  readonly?: boolean;
  cardStyle?: SxProps;
  cardTitleBarStyle?: SxProps;
  handleMainBtnClick: () => void;
}

export interface Item {
  url?: any;
  title?: string;
  subText?: string;
}

const styles = {
  cardTitleBarStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardStyle: {
    padding: '32px 48px',
  },
};

function DetailsCardJsonForm({
  cardStyle = {},
  cardTitleBarStyle = {},
  title,
  schema,
  uiSchema,
  handleMainBtnClick,
  formData,
}: DetailsCardJsonFormProps) {
  return (
    <Paper sx={{ ...styles.cardStyle, ...cardStyle }} elevation={0} square={true}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ReadOnlyView schema={schema} uiSchema={uiSchema} formData={formData} readonly={true} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ ...styles.cardTitleBarStyle, ...cardTitleBarStyle }}>
            <Button
              variant={'contained'}
              color={'primary'}
              onClick={handleMainBtnClick}
              size={'small'}
              sx={{marginTop:'38px'}}
            >
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default DetailsCardJsonForm;
