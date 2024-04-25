import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import axios from 'axios';

import { Box, Grid, SxProps, Typography, useTheme } from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

import landParcels from '../../../../../public/assets/images/icons/stack_circular_purple.svg';
import userCircularOrange from '../../../../../public/assets/images/icons/user_circular_orange.svg';
import layoutCircularBlue from '../../../../../public/assets/images/icons/layout_circular_blue.svg';
import cropCircularBlue from '../../../../../public/assets/images/icons/crop_circular_blue.svg';

import Events from '~/container/dashboard/RecentEvents';
import CountCard from '~/container/dashboard/CountCard';
import OverviewCard from '~/container/dashboard/OverviewCard';

import Donut from '~/components/common/Chart/Donut';
import withAuth from '~/components/auth/withAuth';
import Map from '~/components/CommonMap';
import mapStyles from '~/styles/theme/map/styles';
import CircularLoader from '~/components/common/CircularLoader';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import { coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';

import { PageConfig } from '~/frontendlib/dataModel';
import MapMarkerToolTip from '~/container/dashboard/MapMarkerToolTip';
import If from '~/components/lib/If';
import { useOperator } from '~/contexts/OperatorContext';
import DefaultValueSelect from '~/container/dashboard/DefaultValueSelect';
import dayjs from 'dayjs';
import PercentageCard from '~/container/dashboard/PercentageCard';

export { default as getServerSideProps } from '~/utils/ggsp';

interface AHDashboardProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: any;
}

export interface Data {
  pendingEventsCount: number;
  pendingTasks: number;
  climateImpactScore: number;
  complianceScore: number;
  productionSystemLocations: LocationData[];
  lpLocations: LocationData[];
  totalHighRiskFarms: number;
  totalPoultryDayMortality: number;
  totalPoultryBatches: number;
  totalLayerPoultryBatches: number;
  totalRearingPoultryBatches: number;
  tentativeYield: number;
  tentativeYieldData: TentativeYieldData;
  totalRegisteredArea: number;
  totalCalculatedArea: number;

  totalCrops: number;
  totalFarmers: number;
  totalDairyProductionSystems: number;
  totalPoultryProductionSystems: number;
  totalGoatProductionSystems: number;
  totalSheepProductionSystems: number;
  totalAquacultureProductionSystems: number;
  totalCows: number;
  totalGoats: number;
  totalSheep: number;
  totalAquacultureCrops: number;
  totalSericultureProductionSystems: number;
  totalLandParcels: number;
  generalProductionSystemDistribution?: generalProductionSystemDistribution;
  generalLandParcelDistribution?: generalLandParcelDistribution;
  generalActiveLandParcelDistribution?: generalActiveLandParcelDistribution;
  generalFarmerDistribution?: generalFarmerDistribution;
  generalTractorDistribution?: generalTractorDistribution;
  generalInsuranceDistribution?: generalInsuranceDistribution;
  recentEvents?: any;
  harvestHistoryData: HarvestHistoryData;
  climateImpact?: { [key: string]: ClimateImpact };
  complianceScoreChartData?: { [key: string]: ClimateImpact };
}

export interface ClimateImpact {
  label: string;
  value: number;
}

export interface CropSowingProgressProps {
  sowingData: {
    cropName: string;
    villageName: string;
    startDate: string;
    endDate: string;
  }[];
}

export interface generalProductionSystemDistribution {
  [key: string]: number;
}

export interface generalLandParcelDistribution {
  [key: string]: number;
}
export interface generalActiveLandParcelDistribution {
  [key: string]: number;
}
export interface generalFarmerDistribution {
  [key: string]: number;
}
export interface generalTractorDistribution {
  [key: string]: number;
}
export interface generalInsuranceDistribution {
  [key: string]: number;
}

export interface LocationData {
  position: Location;
  data: any;
  map: any;
}

export interface Location {
  lng: number;
  lat: number;
}

export interface TentativeYieldData {
  next30DayAmount: number;
  next60DayAmount: number;
  next90DayAmount: number;
}

export interface HarvestHistoryData {
  last30DayAmount: number;
  last60DayAmount: number;
  last90DayAmount: number;
}

type LocationFilterType = 'lpLocations' | 'productionSystemLocations';

