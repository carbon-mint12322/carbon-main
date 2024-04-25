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


// Generated code
const Ajv = require('ajv');

const farmerLpSchemaId = `/farmbook/landparcel_farmers`;
const collectiveSchemaId = `/farmbook/collectives`;
const permittedRoles = getCreateRoles(farmerLpSchemaId);
const farmerLpModel = getModel(farmerLpSchemaId);
const collectiveModel = getModel(collectiveSchemaId);

const extractRequestFromHttpReq = (req: any) => req.body;
const extractRequestFromHttpReqQuery = (req: any) => req.query;


const extraSecondary = [
    { key: "sourceOrganicPlanting", header: "Source Organic Planting", width: 30 },
    { key: "inputUsedInProduction", header: "Input used in production", width: 30 },
    { key: "contaminationControl", header: "Contamination Control(Buffer Zones)", width: 30 },
    { key: "pestWeedManagement", header: "Pest & Weed Management(Inputs Used)", width: 30 },
    { key: "nutrientManagement", header: "Nutrient Management (Inputs Used)", width: 30 },

]


const extraHeaders = [
    { key: "crop", header: "Crop", width: 20 },
    { key: "variety", header: "Variety", width: 20 },
    { key: "cropType", header: "Crop Type (M / I)", width: 20 },
    { key: "season", header: "Season", width: 20 },
    { key: "cropArea", header: "Crop Area (Ha)", width: 20 },
    { key: "estQty", header: "Est. Qty. (MT)", width: 20 },
    { key: "estSowDate", header: "Est. Sowing Date (YYYY-MM-DD)", width: 40 },
]
const Headers = [
    { key: "sNo", header: "Sr. No." },
    { key: "village", header: "Village", width: 20 },
    { key: "farmerName", header: "Farmer Name", width: 20 },
    { key: "farmerID", header: "Farmer Reg. No.(as on Tracenet)", width: 20 },
    { key: "landParcelId", header: "Land Parcel Id", width: 30 },
    { key: "landParcelName", header: "Land Parcel Name", width: 30 },
    { key: "areaInAcres", header: "Total Farm Area(Acres)", width: 30 },
]

const sheetColumns = [
    ...Headers,
    ...extraHeaders,
    ...extraHeaders,
    ...extraHeaders,
    ...extraHeaders,
    ...extraSecondary
]

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    const farmersIdList = extractRequestFromHttpReq(req);
    const { org } = extractRequestFromHttpReqQuery(req);
    res.setHeader('Content-Type', 'application/json');

    try {

        const collective = await collectiveModel.getByFilter({ slug: org });
        const farmerPipeline = [
            { $match: { farmer: { $in: farmersIdList }, } },
            {
                $addFields: {
                    farmerId: { $toObjectId: "$farmer" },
                    landParcelId: { $toObjectId: "$landParcel" }
                },
            },
            {
                $lookup: {
                    from: model2collection('farmers'),
                    localField: "farmerId",
                    foreignField: "_id",
                    as: "farmer",
                },
            },
            {
                $lookup: {
                    from: model2collection('landparcels'),
                    localField: "landParcelId",
                    foreignField: "_id",
                    as: "landParcel",
                },
            },

            { $unwind: "$landParcel" },
            { $unwind: "$farmer" },
            {
                $project: {
                    _id: 0,
                    landParcelId: { $toString: "$landParcelId" },
                    farmerName: {
                        $concat: [
                            "$farmer.personalDetails.firstName",
                            " ",
                            "$farmer.personalDetails.lastName"]
                    },
                    farmerID: "$farmer.operatorDetails.farmerID",
                    farmerFirstName: "$farmer.personalDetails.firstName",
                    farmerFbIdID: "$farmer.fbId",
                    village: "$farmer.personalDetails.address.village",
                    landParcelName: "$landParcel.name",
                    areaInAcres: "$landParcel.areaInAcres"

                }
            }
        ]

        const farmers = await farmerLpModel.aggregate(farmerPipeline)
        const farmerPostProcess = farmers.map(({
            landParcelId,
            farmerName,
            farmerID,
            village,
            landParcelName,
            areaInAcres,
            farmerFirstName,
            farmerFbIdID
        }: any, idx: number) => {
            return {
                sNo: idx + 1,
                village,
                farmerName: farmerName || farmerFirstName,
                farmerID: farmerID || farmerFbIdID,
                landParcelId,
                landParcelName,
                areaInAcres
            }
        })

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet 1');
        sheet.columns = sheetColumns
        sheet.insertRows(1, [
            ["OSP Year:", new Date().getFullYear()],
            ["Operator:", collective?.name]
        ])
        sheet.addRows(farmerPostProcess)
        sheet.getRows(1, 3)?.forEach(rr => {
            rr.font = { bold: true }
        })
        sheet.getRow(3).alignment = { horizontal: "center", wrapText: true }

        const buffer = await workbook.xlsx.writeBuffer();
        res.status(200).json(buffer);
    } catch (error: any) {
        console.log('🚀 ~ file: OSP - generateTemplate ~ handler ~ error:', error);

        res.status(400).json({ error: JSON.parse(error.message) });
    }
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPostHandler(withMongo(handler))));
