import React from 'react';
import { FieldProps, RegistryFieldsType } from '@rjsf/utils';

import MapLandBoundaries from '~/container/landparcel/create/MapLandBoundaries';
import {
  GovtMoreInfo,
  GovtApplicationInput,
  GovtUploadInput,
} from '~/container/landparcel/create/ValidateDocuments';

import MapLocation from '~/components/ui/MapLocation';

import { DgModalEditorField, ReferenceField } from '@carbon-mint/ui-components';

export const MapLandBoundariesWidget = (props: FieldProps) => {
  return <MapLandBoundaries {...props} />;
};

export const MapWidget = (props: FieldProps) => {
  return <MapLocation {...props} />;
};

export const GovtMoreInfoWidget = (props: FieldProps) => {
  return <GovtMoreInfo {...props} />;
};

export const GovtApplicationInputWidget = (props: FieldProps) => {
  return <GovtApplicationInput {...props} />;
};

export const GovtUploadInputWidget = (props: FieldProps) => {
  return <GovtUploadInput {...props} />;
};

export const DgFieldWidget = (props: FieldProps) => {
  return <DgModalEditorField {...props} />;
};

export const ReferenceFieldWidget = (props: FieldProps) => {
  return <ReferenceField {...props} />;
};

const Hidden = () => <div />;

const fields: RegistryFieldsType = {
  MapLandBoundariesField: MapLandBoundariesWidget,
  MapLocationField: MapWidget,
  GovtMoreInfoField: GovtMoreInfoWidget,
  GovtApplicationInputField: GovtApplicationInputWidget,
  GovtUploadInputField: GovtUploadInputWidget,
  DgField: DgFieldWidget,
  ReferenceField: ReferenceFieldWidget,
  Hidden: Hidden,
};
export default fields;
