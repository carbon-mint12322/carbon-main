const Ajv = require('ajv');
import { NextApiRequest, NextApiResponse } from 'next';
import { getModel } from '~/backendlib/db/adapter';
import { ModelDef } from '~/frontendlib/types';
import {
  getBulkCreateFn,
  getBulkUpdateFn,
  getCreateFn,
  getDeleteFn,
  getGetQueryFn,
  getListQueryFn,
  getPermittedRolesCreate,
  getPermittedRolesGet,
  getPermittedRolesList,
  getPermittedRolesUpdate,
  getUpdateFn,
  modelDefs,
} from './modelTable';

import { withPermittedRoles } from '~/backendlib/rbac';

import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { httpGetHandler } from '../middleware';
import { httpDeleteHandler } from '../middleware/delete-handler';

export const getModelApi = (schemaId: string) => getModel(schemaId);
export const collectiveSchema = '/farmbook/collective';
export const CollectiveApi = getModelApi(collectiveSchema);

// Constant for JSON content type
const JSON_CONTENT_TYPE = 'application/json';

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

ajv.addFormat('data-url', {
  type: 'string',
  validate: (dataUrl: any) => {
    if (typeof dataUrl === 'string') {
      return true;
    }
    return false; // any test that returns true/false
  },
});

ajv.addFormat('hidden', {
  type: 'any',
  validate: (hidden: any) => {
    return true; // any test that returns true/false
  },
});

export const schemaValidate = (addSchema: any, data: any) => {
  const validator = ajv.compile(addSchema);
  const isValid = validator(data);
  if (!isValid) {
    throw new Error(JSON.stringify(validator.errors));
  }
};

const extractQueryParams = (req: any) => req.query;
const extractRequestFromHttpCreateReq = (req: any) => req.body;

/**
 * Handler function for the create endpoint.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns A promise resolving to the response.
 */
export const createHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const createRequest = extractRequestFromHttpCreateReq(req);
  const orgSlug = req.query.org as string;
  const modelName = req.query.modelName as string;

  // Find the model definition for the given modelName
  const modelDef = modelDefs.find((m: ModelDef) => m.name === modelName);
  if (!modelDef) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  // Get the permitted roles for creating the model
  const permittedRoles = getPermittedRolesCreate(modelName);
  const withPermissions = withPermittedRoles(permittedRoles);
  const userId = (req as any)?.carbonMintUser?._id?.toString();
  // Compose the main handler with middleware functions
  const createInnerHandler = createMain(modelDef, orgSlug, createRequest, req);
  const main = withDebug(withPermissions(httpPostHandler(withMongo(createInnerHandler))));

  return main(req, res);
};

/**
 * Handler function for the list endpoint.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns A promise resolving to the response.
 */
export const listHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const filter = extractQueryParams(req);
  const orgSlug = filter.org;
  delete filter.org;

  const modelName = req.query.modelName as string;
  delete filter.modelName;

  // Find the model definition for the given modelName
  const modelDef = modelDefs.find((m: ModelDef) => m.name === modelName);
  if (!modelDef) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const permittedRoles = getPermittedRolesList(modelName);

  // Compose the main handler with middleware functions
  const withPermissions = withPermittedRoles(permittedRoles);
  const listInnerHandler = listMain(modelDef, filter, orgSlug);
  const main = withDebug(withPermissions(httpGetHandler(withMongo(listInnerHandler))));
  return main(req, res);
};

/**
 * Handler function for the get endpoint.
 * @param _req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns A promise resolving to the response.
 */
export const getHandler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const req = extractQueryParams(_req);
  const orgSlug = req.org;
  const { id, modelName, simple } : { modelName: string; id: string; simple?: boolean } = req;

  // Find the model definition for the given modelName
  const modelDef = modelDefs.find((m: ModelDef) => m.name === modelName);
  if (!modelDef) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const permittedRoles = getPermittedRolesGet(modelName);

  // Compose the main handler with middleware functions
  const withPermissions = withPermittedRoles(permittedRoles);
  const getInnerHandler = getMain(id, modelDef, orgSlug, simple || false );
  const main = withDebug(withPermissions(httpGetHandler(withMongo(getInnerHandler))));
  return main(_req, res);
};

/**
 * Handler function for the update endpoint.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns A promise resolving to the response.
 */
export const updateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const updateRequest = extractRequestFromHttpCreateReq(req);
  const { org, id, modelName }: { org: string; modelName: string; id: string } = req.query as any;
  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }

  // Find the model definition for the given modelName
  const modelDef = modelDefs.find((m: ModelDef) => m.name === modelName);
  if (!modelDef) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const schema = modelDef.schema;
  const permittedRoles = getPermittedRolesUpdate(modelName);

  const mods = updateRequest;

  // Compose the main handler with middleware functions
  const withPermissions = withPermittedRoles(permittedRoles);
  const updateInnerHandler = updateMain(id, modelDef, org, mods, req);
  const main = withDebug(withPermissions(httpPostHandler(withMongo(updateInnerHandler))));

  return main(req, res);
};

