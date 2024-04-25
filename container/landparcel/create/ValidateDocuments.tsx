import * as React from 'react';
import { Typography, Grid, TextField } from '@mui/material';
import { FieldProps, WidgetProps } from '@rjsf/utils';
import Link from 'next/link';

import InfoCardAction from './InfoCardAction';
import UploadFiles from '~/components/ui/UploadFiles';
import { CustomWidgetsProps } from '~/frontendlib/dataModel';

export interface FormData {
  applicationNumber: string;
  report: string;
}

export interface GovtMoreInfProps extends FieldProps {}

export function GovtMoreInfo(props: GovtMoreInfProps) {
  return (
    <Grid item>
      <InfoCardAction
        header='Get a Govt. survey done and upload the report'
        desc=''
        action={
          <Link href='/'>
            <Typography noWrap color='#F79023' fontSize='14px' fontWeight='600'>
              Learn more about this
            </Typography>
          </Link>
        }
      />
    </Grid>
  );
}

export interface GovtApplicationInputProps extends FieldProps {}

export function GovtApplicationInput(props: GovtApplicationInputProps) {
  return (
    <Grid item>
      <InfoCardAction
        header={`Enter Application number${props.required ? ' *' : ''}`}
        desc='If you have already applied for a survey'
        action={
          <TextField
            label='Application number'
            variant='outlined'
            fullWidth
            value={props.value}
            onChange={(event) => props.onChange(event.target.value)}
          />
        }
      />
    </Grid>
  );
}

export interface GovtUploadInputProps extends FieldProps {}

export function GovtUploadInput(props: GovtUploadInputProps) {
  return (
    <InfoCardAction
      header={`Upload the report${props.required ? ' *' : ''}`}
      desc='If you have the survey report ready'
      action={<UploadFiles {...props} />}
    />
  );
}
