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


// Generated code
const Ajv = require('ajv');

const farmerLpSchemaId = `/farmbook/landparcel_farmers`;
const collectiveSchemaId = `/farmbook/collectives`;
const permittedRoles = getCreateRoles(farmerLpSchemaId);
const farmerLpModel = getModel(farmerLpSchemaId);
const collectiveModel = getModel(collectiveSchemaId);

const extractRequestFromHttpReq = (req: any) => req.body;
const extractRequestFromHttpReqQuery = (req: any) => req.query;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    const data = extractRequestFromHttpReq(req);
    const { org } = extractRequestFromHttpReqQuery(req);
    res.setHeader('Content-Type', 'application/json');
    try {
        // const collective = await collectiveModel.getByFilter({ slug: org });
        const ospYear = parseInt(Object.keys(data[0])[0])
        data.splice(0, 2);
        const formattedData = transformData({ inputData: data, ospYear })
        const filteredData = formattedData
            .filter((item: any) => item.crops.length)


        filteredData.map(async (item: any) => {
            const farmer = await farmerLpModel.aggregate([
                { $match: { landParcel: item.landParcel.id, } },
                { $addFields: { landParcelId: { $toObjectId: "$landParcel" } } },
                {
                    $lookup: {
                        from: model2collection('landparcels'),
                        localField: "landParcelId",
                        foreignField: "_id",
                        as: "landParcelObj",
                    },
                },
                { $unwind: { path: "$landParcelObj" } },
                {
                    $project: {
                        farmer: 1,
                        lat: "$landParcelObj.location.lat",
                        lng: "$landParcelObj.location.lng"
                    },
                }
            ])
            if (!farmer?.length || !farmer[0]?.farmer) {
                return
            }
            try {
                await createFarmerOSP({
                    ...item,
                    latitude: farmer[0]?.lat.toString(),
                    longitude: farmer[0]?.lng.toString(),

                    _id: new ObjectId(),
                    fbId: generateLocalId(org, 'OS'),
                    createdAt: new Date().toISOString(),
                },
                    farmer[0]?.farmer)
            } catch (error) {
                console.log({ error })
            }
        })

        res.status(200).json(filteredData);
    } catch (error: any) {
        console.log('🚀 ~ file: OSP - uploadDataFromTemplate ~ handler ~ error:', error);

        res.status(400).json({ error: JSON.parse(error.message) });
    }
};



const transformData = ({ inputData, ospYear }: any) => {
    return inputData.map((item: any) => {
        const transformedItem: any = {
            year: ospYear, crops: [],
            totalArea: item['__EMPTY_4'],
        };

        for (let i = 5; i <= 28; i += 7) {
            if (item[`__EMPTY_${i}`]) {
                transformedItem.crops.push({
                    crop: item[`__EMPTY_${i}`],
                    variety: item[`__EMPTY_${i + 1}`],
                    cropType: item[`__EMPTY_${i + 2}`],
                    season: item[`__EMPTY_${i + 3}`],
                    cropArea: item[`__EMPTY_${i + 4}`],
                    estQty: item[`__EMPTY_${i + 5}`],
                    sowingDate: moment(item[`__EMPTY_${i + 6}`]).format('YYYY-MM-DD'),
                });
            }
        }

        transformedItem.landParcel = {
            id: item['__EMPTY_2'],
            name: item['__EMPTY_3'],
        };

        return transformedItem;
    });
};



// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPostHandler(withMongo(handler))));