function AHDashboard(props: AHDashboardProps) {
  const theme = useTheme();
  const { getAPIPrefix } = useOperator();
  const [data, setData] = useState<Data>();
  const [poultryBreedNameList, setPoultryBreedNameList] = useState<string[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [locationType, setLocationType] = useState<LocationFilterType>('lpLocations');
  const [sowingPerformanceType, setSowingPerformanceType] = useState<string>('all');
  const [polygonArray, setPolygonArray] = useState<any>([]);
  const [
    geographicalDistributionProductionSystemType,
    setGeographicalDistributionProductionSystemType,
  ] = useState<string>('allVarieties');

  const [yieldEstimatesContext, setYieldEstimatesContext] = useState<string>('allVarieties');
  const [yieldEstimatesSubType, setYieldEstimatesSubType] = useState<string>('next30Days');

  const [harvestHistoryContext, setHarvestHistoryContext] = useState<string>('allVarieties');
  const [harvestHistorySubType, setHarvestHistorySubType] = useState<string>('last30Days');

  const [inputsUsageMetricsContext, setInputsUsageMetricsContext] = useState<string>('period');
  const [inputsUsageMetricsPeriodContext, setInputsUsageMetricsPeriodContext] =
    useState<string>('last30Days');
  const [inputsUsageMetricsCropsContext, setInputsUsageMetricsCropsContext] =
    useState<string>('all');
  const [inputsUsageMetricsInputsTypeContext, setInputsUsageMetricsInputsTypeContext] =
    useState<string>('all');

  const [generalDistributionContext, setGeneralDistributionContext] = useState<string>('farms');
  const [
    generalDistributionProductionSystemContext,
    setGeneralDistributionProductionSystemContext,
  ] = useState<string>('poultryType');
  const [generalDistributionLandParcelContext, setGeneralDistributionLandParcelContext] =
    useState<string>('size');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Animal Husbandry Dashboard',
    isTitlePresent: true,
    isselectOperatorPresent: false,
  });

  const paramsSanity = () => {
    return {
      ...(geographicalDistributionProductionSystemType !== 'allVarieties'
        ? { geographicalDistributionProductionSystemType }
        : {}),
      generalDistributionContext,
      generalDistributionProductionSystemContext,
      generalDistributionLandParcelContext,
      yieldEstimatesContext,
      yieldEstimatesSubType,
      yieldEstimatesStartDate: yieldEstimatesTimeCalculator().yieldEstimatesStartDate,
      yieldEstimates30DayEndDate: yieldEstimatesTimeCalculator().yieldEstimates30DayEndDate,
      yieldEstimates60DayEndDate: yieldEstimatesTimeCalculator().yieldEstimates60DayEndDate,
      yieldEstimates90DayEndDate: yieldEstimatesTimeCalculator().yieldEstimates90DayEndDate,
      harvestHistoryContext,
      harvestHistorySubType,
      harvestHistoryStartDate: harvestHistoryTimeCalculator().harvestHistoryStartDate,
      harvestHistory30DayEndDate: harvestHistoryTimeCalculator().harvestHistory30DayEndDate,
      harvestHistory60DayEndDate: harvestHistoryTimeCalculator().harvestHistory60DayEndDate,
      harvestHistory90DayEndDate: harvestHistoryTimeCalculator().harvestHistory90DayEndDate,
      inputsUsageMetricsContext,
      inputsUsageMetricsPeriodContext,
      inputsUsageMetricsCropsContext,
      inputsUsageMetricsInputsTypeContext,
    };
  };

  const yieldEstimatesTimeCalculator = () => {
    return {
      yieldEstimatesStartDate: dayjs().format('YYYY.MM.DD'),
      yieldEstimates30DayEndDate: dayjs().add(30, 'day').format('YYYY.MM.DD'),
      yieldEstimates60DayEndDate: dayjs().add(60, 'day').format('YYYY.MM.DD'),
      yieldEstimates90DayEndDate: dayjs().add(90, 'day').format('YYYY.MM.DD'),
    };
  };

  const harvestHistoryTimeCalculator = () => {
    return {
      harvestHistoryStartDate: dayjs().format('YYYY.MM.DD'),
      harvestHistory30DayEndDate: dayjs().add(-30, 'day').format('YYYY.MM.DD'),
      harvestHistory60DayEndDate: dayjs().add(-60, 'day').format('YYYY.MM.DD'),
      harvestHistory90DayEndDate: dayjs().add(-90, 'day').format('YYYY.MM.DD'),
    };
  };

  const getApiData = async () => {
    try {
      setLoading(true);
      const res: {
        data: Data;
      } = await axios.get(`${getAPIPrefix()}/ahdashboard`, {
        params: paramsSanity(),
      });
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getApiFilteredData = async () => {
    try {
      const res: {
        data: Data;
      } = await axios.get(`${getAPIPrefix()}/ahdashboard`, {
        params: paramsSanity(),
      });
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getPoultryBreedNameList = async () => {
    try {
      setLoading(true);
      const res: {
        data: string[];
      } = await axios.get(`${getAPIPrefix()}/poultry-breed-name`);
      setPoultryBreedNameList(res.data);
      console.log('Poultry Name List', res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApiData();
    getPoultryBreedNameList();
  }, []);

  useEffect(() => {
    if (data) {
      getApiFilteredData();
    }
  }, [
    generalDistributionContext,
    generalDistributionProductionSystemContext,
    generalDistributionLandParcelContext,

    geographicalDistributionProductionSystemType,
    yieldEstimatesContext,
    yieldEstimatesSubType,
    harvestHistoryContext,
    harvestHistorySubType,
    inputsUsageMetricsContext,
    inputsUsageMetricsPeriodContext,
    inputsUsageMetricsCropsContext,
    inputsUsageMetricsInputsTypeContext,
  ]);

  useEffect(() => {
    setPolygonArray(
      data?.[locationType]?.map((item: any, index: number) => {
        return {
          paths: coordinateStringToCoordinateObject(item.map),
          options: {
            ...mapStyles.selectedLandParcelMap,
          },
        };
      }),
    );
  }, [data, locationType]);

  const countCardData = [
    {
      id: 1,
      count: data?.totalFarmers || 0,
      title: 'Farmers',
      icon: userCircularOrange,
    },
    {
      id: 2,
      count: data?.totalLandParcels || 0,
      title: 'Farms',
      icon: landParcels,
    },
    {
      id: 3,
      count: data?.totalPoultryBatches || 0,
      title: 'Poultry Batches',
      icon: layoutCircularBlue,
    },
    {
      id: 4,
      count: data?.totalCows || 0,
      title: 'Cows',
      icon: layoutCircularBlue,
    },
    {
      id: 5,
      count: data?.totalGoats || 0,
      title: 'Goats',
      icon: layoutCircularBlue,
    },
    {
      id: 6,
      count: data?.totalSheep || 0,
      title: 'Sheep',
      icon: layoutCircularBlue,
    },
  ];
  const psCountCardData = [
    {
      id: 4,
      count: data?.totalDairyProductionSystems || 0,
      title: 'Dairy Production Systems',
      icon: userCircularOrange,
    },
    {
      id: 3,
      count: data?.totalPoultryProductionSystems || 0,
      title: 'Poultry Production Systems',
      icon: landParcels,
    },
    {
      id: 2,
      count: data?.totalGoatProductionSystems || 0,
      title: 'Goat Production Systems',
      icon: layoutCircularBlue,
    },
    {
      id: 5,
      count: data?.totalSheepProductionSystems || 0,
      title: 'Sheep Production Systems',
      icon: layoutCircularBlue,
    },
    {
      id: 6,
      count: data?.totalAquacultureProductionSystems || 0,
      title: 'Aquaculture Production Systems',
      icon: layoutCircularBlue,
    },
    {
      id: 1,
      count: data?.totalSericultureProductionSystems || 0,
      title: 'Sericulture Production Systems',
      icon: layoutCircularBlue,
    },
  ];

  const pendingCardData = [
    // {
    //   id: 4,
    //   count: data?.pendingEventsCount || 0,
    //   title: 'Poultry Pending Events',
    //   icon: layoutCircularBlue,
    // },
    // {
    //   id: 3,
    //   count: data?.pendingTasks || 0,
    //   title: 'Pending Tasks',
    //   icon: layoutCircularBlue,
    // },
    {
      id: 7,
      count: data?.totalAquacultureCrops || 0,
      title: 'Aquaculture Crops',
      icon: layoutCircularBlue,
    },
  ];

  const percentageCardData = [
    {
      id: 1,
      percent: data?.climateImpactScore || 0,
      title: 'Climate Impact Score',
      redirectionText: 'Top Land Parcels >',
    },
    {
      id: 2,
      percent: data?.complianceScore || 0,
      title: 'Compliance Score',
      redirectionText: 'Top Land Parcels >',
    },
  ];

  const poultryBreedNameFilter = useMemo(
    () =>
      poultryBreedNameList && poultryBreedNameList?.length > 0
        ? poultryBreedNameList?.map((name) => ({
          value: name,
          label: name,
        }))
        : [],
    [poultryBreedNameList],
  );

  return (
    <Grid container spacing={1} direction='column' mt={1}>
      <TitleBarGeneric
        titleBarData={titleBarData}
      /> 
      <CircularLoader value={loading}>
        <>
          <Grid item container spacing={1}>
            {countCardData?.map((countCard) => (
              <Grid key={countCard.id} container item rowSpacing={1} lg={2} xs={6} md={6}>
                <Box width='100%'>
                  <CountCard
                    count={countCard.count}
                    icon={countCard.icon}
                    // redirectionUrl={countCard.redirectionUrl}
                    title={countCard.title}
                  // unit={countCard.unit}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={1} item>
            {pendingCardData?.map((countCard) => (
              <Grid
                container
                direction='column'
                item
                xs={12}
                md={6}
                lg={2}
                rowSpacing={1}
                key={countCard.id}
              >
                <Box width='100%'>
                  <CountCard
                    count={countCard.count}
                    icon={countCard.icon}
                    title={countCard.title}
                  />
                </Box>
              </Grid>
            ))}
            {percentageCardData?.map((percentCard) => (
              <Grid
                key={percentCard.id}
                container
                direction='column'
                item
                lg={5}
                xs={12}
                md={5}
                rowSpacing={1}
              >
                <Box width='100%'>
                  <PercentageCard
                    percent={percentCard.percent}
                    title={percentCard.title}
                    redirectionText={percentCard.redirectionText}
                  />
                </Box>
              </Grid>
            ))}
            {psCountCardData?.map((countCard) => (
              <Grid
                container
                item
                xs={12}
                sm={6}
                md={6}
                lg={12 / psCountCardData?.length}
                key={countCard.id}
                rowSpacing={1}
              >
                <Box width='100%'>
                  <CountCard
                    count={countCard.count}
                    icon={countCard.icon}
                    title={countCard.title}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          <Grid marginTop={'-15px'} container spacing={1} item>
            <If value={process.env.NEXT_PUBLIC_APP_NAME === 'farmbook'}>
              <Grid container direction='column' item xs={12} md={6} rowSpacing={1}>
                <Grid item>
                  <OverviewCard
                    title={'Size Distribution'}
                    headerContent={
                      <>
                        <Box>
                          <DefaultValueSelect
                            value={generalDistributionContext}
                            onChange={(value) => setGeneralDistributionContext(value)}
                            menuItems={[
                              {
                                value: 'farms',
                                label: 'Farms',
                              },
                              {
                                value: 'productionSystems',
                                label: 'Production Systems',
                              },
                            ]}
                          />
                          <If value={generalDistributionContext === 'productionSystems'}>
                            <DefaultValueSelect
                              value={generalDistributionProductionSystemContext}
                              onChange={(value) =>
                                setGeneralDistributionProductionSystemContext(value)
                              }
                              menuItems={[
                                {
                                  value: 'poultryType',
                                  label: 'Poultry Type',
                                },
                                {
                                  value: 'poultryVariety',
                                  label: 'Poultry Variety',
                                },
                              ]}
                            />
                          </If>
                          <If value={generalDistributionContext === 'farms'}>
                            <DefaultValueSelect
                              value={generalDistributionLandParcelContext}
                              onChange={(value) => setGeneralDistributionLandParcelContext(value)}
                              menuItems={[
                                {
                                  value: 'size',
                                  label: 'Poultry Size',
                                },
                                {
                                  value: 'activeInactive',
                                  label: 'Active/Inactive',
                                },
                              ]}
                            />
                          </If>{' '}
                        </Box>
                      </>
                    }
                  >
                    <Donut
                      width={'100%'}
                      height={200}
                      series={
                        generalDistributionContext === 'productionSystems'
                          ? data?.generalProductionSystemDistribution &&
                            Object.keys(data?.generalProductionSystemDistribution).length
                            ? Object.keys(data?.generalProductionSystemDistribution)
                              ?.map(
                                (name: string) =>
                                  data?.generalProductionSystemDistribution?.[name],
                              )
                              .filter((value): value is number => value !== undefined)
                            : []
                          : generalDistributionContext === 'farms' &&
                            generalDistributionLandParcelContext === 'size'
                            ? data?.generalLandParcelDistribution &&
                              Object.keys(data?.generalLandParcelDistribution).length
                              ? Object.keys(data?.generalLandParcelDistribution)
                                ?.map((name: string) => data?.generalLandParcelDistribution?.[name])
                                .filter((value): value is number => value !== undefined)
                              : []
                            : generalDistributionContext === 'farms' &&
                              generalDistributionLandParcelContext === 'activeInactive'
                              ? data?.generalActiveLandParcelDistribution &&
                                Object.keys(data?.generalActiveLandParcelDistribution).length
                                ? Object.keys(data?.generalActiveLandParcelDistribution)
                                  ?.map(
                                    (name: string) =>
                                      data?.generalActiveLandParcelDistribution?.[name],
                                  )
                                  .filter((value): value is number => value !== undefined)
                                : []
                              : []
                      }
                      size='40%'
                      showDataLabels
                      labels={
                        generalDistributionContext === 'productionSystems'
                          ? data?.generalProductionSystemDistribution &&
                            Object.keys(data?.generalProductionSystemDistribution).length
                            ? Object.keys(data?.generalProductionSystemDistribution)?.map(
                              // @ts-ignore
                              (name: string) => name,
                            )
                            : []
                          : generalDistributionContext === 'farms' &&
                            generalDistributionLandParcelContext === 'size'
                            ? data?.generalLandParcelDistribution &&
                              Object.keys(data?.generalLandParcelDistribution).length
                              ? Object.keys(data?.generalLandParcelDistribution)?.map(
                                // @ts-ignore
                                (key: string) => key,
                              )
                              : []
                            : generalDistributionContext === 'farms' &&
                              generalDistributionLandParcelContext === 'activeInactive'
                              ? data?.generalActiveLandParcelDistribution &&
                                Object.keys(data?.generalActiveLandParcelDistribution).length
                                ? Object.keys(data?.generalActiveLandParcelDistribution)?.map(
                                  // @ts-ignore
                                  (key: string) => key,
                                )
                                : []
                              : []
                      }
                      showLegend
                      showCount={true}
                    />
                  </OverviewCard>
                </Grid>

                <Grid item>
                  <OverviewCard
                    title={'Yield Estimates'}
                    headerContent={
                      <>
                        <Box>
                          <DefaultValueSelect
                            value={yieldEstimatesContext}
                            onChange={(value) => setYieldEstimatesContext(value)}
                            menuItems={[
                              {
                                value: 'allVarieties',
                                label: 'All Varieties',
                              },
                              ...poultryBreedNameFilter,
                            ]}
                          />
                          <DefaultValueSelect
                            value={yieldEstimatesSubType}
                            onChange={(value) => setYieldEstimatesSubType(value)}
                            menuItems={[
                              {
                                value: 'next30Days',
                                label: 'Next 30 Days',
                              },
                              {
                                value: 'next60Days',
                                label: 'Next 60 Days',
                              },
                              {
                                value: 'next90Days',
                                label: 'Next 90 Days',
                              },
                            ]}
                          />
                        </Box>
                      </>
                    }
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Image src={cropCircularBlue} height={48} width={48} alt='cropImg' />
                        <Box
                          sx={{
                            ml: 0.6,
                          }}
                        >
                          <Typography
                            variant='h6'
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            <If value={yieldEstimatesSubType == 'next30Days'}>
                              {data?.tentativeYieldData?.next30DayAmount || 0} Birds
                            </If>
                            <If value={yieldEstimatesSubType == 'next60Days'}>
                              {data?.tentativeYieldData?.next60DayAmount || 0} Birds
                            </If>
                            <If value={yieldEstimatesSubType == 'next90Days'}>
                              {data?.tentativeYieldData?.next90DayAmount || 0} Birds
                            </If>
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <If value={yieldEstimatesSubType == 'next30Days'}>
                          <Typography
                            variant='subtitle1'
                            color={
                              data?.tentativeYieldData &&
                                data?.tentativeYieldData?.next30DayAmount >=
                                data?.harvestHistoryData?.last30DayAmount
                                ? 'success'
                                : 'error'
                            }
                            sx={{
                              display: 'flex',
                              flexDirection: 'row-reverse',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                            }}
                          >
                            <>
                              {data?.tentativeYieldData &&
                                data?.tentativeYieldData?.next30DayAmount >=
                                data?.harvestHistoryData?.last30DayAmount ? (
                                <ArrowCircleUpIcon fontSize='small' color={'success'} />
                              ) : (
                                <ArrowCircleDownIcon fontSize='small' color={'error'} />
                              )}
                              <></>
                              {data?.tentativeYieldData
                                ? (
                                  (((data?.tentativeYieldData?.next30DayAmount || 0) -
                                    (data?.harvestHistoryData?.last30DayAmount || 0)) /
                                    (data?.harvestHistoryData?.last30DayAmount || 0.0001)) *
                                  100
                                ).toFixed(2)
                                : 0}
                              %
                            </>
                          </Typography>
                        </If>

                        <If value={yieldEstimatesSubType == 'next60Days'}>
                          <Typography
                            variant='subtitle1'
                            color={
                              data?.tentativeYieldData &&
                                data?.tentativeYieldData?.next60DayAmount >=
                                data?.harvestHistoryData?.last60DayAmount
                                ? 'success'
                                : 'error'
                            }
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                            }}
                          >
                            <>
                              {data?.tentativeYieldData &&
                                data?.tentativeYieldData?.next60DayAmount >=
                                data?.harvestHistoryData?.last60DayAmount ? (
                                <ArrowCircleUpIcon fontSize='small' color={'success'} />
                              ) : (
                                <ArrowCircleDownIcon fontSize='small' color={'error'} />
                              )}
                              <></>
                              {data?.tentativeYieldData
                                ? (
                                  (((data?.tentativeYieldData?.next60DayAmount || 0) -
                                    (data?.harvestHistoryData?.last60DayAmount || 0)) /
                                    (data?.harvestHistoryData?.last60DayAmount || 0.0001)) *
                                  1000.0
                                ).toFixed(2)
                                : 0}
                              %
                            </>
                          </Typography>
                        </If>

                        <If value={yieldEstimatesSubType == 'next90Days'}>
                          <Typography
                            variant='subtitle1'
                            color={
                              data?.tentativeYieldData &&
                                data?.tentativeYieldData?.next90DayAmount >=
                                data?.harvestHistoryData?.last90DayAmount
                                ? 'success'
                                : 'error'
                            }
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                            }}
                          >
                            <>
                              {data?.tentativeYieldData &&
                                data?.tentativeYieldData?.next90DayAmount >=
                                data?.harvestHistoryData?.last90DayAmount ? (
                                <ArrowCircleUpIcon fontSize='small' color={'success'} />
                              ) : (
                                <ArrowCircleDownIcon fontSize='small' color={'error'} />
                              )}
                              <></>
                              {data?.tentativeYieldData
                                ? (
                                  (((data?.tentativeYieldData?.next90DayAmount || 0) -
                                    (data?.harvestHistoryData?.last90DayAmount || 0)) /
                                    (data?.harvestHistoryData?.last90DayAmount || 0.0001)) *
                                  100
                                ).toFixed(2)
                                : 0}
                              %
                            </>
                          </Typography>
                        </If>

                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 550,
                            color: '#959595',
                          }}
                        >
                          <If value={yieldEstimatesSubType == 'next30Days'}>
                            {data?.harvestHistoryData?.last30DayAmount || 0} Birds last 30 days
                          </If>
                          <If value={yieldEstimatesSubType == 'next60Days'}>
                            {data?.harvestHistoryData?.last90DayAmount || 0} Birds last 60 days
                          </If>
                          <If value={yieldEstimatesSubType == 'next90Days'}>
                            {data?.harvestHistoryData?.last90DayAmount || 0} Birds last 90 days
                          </If>
                        </Typography>
                      </Box>
                    </Box>
                  </OverviewCard>
                </Grid>

                <Grid item>
                  <OverviewCard
                    title={'Harvest History'}
                    headerContent={
                      <>
                        <Box>
                          <DefaultValueSelect
                            value={harvestHistoryContext}
                            onChange={(value) => setHarvestHistoryContext(value)}
                            menuItems={[
                              {
                                value: 'allVarieties',
                                label: 'All Varieties',
                              },
                              ...poultryBreedNameFilter,
                            ]}
                          />
                          <DefaultValueSelect
                            value={harvestHistorySubType}
                            onChange={(value) => setHarvestHistorySubType(value)}
                            menuItems={[
                              {
                                value: 'last30Days',
                                label: 'Last 30 Days',
                              },
                              {
                                value: 'last60Days',
                                label: 'Last 60 Days',
                              },
                              {
                                value: 'last90Days',
                                label: 'Last 90 Days',
                              },
                            ]}
                          />
                        </Box>
                      </>
                    }
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Image src={cropCircularBlue} height={48} width={48} alt='cropImg' />
                        <Box
                          sx={{
                            ml: 0.6,
                          }}
                        >
                          <Typography
                            variant='h6'
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            <If value={harvestHistorySubType == 'last30Days'}>
                              {data?.harvestHistoryData?.last30DayAmount || 0} Birds
                            </If>
                            <If value={harvestHistorySubType == 'last60Days'}>
                              {data?.harvestHistoryData?.last60DayAmount || 0} Birds
                            </If>
                            <If value={harvestHistorySubType == 'last90Days'}>
                              {data?.harvestHistoryData?.last90DayAmount || 0} Birds
                            </If>
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <If value={harvestHistorySubType == 'last30Days'}>
                          <Typography
                            variant='subtitle1'
                            color={
                              data?.harvestHistoryData &&
                                data?.harvestHistoryData?.last30DayAmount <=
                                data?.tentativeYieldData.next30DayAmount
                                ? 'success'
                                : 'error'
                            }
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                              flexDirection: 'row-reverse',
                            }}
                          >
                            <>
                              {data?.harvestHistoryData &&
                                data?.harvestHistoryData?.last30DayAmount <=
                                data?.tentativeYieldData.next30DayAmount ? (
                                <ArrowCircleUpIcon fontSize='small' color={'success'} />
                              ) : (
                                <ArrowCircleDownIcon fontSize='small' color={'error'} />
                              )}
                              <></>
                              {data?.harvestHistoryData
                                ? (
                                  (((data?.tentativeYieldData.next30DayAmount || 0) -
                                    (data?.harvestHistoryData?.last30DayAmount || 0)) /
                                    (data?.harvestHistoryData?.last30DayAmount || 0.0001)) *
                                  100
                                ).toFixed(2)
                                : 0}
                              %
                            </>
                          </Typography>
                        </If>

                        <If value={harvestHistorySubType == 'last60Days'}>
                          <Typography
                            variant='subtitle1'
                            color={
                              data?.harvestHistoryData &&
                                data?.harvestHistoryData?.last60DayAmount <=
                                data?.tentativeYieldData.next60DayAmount
                                ? 'success'
                                : 'error'
                            }
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                            }}
                          >
                            <>
                              {data?.harvestHistoryData &&
                                data?.harvestHistoryData?.last60DayAmount <=
                                data?.tentativeYieldData.next60DayAmount ? (
                                <ArrowCircleUpIcon fontSize='small' color={'success'} />
                              ) : (
                                <ArrowCircleDownIcon fontSize='small' color={'error'} />
                              )}
                              <></>
                              {data?.harvestHistoryData
                                ? (
                                  (((data?.tentativeYieldData.next60DayAmount || 0) -
                                    (data?.harvestHistoryData?.last60DayAmount || 0)) /
                                    (data?.harvestHistoryData?.last30DayAmount || 0.0001)) *
                                  100
                                ).toFixed(2)
                                : 0}
                              %
                            </>
                          </Typography>
                        </If>

                        <If value={harvestHistorySubType == 'last90Days'}>
                          <Typography
                            variant='subtitle1'
                            color={
                              data?.harvestHistoryData &&
                                data?.harvestHistoryData?.last90DayAmount <=
                                data?.tentativeYieldData.next90DayAmount
                                ? 'success'
                                : 'error'
                            }
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                            }}
                          >
                            <>
                              {data?.harvestHistoryData &&
                                data?.harvestHistoryData?.last90DayAmount <=
                                data?.tentativeYieldData.next90DayAmount ? (
                                <ArrowCircleUpIcon fontSize='small' color={'success'} />
                              ) : (
                                <ArrowCircleDownIcon fontSize='small' color={'error'} />
                              )}
                              <></>
                              {data?.harvestHistoryData
                                ? (
                                  (((data?.tentativeYieldData.next90DayAmount || 0) -
                                    (data?.harvestHistoryData?.last90DayAmount || 0)) /
                                    (data?.harvestHistoryData?.last30DayAmount || 0.0001)) *
                                  100
                                ).toFixed(2)
                                : 0}
                              %
                            </>
                          </Typography>
                        </If>

                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 550,
                            color: '#959595',
                          }}
                        >
                          <If value={harvestHistorySubType == 'last30Days'}>
                            {data?.tentativeYieldData?.next30DayAmount || 0} Birds next 30 days
                          </If>
                          <If value={harvestHistorySubType == 'last60Days'}>
                            {data?.tentativeYieldData?.next60DayAmount || 0} Birds next 60 days
                          </If>
                          <If value={harvestHistorySubType == 'last90Days'}>
                            {data?.tentativeYieldData?.next90DayAmount || 0} Birds next 90 days
                          </If>
                        </Typography>
                      </Box>
                    </Box>
                  </OverviewCard>
                </Grid>
              </Grid>
            </If>

            <Grid
              container
              direction='column'
              item
              xs={12}
              md={process.env.NEXT_PUBLIC_APP_NAME === 'farmbook' ? 6 : 12}
              rowSpacing={1}
            >
              <Grid className='geoContainer' item>
                <OverviewCard
                  title={'Geographical Distribution'}
                  headerContent={
                    <>
                      <Box>
                        <If value={process.env.NEXT_PUBLIC_APP_NAME === 'farmbook'}>
                          <DefaultValueSelect
                            value={locationType}
                            onChange={(value) => setLocationType(value as LocationFilterType)}
                            menuItems={[
                              {
                                value: 'lpLocations',
                                label: 'Farms',
                              },
                              {
                                value: 'productionSystemLocations',
                                label: 'Production Systems',
                              },
                            ]}
                          />
                          <If value={locationType === 'productionSystemLocations'}>
                            <DefaultValueSelect
                              value={geographicalDistributionProductionSystemType}
                              onChange={(value) =>
                                setGeographicalDistributionProductionSystemType(value)
                              }
                              menuItems={[
                                {
                                  value: 'allVarieties',
                                  label: 'All Varieties',
                                },
                                ...poultryBreedNameFilter,
                              ]}
                            />
                          </If>
                        </If>
                      </Box>
                    </>
                  }
                >
                  <Box
                    sx={{
                      height: '40vh',
                    }}
                  >
                    <Map
                      markers={data?.[locationType]?.map((location, index) => ({
                        ...location,
                        id: `marker${index}`,
                      }))}
                      // polygons={polygonArray?.map((polygon: any, index: any) => ({
                      //   ...polygon,
                      //   key: `polygon${index}`,
                      // }))}
                      isTooltipPresent
                      enableZoom={false}
                      markerToolTip={(markerData) => <MapMarkerToolTip markerData={markerData} />}
                    ></Map>
                  </Box>
                </OverviewCard>
              </Grid>
              <Grid width='100%' item>
                <OverviewCard title={'Recent Events'}>
                  <Events
                    data={data?.recentEvents}
                    showImages={false}
                    // eventType='Calendar'
                    onPlanEventCreateOrUpdateCallback={function (): void {
                      throw new Error('Function not implemented.');
                    }}
                    crop={undefined}
                  />
                </OverviewCard>
              </Grid>
            </Grid>
          </Grid>
        </>
      </CircularLoader>
    </Grid>
  );
}

export default withAuth(AHDashboard);
