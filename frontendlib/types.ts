export type Color = `#${string}`;

export type CropT = {
  actualSowingDate: string;
  actualHarvestDate: string;
  areaInAcres: number;
  actualYieldTonnes: number;
  complianceScore: number;
  climateScore: number;
  cropType: string;
  name: string;
  qualityPercentile: number;
  seedSource: string;
  seedVariety: string;
};



export interface ModelDef {
  name: string;
  schema: any;
  schemaId?: string;
  createSchema?: any;
  createRoles?: string[];
  getRoles?: string[];
  listRoles?: string[];
  updateRoles?: string[];

  listQueryFn?: (filter: any, collectiveId?: string, orgSlug?: string, user?: any) => Promise<any>;
  getQueryFn?: (id: string, simple?: boolean) => Promise<any>;
  updateFn?: (id: string, mods: any, userId: string, _orgSlug?: string) => Promise<void>;
  createFn?: (data: any, userId: string) => Promise<void>;
  deleteFn?: (id: string, org: string, userId: string) => Promise<void>;
  bulkCreateFn?: (data: any, userId: string) => Promise<void>;
  bulkUpdateFn?: (mods: any, userId: string, _orgSlug?: string) => Promise<void>;
}