/**
 * Handler function for the update endpoint.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns A promise resolving to the response.
 */
export const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { org, id, modelName }: { org: string; modelName: string; id: string } = req.query as any;

  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }

  // Find the model definition for the given modelName
  const modelDef = modelDefs.find((m: ModelDef) => m.name === modelName);
  if (!modelDef) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const permittedRoles = getPermittedRolesUpdate(modelName);

  // Compose the main handler with middleware functions
  const withPermissions = withPermittedRoles(permittedRoles);
  const userId = (req as any)?.carbonMintUser?._id?.toString();
  const deleteInnerHandler = deleteMain(id, modelDef, org, req);
  const main = withDebug(withPermissions(httpDeleteHandler(withMongo(deleteInnerHandler))));

  return main(req, res);
};

/**
 * Handler function for the create endpoint.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns A promise resolving to the response.
 */
export const bulkCreateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const createRequest = extractRequestFromHttpCreateReq(req);
  const orgSlug = req.query.org as string;
  const modelName = req.query.modelName as string;

  // Find the model definition for the given modelName
  const modelDef = modelDefs.find((m: ModelDef) => m.name === modelName);
  if (!modelDef) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  // Get the permitted roles for creating the model
  const permittedRoles = getPermittedRolesCreate(modelName);
  const withPermissions = withPermittedRoles(permittedRoles);
  // Compose the main handler with middleware functions
  const bulkCreateInnerHandler = bulkCreateMain(modelDef, orgSlug, createRequest, req);
  const main = withDebug(withPermissions(httpPostHandler(withMongo(bulkCreateInnerHandler))));

  return main(req, res);
};

/**
 * Handler function for the create endpoint.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns A promise resolving to the response.
 */
export const bulkUpdateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const updateRequest = extractRequestFromHttpCreateReq(req);
  const orgSlug = req.query.org as string;
  const modelName = req.query.modelName as string;

  // Find the model definition for the given modelName
  const modelDef = modelDefs.find((m: ModelDef) => m.name === modelName);
  if (!modelDef) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const schema = modelDef.schema;
  const permittedRoles = getPermittedRolesUpdate(modelName);

  // Compose the main handler with middleware functions
  const withPermissions = withPermittedRoles(permittedRoles);
  const bulkUpdateInnerHandler = bulkUpdateMain(modelDef, orgSlug, updateRequest, req);
  const main = withDebug(withPermissions(httpPostHandler(withMongo(bulkUpdateInnerHandler))));

  return main(req, res);
};

/**
 * Creates the main handler function for creating a model.
 * @param modelName - The name of the model.
 * @param schemaId - The schema ID for the model.
 * @param schema - The JSON schema for validating the request data.
 * @param orgSlug - The organization slug.
 * @param userId - The user ID.
 * @param requestData - The request data.
 * @returns The main handler function.
 */
function createMain(modelDef: ModelDef, orgSlug: string, requestData: any, req: any) {
  const modelName = modelDef.name;
  const schema = modelDef.createSchema || modelDef.schema;
  const schemaId = modelDef.schemaId || `/farmbook/${modelName}`;
  const validator = ajv.compile(schema);
  return async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
      res.setHeader('Content-Type', JSON_CONTENT_TYPE);

      // Validate the request data against the JSON schema
      if (!validator(requestData)) {
        return res.status(400).json({ error: 'Invalid input. JSON schema validation failed' });
      }

      // Fetch the collective by slug
      const collective = await CollectiveApi.getByFilter({ slug: orgSlug });
      const collectiveId = collective._id.toString();

      // Get the create function for the model
      const createFn = getCreateFn(modelName);

      // Create the model using the create function
      const result = await createFn(
        {
          requestData,
          collective: { id: collectiveId, name: collective.name, slug: collective.slug },
        },
        (req as any)?.carbonMintUser?._id?.toString(),
      );

      // Return the created model as the response
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in createMain:', error);
      res.status(500).json({ error: error?.message });
    }
  };
}

/**
 * Creates the main handler function for updating a model.
 * @param id - The ID of the model to update.
 * @param modelDef - The model definition.
 * @param _orgSlug - The organization slug.
 * @param userId - The user ID.
 * @param mods - The modifications to apply to the model.
 * @returns The main handler function.
 */
