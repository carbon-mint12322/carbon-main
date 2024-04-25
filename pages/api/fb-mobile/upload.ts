import { NextApiRequest, NextApiResponse } from 'next';
import { getCreateRoles, withPermittedRoles } from '~/backendlib/rbac';
import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';

import * as T from '~/backendlib/workflow/types';

import { uploadDataUrlToGridFs, uploadFormFile } from '~/backendlib/upload/file';

const schemaId = T.wfInstSchemaId;

const permittedRoles = getCreateRoles(schemaId);

const extractRequestFromHttpReq = (req: any) => req.body;

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    res.setHeader('Content-Type', 'application/json');
    try {
        const inputBody = extractRequestFromHttpReq(req);
        let response: any = []
        if (inputBody && Array.isArray(inputBody)) {
            for (let item of inputBody) {
                if (item.image) {
                    response.push(uploadFile(item?.image, item?.metadata || {}))
                } else {
                    response.push(new Promise((resolve, reject) => reject(new Error('File not found'))))
                }
            }
        } else if (inputBody.image) {
            response = [uploadFile(inputBody.image, inputBody.metadata || {})]
        } else {
            response = [new Promise((resolve, reject) => reject(new Error('File not found')))]
        }

        response = await Promise.all(response)
        res.status(200).json(response);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
}

async function uploadFile(image: string, metadata = {}) {
    const fileUploadResponse = await uploadDataUrlToGridFs(image, 'EvidenceSubmissionImage', metadata)
    if (!(fileUploadResponse)) {
        return null
    } else {
        return fileUploadResponse
    }
}

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPostHandler(withMongo(handler))));
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
            responseLimit: false,
        },
    },
};
