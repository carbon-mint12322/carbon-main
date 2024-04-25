// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
import React, { MouseEvent, useCallback, useEffect, useState, useMemo } from 'react';
import axios from 'axios';

import { Box, Paper, Typography, Grid, Button, useTheme, Theme, ListItemIcon } from '@mui/material';
import Dialog from '~/components/lib/Feedback/Dialog';
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

import withAuth from '~/components/auth/withAuth';
import globalStyles from '~/styles/theme/brands/styles';

import Map from '~/components/CommonMap';
import mapStyles from '~/styles/theme/map/styles';
import { coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import MapOverlay from '~/container/landparcel/list/MapOverlay';
import CircularLoader from '~/components/common/CircularLoader';
import { LayersOutlined, SettingsCellSharp } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';

export { default as getServerSideProps } from '~/utils/ggsp';
import ListAction from '~/components/lib/ListAction';
import CustomFooter from '~/components/CustomFooter';
import { containFilterOperator } from '~/components/DataGridFilter/ContainFilterOperator';
import { calculatePolygonArea } from '~/utils/mapUtils';
import _ from 'lodash';
import { filterDataByCustomKeys } from '~/components/lib/FilterDataByCustomKeys';
import { useAlert } from '~/contexts/AlertContext';
const CropEditor = dynamic(import('~/gen/data-views/lpbulkaddition/lpbulkadditionEditor.rtml'));
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
function LandParcelList() {
  const theme = useTheme();
  const { changeRoute, getAPIPrefix, getApiUrl } = useOperator();
  const API_URL = getAPIPrefix() + '/landparcel';
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);
  const [selectedRowId, setSelectedRowId] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [polygonArray, setPolygonArray] = useState<any>([]);
  const [updateInprogress, setUpdateInprogress] = React.useState<Boolean>(false);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Land Parcels',
    mainBtnTitle: 'Add Land Parcel',
    subBtnTitle: showMap ? 'Hide Map View' : 'Show Map View',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: true,
    isSubBtnPresent: true,
    subBtnDisabled: false,
  });
  const { openToast } = useAlert();

  const toggleShowMap = () => {
    const value = !showMap;
    setShowMap(!showMap);
    value && setSelectedRowId(searchData?.[0]?.id);
  };

  const handleSearch = (value: any) => {
    setSearchValue(value);
  };

  const mainBtnOptions = [{
    label: 'Add Crops',
    operation: () => handleOpen()
  }];

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data
        ? showInactive
          ? data.filter((obj: any) => obj.active === false).length
          : data.filter((obj: any) => obj.active === true).length
        : 0
        } Land Parcels in total`,
      subBtnTitle: showMap ? 'Hide Map View' : 'Show Map View',
    });
  }, [data, showMap, showInactive]);

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subBtnTitle: showMap ? 'Hide Map View' : 'Show Map View',
    });
    const found = searchData?.some((item) => item._id === selectedRowId);

    if (!found) {
      setSelectedRowId(searchData?.[0]?.id);
    }
    if (showMap) {
      setPolygonArray(
        searchData?.map((item: any, index: number) => {
          if (index === 0) {
            return {
              id: item.id,
              paths: coordinateStringToCoordinateObject(item.map),
              options: {
                ...mapStyles.selectedLandParcelMap,
              },
              data: item,
            };
          }
          return {
            id: item.id,
            paths: coordinateStringToCoordinateObject(item.map),
            options: {
              ...mapStyles.notSelectedLandParcelMap,
            },
            data: item,
          };
        }),
      );
    }
  }, [showMap, searchValue]);

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      mainBtnOptions: selectionModel.length && !updateInprogress ? mainBtnOptions : [],
    });
  }, [selectionModel, updateInprogress]);

  const onChipClick = (e: MouseEvent<HTMLElement>, id: any) => {
    e.stopPropagation();
    changeRoute(`/crop/${id}`);
  };

  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/landparcel/${params?.row?.id}`);
  };

  const handleMoreChipClick = (e: MouseEvent<HTMLElement>) => { };

  const handleClose = () => {
    setIsOpen(false);
    setSelectionModel([]);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const bulkUpdate = async (data: any) => {
    try {
      setUpdateInprogress(true);
      await axios.post(getApiUrl('/field/bulk-create'), {
        landParcels: selectionModel,
        crop: data
      });
      handleClose();
      openToast('success', 'Successfully created Field Parcels, Cropping systems and Crops to selected Land parcels!');
    } catch (error: any) {
      console.log(error?.response || error);
      openToast('error', 'Failed to create Field Parcels, Cropping systems and Crops to selected Land parcels');
    } finally {
      setUpdateInprogress(false);
    }
  };


  const formContext: any = {
    getApiUrl
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

  const handleMap = (id: string) => {
    const prevSelectedIndex = searchData.findIndex((x) => x.id == selectedRowId);
    const selectedIndex = searchData.findIndex((x) => x.id == id);
    if (prevSelectedIndex > -1 && selectedIndex > -1) {
      setSelectedRowId(id);

      const copyPolygonArray = [...polygonArray];
      copyPolygonArray[prevSelectedIndex].options = { ...mapStyles.notSelectedLandParcelMap };
      copyPolygonArray[selectedIndex].options = { ...mapStyles.selectedLandParcelMap };
      setPolygonArray(copyPolygonArray);
    }
  };

  const handleActivation = () => {
    reFetch(API_URL);
  };

  function renderActionCell(params: GridRenderCellParams) {
    return showMap ? (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          //setSelectedRowId(params.row.id);
          // setCheck(params.row);
          handleMap(params.row.id);
        }}
      >
        Show On Map
      </Button>
    ) : (
      <ListAction
        canActivate={true}
        canEdit={params.row.status === 'Approved' ? false : true}
        canDelete={params.row.crops.length > 0 ? false : true}
        isActive={params.row.active}
        id={params.row.id}
        schema={'landparcel'}
        onActivationClick={handleActivation}
      />
    );
  }

  const donutChart = (series: number[], label: string, color: string) => (
    <Chart
      options={{
        chart: {
          background: 'transparent',
          stacked: false,
          toolbar: {
            show: false,
          },
        },
        colors: [color, theme.palette.chart.default],
        labels: [label],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        stroke: {
          width: 0,
        },
        plotOptions: {
          pie: {
            donut: {
              size: '35%',
            },
          },
        },
      }}
      series={series}
      type='donut'
      height={65}
      width={50}
    />
  );

  const searchData = useMemo(() => {
    const filterActive = (data: any[]) =>
      data?.filter((item: any) => (showInactive ? !item.active : item.active));

    if (searchValue?.length > 0) {
      return filterActive(
        filterDataByCustomKeys(data, searchValue, [
          'name',
          'address.village',
          'address.state',
          'crops.name',
        ]),
      );
    }
    return filterActive(data);
  }, [searchValue, data, showInactive]);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Grid
          container
          flexWrap='nowrap'
          minWidth='fit-content'
          pr='10px'
          alignItems='center'
          gap={1}
        >
          <Grid
            container
            alignItems='center'
            justifyContent='center'
            width='fit-content'
            p='8px'
            borderRadius='8px'
            sx={{
              bgcolor: (theme: Theme) => `${theme.palette.primary.main}30`,
            }}
          >
            <LayersOutlined fontSize='medium' sx={{ color: 'iconColor.default' }} />
          </Grid>
          <Typography sx={{ minWidth: 'fit-content' }}>{params.row.name}</Typography>
        </Grid>
      ),
      flex: 2,
    },
    {
      field: 'areaInAcres',
      headerName: 'Area (Acres)',
      flex: 1,
      minWidth: 100,
      valueGetter: (params: GridValueGetterParams) => params?.row?.areaInAcres,
      renderCell: (params: GridValueGetterParams) => `${params?.row?.areaInAcres}`,
    },
    {
      field: 'area',
      headerName: 'Calculated Area (Acres)',
      minWidth: 100,
      valueGetter: (params: GridValueGetterParams) =>
        `${_.round(
          calculatePolygonArea({
            paths: coordinateStringToCoordinateObject(params?.row?.map),
          }) || 0,
          2,
        )}`,
      flex: 1,
    },
    ...(process.env.NEXT_PUBLIC_APP_NAME === 'farmbook' && !showMap
      ? [
        {
          field: 'climateScore',
          headerName: 'Climate Score',
          minWidth: 100,
          renderCell: (params: GridRenderCellParams) => (
            <Grid container flexWrap='nowrap' alignItems='center'>
              {donutChart(
                [Number(params.row.climateScore), 100 - Number(params.row.climateScore)],
                'Climate',
                theme.palette.chart.primary,
              )}
              <Grid container flexWrap='nowrap' alignItems='center'>
                <Typography>{params.row.climateScore}</Typography>
                {/* <Typography fontSize='12px'>/100</Typography> */}
              </Grid>
            </Grid>
          ),
          flex: 1,
        },
        {
          field: 'complianceScore',
          headerName: 'Compliance Score',
          minWidth: 100,
          renderCell: (params: GridRenderCellParams) => (
            <Grid container flexWrap='nowrap' alignItems='center'>
              {donutChart(
                [Number(params.row.complianceScore), 100 - Number(params.row.complianceScore)],
                'Compliance',
                theme.palette.chart.secondary,
              )}
              <Grid container flexWrap='nowrap' alignItems='center'>
                <Typography>{params.row.complianceScore}</Typography>
                {/* <Typography fontSize='12px'>/100</Typography> */}
              </Grid>
            </Grid>
          ),
          flex: 1,
        },
        {
          field: 'farmer',
          headerName: 'Farmer',
          minWidth: 200,
          valueGetter: (params: GridValueGetterParams) =>
            `${(params.row.farmer?.[0]?.personalDetails?.firstName || '') +
            ' ' +
            (params.row.farmer?.[0]?.personalDetails?.lastName || '')
            }  `,

          flex: 1,
        },
        {
          field: 'ownership',
          headerName: 'Ownership',
          minWidth: 200,
          valueGetter: (params: GridValueGetterParams) =>
            `${(params.row.farmer?.[0] ? (params.row.landParcelFarmer?.ownership ? params.row.landParcelFarmer?.ownership : '') : 'NA')}  `,
          flex: 1,
        },
        {
          field: 'processor',
          headerName: 'Processor',
          minWidth: 200,
          valueGetter: (params: GridValueGetterParams) =>
            `${(params.row.processor?.[0]?.personalDetails?.firstName || '') +
            ' ' +
            (params.row.processor?.[0]?.personalDetails?.lastName || '')
            }  `,

          flex: 1,
        },
      ]
      : []),

    ...(!showMap
      ? [
        {
          field: 'address',
          headerName: 'Address',
          minWidth: 150,
          valueGetter: (params: GridValueGetterParams) =>
            `${params?.row?.address?.village}, ${params?.row?.address?.state}`,
          flex: 2,
        },
        ...(process.env.NEXT_PUBLIC_APP_NAME === 'farmbook'
          ? [
            {
              field: 'crops',
              headerName: 'Crops',
              sortable: false,
              flex: 2.5,
              minWidth: 200,
              renderCell: renderCropsCell,
              filterOperators: containFilterOperator,
            },
          ]
          : []),
        {
          field: 'compostingBeds',
          headerName: 'Composting Beds',
          minWidth: 200,
          valueGetter: (params: GridValueGetterParams) => {
            const bedSizes: number[] = (params.row.compostingUnits || []).map((unit: { bedSize?: number }) => unit.bedSize || 0);
            const sumBedSize = bedSizes.reduce((sum, size) => sum + size, 0);
            return sumBedSize.toString();
          },
          flex: 1,
        },
        {
          field: 'status',
          headerName: 'Status',
          sortable: false,
          flex: 1,
          minWidth: 130,
          valueGetter: (params: GridValueGetterParams) =>
            `${params.row.active ? params.row.status : 'Deactivated'}`,
        },
      ]
      : []),
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,

      minWidth: 100,
      renderCell: renderActionCell,
    },
  ];
  const area = useMemo(
    () => ({
      total_calculated_area: _.round(
        _.sum(
          searchData?.map((item) =>
            calculatePolygonArea({ paths: coordinateStringToCoordinateObject(item.map) }),
          ) || [],
        ),
        2,
      ),
      total_area: _.round(_.sum(searchData?.map((item) => Number(item.areaInAcres)) || []), 1),
    }),
    [searchData],
  );

  const handlePolygonClick = (polygonData: any) => {
    console.log('🚀 ~ file: index.tsx:377 ~ handlePolygonClick ~ polygonData:', polygonData);

    handleMap(polygonData?.id);
  };

  return (
    <CircularLoader value={loading}>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleMainBtnClick={() => {
          changeRoute('/landparcel/create');
        }}
        handleSubBtnClick={toggleShowMap}
        handleSearch={handleSearch}
      />
      <Grid container flexWrap='nowrap' height='fit-content' spacing={showMap ? 2 : 0}>
        <Grid item xs={12} md={showMap ? 6 : 12}>
          <Box
            component={Paper}
            elevation={0}
            style={{ ...globalStyles.dataGridLayer, minHeight: '100%' }}
          >
            <DataGrid
              getRowId={(row) => row._id}
              columns={columns}
              rows={searchData || []}
              disableColumnSelector={false}
              rowHeight={64}
              selectionModel={selectionModel}
              checkboxSelection
              onSelectionModelChange={(newSelectionModel) => {

                setSelectionModel(newSelectionModel);
              }}
              isRowSelectable={(params: GridRowParams) => true}
              disableSelectionOnClick={false}
              sx={globalStyles.datagridSx}
              onRowClick={handleRowClick}
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
                      <Typography sx={{ mr: 1 }}>Total Area: {area.total_area} Acres</Typography>
                      <Typography sx={{ mr: 1 }}>
                        Total Calculated Area: {area.total_calculated_area} Acres
                      </Typography>
                    </Grid>
                  ),
                },
              }}
              getRowClassName={(params: GridRowParams) =>
                `${!params.row.active ? 'datagridrowhover disabled-row' : 'datagridrowhover'}`
              }
            />
          </Box>
        </Grid>

        <Dialog fullWidth={true} open={isOpen} onClose={handleClose} maxWidth={'lg'} title={'Add Crop'} dialogContentProps={{
          sx: {
            padding: '1rem 2rem'
          },
        }}>
          <CropEditor
            onSubmit={bulkUpdate}
            formContext={formContext}
            onCancelBtnClick={handleClose}
          />
        </Dialog>
        {showMap && (
          <Grid item xs={12} md={showMap ? 6 : 12}>
            <Grid
              container
              minHeight='70vh'
              height='100%'
              justifyContent='center'
              alignItems='center'
              bgcolor='white'
              p={1}
              position='relative'
              component={Paper}
              elevation={0}
            >
              <Grid container height='70vh'>
                <Map
                  polygons={polygonArray}
                  rowIndex={searchData?.findIndex((item) => item.id === selectedRowId)}
                  isTooltipPresent
                  polygonToolTip={(polygonData) => (
                    <Grid container direction='column' flexWrap='nowrap' gap={1}>
                      <Typography>{polygonData?.data?.name}</Typography>
                      <Grid container flexWrap='nowrap' alignItems='center' gap='4px'>
                        Area: {polygonData?.data?.areaInAcres} Acres
                      </Grid>
                    </Grid>
                  )}
                  onPolygonClick={handlePolygonClick}
                />
              </Grid>
              <MapOverlay data={data[data.findIndex((item: any) => item.id === selectedRowId)]} />
            </Grid>
          </Grid>
        )}
      </Grid>
    </CircularLoader>
  );
}

export default withAuth(LandParcelList);
