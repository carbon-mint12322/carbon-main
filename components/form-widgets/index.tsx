import React from 'react';
import { WidgetProps, RegistryWidgetsType } from '@rjsf/utils';

import ReferenceSelectorWidget from './ReferenceSelectorWidget';

import UploadFiles from '~/components/ui/UploadFiles';
/**
 * Custom widgets to be used with RJSF
 */

import Typography from '@mui/material/Typography';
import UploadFilesWithAttachments from '../ui/UploadFilesWithAttachments';

export const GeoLocationWidget = (props: WidgetProps) => (
  <Typography sx={{ color: 'red', variant: 'caption' }}>Geo</Typography>
);
export const WaterSourceTableWidget = (props: WidgetProps) => (
  <Typography sx={{ color: 'red', variant: 'caption' }}>water src table</Typography>
);
export const PowerSourceTableWidget = (props: WidgetProps) => (
  <Typography sx={{ color: 'red', variant: 'caption' }}>power src table</Typography>
);
export const FacilityTableWidget = (props: WidgetProps) => (
  <Typography sx={{ color: 'red', variant: 'caption' }}>facility table</Typography>
);
export const AlliedActivityTableWidget = (props: WidgetProps) => (
  <Typography sx={{ color: 'red', variant: 'caption' }}>Allied act table</Typography>
);

const Hidden = () => <div />;

export const UploadFilesWidget = (props: WidgetProps) => {
  return <UploadFiles key={props.id} data-name={props.id} {...props} />;
};
export const UploadFilesWithAttachmentsWidget = (props: WidgetProps) => {
  return <UploadFilesWithAttachments key={props.id} data-name={props.id} {...props} />;
};

const lib: RegistryWidgetsType = {
  GeoLocationWidget,
  WaterSourceTableWidget,
  PowerSourceTableWidget,
  FacilityTableWidget,
  AlliedActivityTableWidget,

  ReferenceSelectorWidget,
  FileWidget: UploadFilesWidget,
  HiddenWidget: Hidden,
  UploadFilesWithAttachmentsWidget,
};

export default lib;
