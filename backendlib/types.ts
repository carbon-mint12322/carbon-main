import { StringNullableChain } from 'lodash';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
export type HandlerWithApi = (req: NextApiRequest, res: NextApiResponse, api: any) => Promise<void>;

export type JsonHandlerWithApi = (req: NextApiRequest, api: any) => Promise<object>;

export type GsspHandler = (context: any) => Promise<any>;

export enum Operation {
  CREATE,
  UPDATE,
  GET,
  LIST,
  DELETE,
}

export enum AccessAllowed {
  NO,
  YES,
}

export type CustomError = {
  type: string;
  message: string;
};

export type CustomHttpError = CustomError & {
  isHttpError: boolean;
  statusCode: number;
};

export type DynamicObject = { [key: string]: string };

export type UserDeviceTokenT = { userId: string; token: string };

export type UserDeviceT = {
  fcmToken: string;
  info: string;
};

export type MongoObjectT = {
  _id: string;
};

export const PlanEventStatuses = ['Pending', 'Completed'] as const;

export type SchemePlanEventT = {
  name: string;
  description: string;
  severity: string;
  score: number;
  range: {
    start: string; // will be DD/MM/YYY format
    end: string; // will be DD/MM/YYY format
  };
  notificationJobId?: string; // old method of reference
  notificationJobIds?: string[]; // new method of reference
  eventStatus: typeof PlanEventStatuses[number];
} & MongoObjectT;

export type PlanEventT = {
  period: string;
  name: string;
  activityType: string;
  technicalAdvice: string;
  range: {
    start: string; // will be DD/MM/YYY format
    end: string; // will be DD/MM/YYY format
  };
  notificationJobId?: string; // old method of reference
  notificationJobIds?: string[]; // new method of reference
  ccp: boolean;
  eventStatus: typeof PlanEventStatuses[number];
} & MongoObjectT;

export type PlanEventInputParamsT = PlanEventT & {
  repeated?: boolean;
  frequency?: number;
  ends?: number;
};

export type PlanT = MongoObjectT & { events: PlanEventT[]; cropId: string };

export type PlanEventParamsT = {
  userId: string;
  plan: PlanT;
  selectedPlanEvent: any;
  eventPlanToUpdate: any;
  newPlanEventObjectFromReq: PlanEventT;
  newSowingStartDate: string; // should be DD/MM/YYY format
  newSowingEndDate: string; // should be DD/MM/YYY format
  orgSlug: string;
  ccp: boolean;
  eventStatus: PlanEventT['eventStatus'];
  cropId?: string;
};

export type PlanEventInputParams = Omit<PlanEventParamsT, 'newPlanEventObjectFromReq'>;

export type PlanEventIndividualUpdateParamsT = {
  userId: string;
  plan: PlanT;
  eventPlanToUpdate: PlanEventT;
  orgSlug: string;
};

export interface IJsonSchema extends IConditionals {
  type: string;
  title: string;
  properties: Record<string, any>;
  allOf?: Array<Record<string, any>>;
  items?: IJsonSchema;
  $ref?: string;
  definitions?: { [key: string]: IJsonSchema };
}

interface IConditionals {
  if?: any;
  then?: Pick<IJsonSchema, 'properties'>;
  else?: Pick<IJsonSchema, 'properties'>;
}

export interface Event {
  fullDetails?: any;
  _id: string;
  name: string;
  createdAt: string;
  eventDate: string;
  days: string | number;
  description: string;
  isFirst: boolean;
  notFirst: boolean;
  isHarvestingEvent: boolean;
  isCurrentEvent: boolean;
}

export interface Map {
  lat: number;
  lng: number;
}
