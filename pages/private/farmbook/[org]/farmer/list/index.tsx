// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmersList/ui'
import axios from 'axios';

import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Dialog from '~/components/lib/Feedback/Dialog';
import _ from 'lodash';

import { Paper, Box, Grid, Typography, Tooltip } from '@mui/material';
import {
  GridRenderCellParams,
  GridColDef,
  GridValueGetterParams,
  GridRowParams,
  GridSelectionModel,
} from '@mui/x-data-grid';

import EnergySavingsLeafOutlinedIcon from '@mui/icons-material/EnergySavingsLeafOutlined';
import TitleBarGeneric from '~/components/TitleBarGeneric';

import CropChip from '~/components/CropChip';
import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import ListAction from '~/components/lib/ListAction';

import withAuth from '~/components/auth/withAuth';

import globalStyles from '~/styles/theme/brands/styles';
import CircularLoader from '~/components/common/CircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import dynamic from 'next/dynamic';

import { containFilterOperator } from '~/components/DataGridFilter/ContainFilterOperator';

import CustomFooter from '~/components/CustomFooter';

export { default as getServerSideProps } from '~/utils/ggsp';

import usePrevious from '../../../../../../utils/usePrevious';
import { useAlert } from '~/contexts/AlertContext';
import { filterDataByCustomKeys } from '~/components/lib/FilterDataByCustomKeys';
import { ReadPOPFromExcel } from '../../pop/create';
import moment from 'moment';
const FieldOfficerEditor = dynamic(
  import('~/gen/data-views/farmer_addfieldofficer/farmer_addfieldofficerEditor.rtml'),
);

