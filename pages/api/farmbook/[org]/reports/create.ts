import { mongoFilePublicLink, uploadContentToGridFs } from '~/backendlib/upload/file';
import { eventReportViewQuery } from '~/backendlib/db/dbviews/reports/eventReport';
import generateReportSchema from '~/gen/jsonschemas/generateReport.json';
import {
  flattenData,
  flattenSchemaProperties,
  mapSelectedFieldsToData,
  parseJSONSchema,
} from '~/backendlib/util/updateKeyWithTitle';
import { getCreateRoles, withPermittedRoles } from '~/backendlib/rbac';
import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import farmerSchema from '~/gen/jsonschemas/farmerReport.json';
import cropSchema from '~/gen/jsonschemas/cropReport.json';
import landParcelSchema from '~/gen/jsonschemas/landparcelReport.json';
import solarDryerLoadEventReportSchema from '~/gen/jsonschemas/solarDryerLoadEventReport.json';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { NextApiRequest, NextApiResponse } from 'next';
import { getModel } from '~/backendlib/db/adapter';
import XLSX from 'xlsx';
import { landParcelReportQuery } from '~/backendlib/db/dbviews/reports/landParcelReport';
import { cropReportQuery } from '~/backendlib/db/dbviews/reports/cropsReport';
import { farmerReportQuery } from '~/backendlib/db/dbviews/reports/farmerReport';
import { fetchUserNameAndRole } from '~/backendlib/util/getUserNameRole';

// Generated code
const Ajv = require('ajv');

const schemaId = `/farmbook/reports`;
const permittedRoles = getCreateRoles(schemaId);
const modelApi = getModel(schemaId);

export const fileTypeToFileName: { [key: string]: string } = {
  solarDryerLoadEvent: 'Impact Reports from SolarDryer Load Events',
  farmers: 'Farmers',
  landparcels: 'Landparcels',
  crops: 'Crops',
};

export const getReportData = async ({
  reportType,
  dateRange,
  documentStatus,
  collective,
}: {
  reportType: string;
  dateRange?: {
    start: string;
    end: string;
  };
  documentStatus?: string;
  collective?: string;
}) => {
  const collectiveFilter = {
    ...(collective && collective !== 'all' ? { collective: collective } : {}),
  };

  const documentStatusFilter = {
    ...(documentStatus === 'active' || documentStatus === 'deactive'
      ? {
          active: documentStatus === 'active',
        }
      : {}),
  };

  const filter = {
    ...collectiveFilter,
    ...documentStatusFilter,
    ...(dateRange
      ? {
          createdAt: {
            $gte: dateRange.start,
            $lte: dateRange.end,
          },
        }
      : {}),
  };

  switch (reportType) {
    case 'solarDryerLoadEvent': {
      return eventReportViewQuery(reportType, dateRange, {
        ...documentStatusFilter,
      });
    }

    case 'landparcels':
      return landParcelReportQuery(filter);

    case 'farmers':
      return farmerReportQuery(filter);

    case 'crops':
      return cropReportQuery(filter);

    default: {
      return {};
    }
  }
};

const schemas: {
  [key: string]: any;
} = {
  crops: cropSchema,
  landparcels: landParcelSchema,
  farmers: farmerSchema,
  solarDryerLoadEvent: solarDryerLoadEventReportSchema,
};

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

ajv.addFormat('date', {
  type: 'string',
  validate: (date: any) => {
    if (typeof date === 'string') {
      return true;
    }
    return false; // any test that returns true/false
  },
});

const validator = ajv.compile(generateReportSchema);

export const generateReport = async (data: any, userId: string, query: any) => {
  const isValid = validator(data);
  if (!isValid) {
    throw new Error(JSON.stringify(validator.errors));
  }
  const parsedData = JSON.parse(JSON.stringify(data));

  const result = await modelApi.aggregate([
    {
      $match: {
        reportName: parsedData.reportName,
      },
    },
  ]);

  if (result.length > 0) {
    throw new Error('{"message": "File name already exists in the system"}');
  }

  const reportData = await getReportData(parsedData);

  if (reportData?.length === 0) {
    throw new Error('{"message": "No Data as per the Selection Criteria"}');
  }

  const flattenReportData = flattenData(reportData);

  const schemaObj = parseJSONSchema(schemas[parsedData.reportType as string]);
  const flattenSchema = flattenSchemaProperties(schemaObj);
  const selectedFields = parsedData.customFields
    ? parsedData.customFields
    : Object.keys(flattenSchema);
  const filteredData = mapSelectedFieldsToData(flattenReportData, flattenSchema, selectedFields);
  const workSheet = XLSX.utils.json_to_sheet(filteredData);
  const workBook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');

  const buffer = XLSX.write(workBook, { type: 'buffer', bookType: 'xlsx' });

  const createdAt = new Date().toISOString();
  const fileName = `${parsedData.reportName}.xlsx`;
  const fieldName = `${parsedData.reportName}-${fileTypeToFileName[parsedData.reportType]}-report`;

  const userNameRole = await fetchUserNameAndRole(userId);

  const fileUploadResults = await uploadContentToGridFs(buffer, fieldName, fileName, {
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    originalFileName: fileName,
    fieldName: fieldName,
    fileType: 'xlsx',
  });

  return modelApi.create(
    {
      ...parsedData,
      createdAt: createdAt,
      // reportName: `${parsedData.reportType} (${parsedData.dateRange.start} - ${parsedData.dateRange.end})`,
      reportUrl: mongoFilePublicLink(fileUploadResults),
      createdBy: { id: userId, ...userNameRole },
    },
    userId,
  );
};

const extractRequestFromHttpReq = (req: any) => req.body;
const extractRequestFromHttpReqQuery = (req: any) => req.query;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const createRequest = extractRequestFromHttpReq(req);
  const query = extractRequestFromHttpReqQuery(req);
  res.setHeader('Content-Type', 'application/json');

  try {
    const result = await generateReport(
      createRequest,
      (req as any)?.carbonMintUser?._id?.toString(),
      query,
    );
    res.status(200).json(result);
  } catch (error: any) {
    console.log('🚀 ~ file: create.ts:213 ~ handler ~ error:', error);

    res.status(400).json({ error: JSON.parse(error.message) });
  }
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPostHandler(withMongo(handler))));
