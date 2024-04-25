import React from 'react';
import dynamic from 'next/dynamic';
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
const Add_farmerinspectionEditor = dynamic(
  import('~/gen/data-views/add_farmerinspection/add_farmerinspectionEditor.rtml'),
);
const Add_collectiveinspectionEditor = dynamic(
  import('~/gen/data-views/add_collectiveinspection/add_collectiveinspectionEditor.rtml'),
);
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import { useOperator } from '~/contexts/OperatorContext';
import axios from 'axios';

interface CollectiveInspectionDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveInspectionDetails({
  data,
  reFetch,
  modelName,
}: CollectiveInspectionDetailsProps) {
  const { getAPIPrefix } = useOperator();

  const childResourceUriTable1 = 'external-inspection-details';

  const columnConfigTable1 = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.startDate),
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.endDate),
    },

    {
      field: 'inspectionDoneBy',
      headerName: 'Inspection Done By',
      flex: 1,
    },
    {
      field: 'cb',
      headerName: 'Certification Body',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.cb?.name,
    },
  ];

  const childResourceUriTable2 = 'inspection-details';

  const columnConfigTable2 = [
    {
      field: 'year',
      headerName: 'Inspection Year',
      width: 100,
      renderCell: (params: GridValueGetterParams) => params.row?.year,
    },
    {
      field: 'inspectoinNo',
      headerName: 'Inspection Number',
      width: 100,
      renderCell: (params: GridValueGetterParams) => params.row?.inspectionNo,
    },
    {
      field: 'farmerCode',
      headerName: 'Farmer Code',
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.operatorDetails?.farmerID || ''}`,

      width: 100,
    },
    {
      field: 'landParcel',
      headerName: 'Land Parcel',
      valueGetter: (params: GridValueGetterParams) => `${params.row.landParcel.name || ''}`,
      width: 100,
    },

    {
      field: 'farmername',
      headerName: 'Farmer/Processor Name',

      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalDetails?.firstName + ' ' + (params.row.personalDetails?.lastName || '')
        }  `,
    },
    {
      field: 'fathersname',
      headerName: 'Fathers Name',

      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalDetails?.fathersHusbandsName || ''}`,
    },
    {
      field: 'village',
      headerName: 'Village',

      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalDetails.address.village || ''}`,
      width: 200,
    },
    {
      field: 'tehsil',
      headerName: 'Tehsil/Taluka/Mandal',

      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalDetails.address.mandal || ''}`,
    },
    {
      field: 'state',
      headerName: 'State',

      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalDetails.address.state || ''}`,
    },
    {
      field: 'pincode',
      headerName: 'Pincode',

      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalDetails.address.pincode || ''}`,
    },
    // {
    //   field: 'totalarea',
    //   headerName: 'Total Area (Ha)',

    //   width: 200,
    //   valueGetter: (params: GridValueGetterParams) =>
    //     `${
    //       params.row.landParcelList[0]?.areaInAcres ? params.row.landParcelList[0]?.areaInAcres : ''
    //     }`,
    // },
    // {
    //   field: 'surveyNo',
    //   headerName: 'Survey No/Khasara No',

    //   width: 200,
    //   valueGetter: (params: GridValueGetterParams) =>
    //     `${
    //       params.row.landParcelList[0]?.surveyNumber
    //         ? params.row.landParcelList[0]?.surveyNumber
    //         : ''
    //     }`,
    // },
    // {
    //   field: 'latitude',
    //   headerName: 'Latitude',

    //   width: 200,
    //   valueGetter: (params: GridValueGetterParams) =>
    //     `${
    //       params.row.landParcelList[0]?.location ? params.row.landParcelList[0]?.location.lat : ''
    //     }`,
    // },
    // {
    //   field: 'longitude',
    //   headerName: 'Longitude',

    //   width: 200,
    //   valueGetter: (params: GridValueGetterParams) =>
    //     `${
    //       params.row.landParcelList[0]?.location ? params.row.landParcelList[0]?.location.lng : ''
    //     }`,
    // },
    {
      field: 'crop1',
      headerName: 'Crop',

      width: 200,
      valueGetter: (params: GridValueGetterParams) => `${params.row.crops[0]?.cropName}`,
    },

    {
      field: 'cropArea1',
      headerName: 'Crop Area (Ha)',

      width: 100,
      valueGetter: (params: GridValueGetterParams) => `${params.row.crops[0]?.area}`,
    },
    {
      field: 'estQty1',
      headerName: 'Estimated Yield (MT)',

      width: 100,
      valueGetter: (params: GridValueGetterParams) => `${params.row.crops[0]?.estYield}`,
    },

    {
      field: 'crop2',
      headerName: 'Crop',
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.crops[1]?.crop ? params.row.crops[1]?.cropName : ''}`,
    },

    {
      field: 'cropArea2',
      headerName: 'Crop Area (Ha)',
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.crops[1]?.cropArea ? params.row.crops[1]?.area : ''}`,
    },
    {
      field: 'estQty2',
      headerName: 'Estimated Yield (MT)',
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.crops[1]?.estQty ? params.row.crops[1]?.estYield : ''}`,
    },

    {
      field: 'inspectionDate',
      headerName: 'Inspection Date',
      width: 200,
      renderCell: (params: GridValueGetterParams) =>
        stringDateFormatter(params.row?.inspectionDate),
    },

    {
      field: 'inspector',
      headerName: 'Name of Inspector',
      width: 200,
      renderCell: (params: GridValueGetterParams) => params.row?.inspector,
    },
    {
      field: 'results',
      headerName: 'Result of inspection',
      width: 200,
      renderCell: (params: GridValueGetterParams) => params.row?.results,
    },
  ];

  async function defaultListFilter(options: any) {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `${options.schemaId}`);
    return res.data;
  }

  const formContext: any = {
    foreignObjectLoader: defaultListFilter,
  };

  return (
    <>
      <NestedResourceListComponent
        Editor={Add_collectiveinspectionEditor}
        data={data?.externalInspectionDetails}
        parentData={data}
        reFetch={reFetch}
        modelName={modelName}
        childResourceUri={childResourceUriTable1}
        columnConfig={columnConfigTable1}
        formContext={formContext}
      />
      <br />
      <br />
      <NestedResourceListComponent
        Editor={Add_farmerinspectionEditor}
        data={data?.internalInspectionDetails}
        parentData={data}
        reFetch={reFetch}
        modelName={modelName}
        childResourceUri={childResourceUriTable2}
        columnConfig={columnConfigTable2}
        allowAdd={false}
      />
    </>
  );
}