function FarmersList() {
  const { changeRoute, getAPIPrefix, operator } = useOperator();
  const router = useRouter();

  const API_URL = getAPIPrefix() + '/farmer';
  const AGENTS_API_URL = `/api/farmbook/agent/list`;
  const [showInactive, setShowInactive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);
  const agentApi = useFetch<any>(AGENTS_API_URL);
  const { getApiUrl } = useOperator();
  const previousAgentApi: any = usePrevious(agentApi);
  const [updateInprogress, setUpdateInprogress] = React.useState<Boolean>(false);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const { openToast } = useAlert();
  const [uploadOSPDialog, setUploadOSPDialog] = useState(false);
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Farmers',
    subTitle: `Showing ${data
      ? showInactive
        ? data.filter((obj: any) => obj.active === false).length
        : data.filter((obj: any) => obj.active === true).length
      : 0
      } Farmers in total`,
    mainBtnTitle: `Add Farmer`,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: true,
    isSubBtnPresent: true,
    subBtnTitle: `Assign Field Officers`,
  });


  const handleSearch = (value: any) => {
    setSearchValue(value);
  };

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data
        ? showInactive
          ? data.filter((obj: any) => obj.active === false).length
          : data.filter((obj: any) => obj.active === true).length
        : 0
        } Farmers in total`,
    });
  }, [data]);


  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subBtnDisabled: showInactive || !selectionModel.length || !!updateInprogress,
      mainBtnOptions: selectionModel?.length ? mainBtnOptionsTemplate : [],
    });
  }, [selectionModel, updateInprogress]);

  const onChipClick = (e: MouseEvent<HTMLElement>, id: any) => {
    e.stopPropagation();
    changeRoute(`/crop/${id}`);
  };

  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/farmer/${params?.row?.id}`);
  };

  const handleMoreChipClick = (e: MouseEvent<HTMLElement>) => { };

  const mainBtnOptionsTemplate = [{
    label: "Download OSP Template",
    operation: () => getFarmerOSPTemplate()
  },
  {
    label: "Upload OSP",
    operation: () => setUploadOSPDialog(true)
  }]

  const getFarmerOSPTemplate = async () => {
    const { data } = await axios.post(getApiUrl('/osp/generateTemplate'), selectionModel);
    const buffer = Buffer.from(data);
    const blob = new Blob([buffer]);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = `Farmer OSP Template-${moment().format('yyyyMMDD')}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
    setSelectionModel([]);
  };

  function renderCropsCell(params: GridRenderCellParams) {
    return (
      <div className='hidden-scrollbar' style={{ width: '200px', overflowX: 'auto' }}>
        <CropChip
          params={params?.row?.crops || []}
          Icon={EnergySavingsLeafOutlinedIcon}
          handleChipClick={onChipClick}
          handleMoreChipClick={handleMoreChipClick}
        />
      </div>
    );
  }

  const handleActivation = () => {
    reFetch(API_URL);
  };

  function renderActionCell(params: GridRenderCellParams) {
    return (
      <ListAction
        canActivate={params?.row?.crops?.length ? false : true}
        canEdit={params?.row?.status == 'Draft' && params?.row?.crops?.length === 0 ? true : false}
        canDelete={params?.row?.crops?.length ? false : true}
        isActive={params.row.active}
        id={params.row.id}
        schema={'farmer'}
        onActivationClick={handleActivation}
      />
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'farmerName',
      headerName: 'Farmer Name',
      minWidth: 220,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalDetails?.firstName} ${params.row.personalDetails?.lastName ? params.row.personalDetails.lastName : ''
        }`,
    },
    {
      field: 'operatorDetails.farmerID',
      headerName: 'ID',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.operatorDetails?.farmerID
          ? `${params.row.operatorDetails?.farmerID}`
          : `${params.row.fbId}`,
      renderCell: (params: GridValueGetterParams) => (
        <Tooltip title='Click to view farmer details'>
          <span>
            {params.row.operatorDetails?.farmerID
              ? `${params.row.operatorDetails?.farmerID}`
              : `${params.row.fbId}`}
          </span>
        </Tooltip>
      ),
    },
    {
      field: 'personalDetails.primaryPhone',
      headerName: 'Phone Number',
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalDetails?.primaryPhone ? params.row.personalDetails?.primaryPhone : 'NA'
        }`,
      renderCell: (params: GridValueGetterParams) => (
        <Tooltip title='Click to view farmer details'>
          <span>{`${params.row.personalDetails?.primaryPhone
            ? params.row.personalDetails?.primaryPhone
            : 'NA'
            }`}</span>
        </Tooltip>
      ),
    },
    {
      field: 'personalDetails.address.village',
      headerName: 'Village',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalDetails?.address?.village}`,
      renderCell: (params: GridValueGetterParams) => (
        <Tooltip title='Click to view farmer details'>
          <span>{`${params.row.personalDetails?.address?.village}`}</span>
        </Tooltip>
      ),
    },
    {
      field: 'landparcels',
      headerName: 'Land Parcels',
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.landParcels?.length}`,
    },
    {
      field: 'areaInAcres',
      headerName: 'Total Area (Acres)',
      minWidth: 150,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.landParcels
          ? params.row.landParcels.reduce(
            (sum: number, landParcel: any) => sum + landParcel.areaInAcres,
            0
          )
          : 0,
    },
    {
      field: 'crops',
      headerName: 'Crops',
      sortable: false,
      minWidth: 200,
      flex: 1,
      renderCell: renderCropsCell,
      filterOperators: containFilterOperator,
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: false,
      minWidth: 200,
      flex: 1,
      renderCell: (params: GridValueGetterParams) => (
        <Tooltip title='Click to view farmer details'>
          <span>{`${params.row.active ? (params.row.status === 'editable' ? 'Draft' : params.row.status) : 'Deactivated'}`}</span>
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 100,
      flex: 1,
      renderCell: renderActionCell,
    },
  ];

  const searchData = useMemo(() => {
    const filterActive = (data: any[]) =>
      data?.filter((item: any) => (showInactive ? !item.active : item.active));

    if (searchValue?.length > 0) {
      return filterActive(
        filterDataByCustomKeys(data, searchValue, [
          'name',
          'operatorDetails.farmerID',
          'personalDetails.address.village',
          'crops.name',
        ]),
      );
    }
    return filterActive(data);
  }, [searchValue, data, showInactive]);

  const handleClose = () => {
    setIsOpen(false);
    setSelectionModel([]);
  };

  const handleOpen = (e: any) => {
    setIsOpen(true);
  };

  const [operatorList, setOperatorList]: any = useState([]);

  const [options, setOptions] = useState(
    agentApi?.data?.map((option: any) => ({
      label: `${option?.results?.[0]?.personalDetails?.firstName || ''} ${option?.results?.[0]?.personalDetails?.lastName || ''
        }`,
      value: option._id,
    })) || [],
  );

  useEffect(() => {
    if (previousAgentApi?.isLoading && !agentApi.isLoading) {
      setOptions(
        agentApi?.data?.map((option: any) => ({
          label: `${option?.results?.[0]?.personalDetails?.firstName || ''} ${option?.results?.[0]?.personalDetails?.lastName || ''
            }`,
          value: option._id,
        })) || [],
      );
    }
  }, [agentApi]);

  const bulkUpdate = async ({ fieldOfficer }: any) => {
    try {
      setUpdateInprogress(true);
      await axios.post(getApiUrl('/farmer/bulk'), {
        ids: selectionModel,
        payload: {
          agents: fieldOfficer?.map((operator: any) => operator.id),
        },
        operation: 'bulk',
      });
      setOptions([...options, ...operatorList]), setOperatorList([]);
      handleClose();
      openToast('success', 'Successfully assigned field officers to selected farmers!');
    } catch (error: any) {
      console.log(error?.response || error);
      openToast('error', 'Failed to assign field officers to selectd farmers');
    } finally {
      setUpdateInprogress(false);
    }
  };


  const uploadOSPFarmer = async (uploadData: any) => {
    const { data } = await axios.post(getApiUrl('/osp/uploadDataFromTemplate'), uploadData);
    openToast('success', 'Successfully upload OSP');
    setSelectionModel([]);
  }



  async function refFilter(options: any) {
    if (options?.uiOptions.filterKey === 'fieldOfficers') {
      const res: {
        data: any;
      } = await axios.get(`/api/farmbook/agent/list?collectives=${operator?._id}`);
      return res?.data?.map((item: any) => ({
        ...item,
        id: item._id,
        name: `${item.personalDetails.firstName || ''} ${item.personalDetails.lastName || ''}`,
      }));
    }
  }

  const formContext: any = {
    getApiUrl,
    foreignObjectLoader: refFilter,
  };

  const areaTotal = useMemo(
    () => {
      const total_area = _.round(
        _.sum(
          searchData?.map((item) =>
            Number(
              item.landParcels.reduce(
                (sum: number, landParcel: any) => sum + landParcel.areaInAcres,
                0
              )
            ) || 0
          ) || 0
        ),
        1
      );

      return { total_area };
    },
    [searchData]
  );

  return (
    <>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleMainBtnClick={() => {
          changeRoute('/farmer/create');
        }}
        handleSubBtnClick={handleOpen}
        handleSearch={handleSearch}
      />
      <ReadPOPFromExcel
        showUpload={uploadOSPDialog}
        setShowUpload={setUploadOSPDialog}
        onExcelDataFetched={uploadOSPFarmer}
        isExternal={true}
      />

      <Dialog open={isOpen} onClose={handleClose} maxWidth={'md'}>
        <Box sx={{ mt: 2, overflow: 'scroll' }}>
          <FieldOfficerEditor onSubmit={bulkUpdate} formContext={formContext} />{' '}
          <Typography variant={'subtitle2'} mt={1} sx={{ color: 'text.disabled' }}>
            *This action will remove the existing field officers from the farmers selected and
            update with the ones selected above.
          </Typography>
        </Box>
      </Dialog>

      <Paper elevation={0}>
        <CircularLoader value={loading}>
          <Box style={globalStyles.dataGridLayer}>
            <DataGrid
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              getRowId={(row) => row.id}
              onRowClick={handleRowClick}
              selectionModel={selectionModel}
              columns={columns}
              rows={searchData || []}
              disableColumnSelector={false}
              checkboxSelection
              isRowSelectable={(params: GridRowParams) => true}
              rowHeight={64}
              disableSelectionOnClick={false}
              sx={globalStyles.datagridSx}
              getRowClassName={(params: GridRowParams) =>
                `${!params.row.active ? 'datagridrowhover disabled-row' : 'datagridrowhover'}`
              }
              components={{
                Footer: CustomFooter,
              }}
              componentsProps={{
                footer: {
                  active: !showInactive,
                  showActiveSwitch: true,
                  onSwitchClick: () => setShowInactive(!showInactive),
                  children: (
                    <Grid maxWidth='fit-content' container gap={1}>
                      <Typography sx={{ mr: 1 }}>
                        Total Area: {areaTotal.total_area} Acres
                      </Typography>
                    </Grid>
                  ),
                },
              }}
            />
          </Box>
        </CircularLoader>
      </Paper>
    </>
  );
}

export default withAuth(FarmersList);