function updateMain(id: string, modelDef: ModelDef, _orgSlug: string, mods: any, req: any) {
  const modelName: string = modelDef.name;
  const _schemaId: string | undefined = modelDef.schemaId;
  const schema: any = modelDef.schema;
  const schemaId = _schemaId || `/farmbook/${modelName}`;
  const validator = ajv.compile(schema);
  const modelApi = getModel(schemaId);
  return async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      // Retrieve the current model
      // const current = await modelApi.get(id);

      // TODO need to find a way to validate updates, commenting this for now.
      // Apply the modifications to the current model
      // const modified = { ...current, ...mods };

      // // Validate the modified model against the JSON schema
      // const isValid = validator(modified);
      // if (!isValid) {
      //   return res.status(400).json({ error: 'Invalid input. JSON schema validation failed' });
      // }
      // Invoke the update function to update the model
      const updateFn = getUpdateFn(modelName);
      const result = await updateFn(
        id,
        mods,
        (req as any)?.carbonMintUser?._id?.toString(),
        _orgSlug,
      );

      // Set the response content type and send the updated model as the response
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in updateMain:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Creates the main handler function for retrieving a model.
 * @param id - The ID of the model to retrieve.
 * @param modelDef - The model definition.
 * @param orgSlug - The organization slug.
 * @returns The main handler function.
 */
function getMain(id: string, modelDef: ModelDef, orgSlug: string, simple: boolean) {
  const modelName = modelDef.name;
  const getFn = getGetQueryFn(modelName, simple);
  return async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    try {
      // Retrieve the model using the get query function and the provided ID
      const result = await getFn(id);

      // Set the response content type and send the result as the response
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getMain:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Creates the main handler function for listing models.
 * @param modelDef - The model definition.
 * @param filter - The filter parameters for listing.
 * @param orgSlug - The organization slug.
 * @returns The main handler function.
 */
function listMain(modelDef: ModelDef, filter: any, orgSlug: string) {
  const modelName = modelDef.name;
  const listFn = getListQueryFn(modelName);
  return async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    try {
      // Fetch the collective by slug
      const collective = await CollectiveApi.getByFilter({ slug: orgSlug });
      const collectiveId = collective._id.toString();

      // Invoke the list query function with the provided filter and collective ID
      const result = await listFn(
        {
          ...filter,
        },
        collectiveId,
        orgSlug,
        (req as any)?.carbonMintUser,
      );

      const resultWithIds = result.map((item: any) => ({
        id: item._id?.toString(),
        ...item,
      }));

      // Set the response content type and send the result as the response
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(resultWithIds);
    } catch (error) {
      console.error('Error in listMain:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Creates the main handler function for deleting objects.
 * @param id - ID of the object being deleted
 * @param modelDef - The model definition.
 * @param orgSlug - The organization slug.
 * @returns The main handler function.
 */
function deleteMain(id: string, modelDef: ModelDef, org: string, req: any) {
  const modelName: string = modelDef.name;
  return async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Invoke the update function to update the model
      const deleteFn = getDeleteFn(modelName);
      const result = await deleteFn(id, org, (req as any)?.carbonMintUser?._id?.toString());
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in deleteMain:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Creates the main handler function for creating a model.
 * @param modelName - The name of the model.
 * @param schemaId - The schema ID for the model.
 * @param schema - The JSON schema for validating the request data.
 * @param orgSlug - The organization slug.
 * @param userId - The user ID.
 * @param requestData - The request data.
 * @returns The main handler function.
 */
function bulkCreateMain(modelDef: ModelDef, orgSlug: string, requestData: any, req: any) {
  const modelName = modelDef.name;
  return async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
      res.setHeader('Content-Type', JSON_CONTENT_TYPE);

      // Fetch the collective by slug
      const collective = await CollectiveApi.getByFilter({ slug: orgSlug });
      const collectiveId = collective._id.toString();

      // Get the create function for the model
      const createFn = getBulkCreateFn(modelName);
      // Create the model using the create function
      const result = await createFn(
        {
          requestData,
          collective: { id: collectiveId, name: collective.name, slug: collective.slug },
        },
        (req as any)?.carbonMintUser?._id?.toString(),
      );
      // Return the created model as the response
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in bulkCreateMain:', error);
      res.status(500).json({ error: error?.message });
    }
  };
}

/**
 * Creates the main handler function for updating a model.
 * @param modelName - The name of the model.
 * @param schemaId - The schema ID for the model.
 * @param schema - The JSON schema for validating the request data.
 * @param orgSlug - The organization slug.
 * @param userId - The user ID.
 * @param requestData - The request data.
 * @returns The main handler function.
 */
function bulkUpdateMain(modelDef: ModelDef, orgSlug: string, requestData: any, req: any) {
  const modelName = modelDef.name;
  return async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
      res.setHeader('Content-Type', JSON_CONTENT_TYPE);

      // Fetch the collective by slug
      const collective = await CollectiveApi.getByFilter({ slug: orgSlug });
      const collectiveId = collective._id.toString();

      // Get the update function for the model
      const updateFn = getBulkUpdateFn(modelName);
      // Create the model using the create function
      const result = await updateFn(
        {
          requestData,
          collective: { id: collectiveId, name: collective.name, slug: collective.slug },
        },
        '',
      );
      // Return the updated models as the response
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in bulkUpdateMain:', error);
      res.status(500).json({ error: error?.message });
    }
  };
}
