// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/processorsList/ui'
import axios from 'axios';

import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Dialog from '~/components/lib/Feedback/Dialog';

import { Paper, Box, Typography, Avatar, Button, Modal, Stack, Tooltip } from '@mui/material';
// import IconButton from '@mui/joy/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import {
  GridRenderCellParams,
  GridColDef,
  GridValueGetterParams,
  GridRowParams,
  GridSelectionModel,
} from '@mui/x-data-grid';

import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import ListAction from '~/components/lib/ListAction';

import withAuth from '~/components/auth/withAuth';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import globalStyles from '~/styles/theme/brands/styles';
import AvatarWithName from '~/components/common/AvatarWithName';
import CircularLoader from '~/components/common/CircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import dynamic from 'next/dynamic';

import { containFilterOperator } from '~/components/DataGridFilter/ContainFilterOperator';

import CustomFooter from '~/components/CustomFooter';

export { default as getServerSideProps } from '~/utils/ggsp';

import Select from 'react-select';
import usePrevious from '../../../../../../utils/usePrevious';
import { useAlert } from '~/contexts/AlertContext';
import { filterDataByCustomKeys } from '~/components/lib/FilterDataByCustomKeys';
const FieldOfficerEditor = dynamic(
  import('~/gen/data-views/farmer_addfieldofficer/farmer_addfieldofficerEditor.rtml'),
);

function ProcessorsList() {
  const { changeRoute, getAPIPrefix, operator } = useOperator();
  const router = useRouter();

  const API_URL = getAPIPrefix() + '/processor';
  const AGENTS_API_URL = `/api/farmbook/agent/list`;
  const [showInactive, setShowInactive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Processors',
    mainBtnTitle: `Add Processor`,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: true,
    isSubBtnPresent: true,
    subBtnTitle: `Assign Field Officers`,
  });
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);
  const agentApi = useFetch<any>(AGENTS_API_URL);
  const { getApiUrl } = useOperator();
  const previousAgentApi: any = usePrevious(agentApi);
  const [updateInprogress, setUpdateInprogress] = React.useState<Boolean>(false);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const { openToast } = useAlert();
  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data
        ? showInactive
          ? data.filter((obj: any) => obj.active === false).length
          : data.filter((obj: any) => obj.active === true).length
        : 0
        } Processors in total`,
    });
  }, [data, showInactive]);

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subBtnDisabled: !selectionModel.length || !!updateInprogress,
    });
  }, [selectionModel, updateInprogress]);

  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/processor/${params?.row?.id}`);
  };

  const handleMoreChipClick = (e: MouseEvent<HTMLElement>) => { };

  const handleActivation = () => {
    reFetch(API_URL);
  };

  const handleSearch = (value: any) => {
    setSearchValue(value);
  };

  function renderActionCell(params: GridRenderCellParams) {
    return (
      <ListAction
        canActivate={params?.row?.landparcels?.length ? false : true}
        canEdit={params?.row?.status == 'Draft' ? true : false}
        canDelete={params?.row?.landparcels?.length ? false : true}
        isActive={params.row.active}
        id={params.row.id}
        schema={'processor'}
        onActivationClick={handleActivation}
      />
    );
  }

  function renderProcessorCell(params: GridRenderCellParams) {
    const name = `${params.row?.personalDetails?.firstName || ''} ${params.row?.personalDetails?.lastName || ''
      }`;
    const url = params.row?.personalDetails?.profilePicture;

    return <AvatarWithName name={name} url={url} />;
  }

  const columns: GridColDef[] = [
    {
      field: 'processorName',
      headerName: 'Processor Name',
      minWidth: 220,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalDetails?.firstName} ${params.row.personalDetails?.lastName ? params.row.personalDetails.lastName : ''
        }`,
    },
    {
      field: 'operatorDetails.processorID',
      headerName: 'ID',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.operatorDetails?.processorID
          ? `${params.row.operatorDetails?.processorID}`
          : `${params.row.fbId}`,
      renderCell: (params: GridValueGetterParams) => (
        <Tooltip title='Click to view processor details'>
          <span>
            {params.row.operatorDetails?.processorID
              ? `${params.row.operatorDetails?.processorID}`
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
        <Tooltip title='Click to view processor details'>
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
        <Tooltip title='Click to view processor details'>
          <span>{`${params.row.personalDetails?.address?.village}`}</span>
        </Tooltip>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: false,
      minWidth: 200,
      flex: 1,
      renderCell: (params: GridValueGetterParams) => (
        <Tooltip title='Click to view processor details'>
          <span>{`${params.row.active ? params.row.status : 'Deactivated'}`}</span>
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
          'operatorDetails.processorID',
          'personalDetails.address.village',
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

  const modalBoxStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    // minWidth: '75%',
    maxHeight: '85%',
    bgcolor: 'background.paper',
    border: '1px solid #EFEFEF',
    boxShadow: 24,
    p: 2,
    // overflow: 'scroll',
  };

  const [operatorList, setOperatorList]: any = useState([]);
  const [selectedOption, setSelectedOption] = useState({});

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

  const handleRemoveFromList = (optionLabel: any) => {
    let result = operatorList.find((item: any) => {
      return item.label === optionLabel;
    });
    if (result) {
      setOperatorList(
        operatorList.filter((item: any) => {
          return item.label !== optionLabel;
        }),
      );
      setOptions([...options, result]);
    }
  };

  const handleAddToList = (optionLabel: any) => {
    let result = options.find((option: any) => {
      return option.label === optionLabel;
    });
    if (result) {
      setOperatorList([...operatorList, result]);
      setOptions(
        options.filter((item: any) => {
          return item.label !== optionLabel;
        }),
      );
    }
  };

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
      openToast('success', 'Successfully assigned field officers to selected processors!');
    } catch (error: any) {
      console.log(error?.response || error);
      openToast('error', 'Failed to assign field officers to selected processors');
    } finally {
      setUpdateInprogress(false);
    }
  };

  async function refFilter(options: any) {
    if (options?.uiOptions.filterKey === 'fieldOfficers') {
      const res: {
        data: any;
      } = await axios.get(`/api/farmbook/agent/list?collectives=${operator?._id}`);
      return res?.data?.map((item: any) => ({
        ...item,
        id: item._id,
        // _id: `${item.personalDetails.firstName || ''} ${item.personalDetails.lastName || ''}`,
        name: `${item.personalDetails.firstName || ''} ${item.personalDetails.lastName || ''}`,
      }));
    }
  }

  const formContext: any = {
    getApiUrl,
    foreignObjectLoader: refFilter,
  };

  return (
    <>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleSearch={handleSearch}
        handleMainBtnClick={() => {
          changeRoute('/processor/create');
        }}
        handleSubBtnClick={handleOpen}
      />

      <Dialog open={isOpen} onClose={handleClose} maxWidth={'md'}>
        <Box sx={{ mt: 2, overflow: 'scroll' }}>
          <FieldOfficerEditor onSubmit={bulkUpdate} formContext={formContext} />{' '}
          <Typography variant={'subtitle2'} mt={1} sx={{ color: 'text.disabled' }}>
            *This action will remove the existing field officers from the processors selected and
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
                },
              }}
            />
          </Box>
        </CircularLoader>
      </Paper>
    </>
  );
}

export default withAuth(ProcessorsList);
