// uploadDataFromTemplate
import { getCreateRoles, withPermittedRoles } from '~/backendlib/rbac';
import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { NextApiRequest, NextApiResponse } from 'next';
import { getModel } from '~/backendlib/db/adapter';
import XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { ObjectId } from 'mongodb';
import { model2collection } from '~/backendlib/db/dbviews/util';
import { createFarmerOSP } from '~/backendlib/functions/createFarmerOSP';
import { generateLocalId } from '~/backendlib/db/util';
import moment from 'moment';
import { pipe, taplog as log } from '@carbon-mint/qrlib/build/main/lib/util/pipe';
import validateEntity from '~/backendlib/events/eventValidation'
import validateFields from '~/backendlib/events/fieldValidation'
import validateRows from '~/backendlib/validations/rowValidation'
import { uploadEventsBulk } from '~/backendlib/events/uploadEventsBulk';

// Generated code
const Ajv = require('ajv');

const eventSchemaId = `/farmbook/event`;
const eventModel = getModel(eventSchemaId);
const permittedRoles = getCreateRoles(eventSchemaId);

const extractRequestFromHttpReq = (req: any) => req.body;
const extractRequestFromHttpReqQuery = (req: any) => req.query;



const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    const data = extractRequestFromHttpReq(req);
    const { org, modelName } = extractRequestFromHttpReqQuery(req);
    const userId = (req as any)?.carbonMintUser?._id?.toString();
    res.setHeader('Content-Type', 'application/json');
    const inputData : any = { data, org, modelName, userId }
    try {
        const result = await uploadPipeline(inputData);
        res.status(200).json(result);

    } catch (error: any) {
        console.log('🚀 ~ file: OSP - uploadDataFromTemplate ~ handler ~ error:', error);

        res.status(400).json({ error: JSON.parse(error.message) });
    }
};


const uploadPipeline = pipe(
    // dumpEntrypoint,
    log('[uploading excel template]', 'Entity level Validation'),
    validateEntity,
    log('[uploading excel template]', 'Excel / Row level Validation'),
    validateRows,
    log('[uploading excel template]', 'Form / Field Level Validation'),
    validateFields,
    log('[uploading excel template]', 'Transform & Process Data'),
    uploadEventsBulk
);



// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPostHandler(withMongo(handler))));
