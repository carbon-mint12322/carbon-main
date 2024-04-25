import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { PlantHealthResponse, PlantHealthInfoResponse } from '~/frontendlib/dataModel/plantHealth';
import CircularLoader from '../common/CircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
import DataGrid from '~/components/lib/DataGrid';
import { GridValueGetterParams } from '@mui/x-data-grid';

export interface ImageAnalyticsDialogProps {
  imageData: any
  eventId: string
  cropHealth?: PlantHealthResponse[]
}

function PlantHealth({
  imageData,
  eventId,
  cropHealth
}: ImageAnalyticsDialogProps) {
  const { getAPIPrefix } = useOperator();
  const [imageLink, setImageLink] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [fetchingCropHealthInfo, setFetchingCropHealthInfo] = useState(true)

  const [cropHealthInfo, setCropHealthInfo] = useState<PlantHealthResponse | null>(null)

  const getFileName = (link: string) => link.substring(link.lastIndexOf('/') + 1);

  const fetchCropHealthInfo = () => {
    if (cropHealth && imageData) {
      const filename = getFileName(imageData.link)
      const data = cropHealth?.filter((item: any) => item.filename === filename)?.[0]
      setCropHealthInfo(data);
      setIsLoading(false)
      setFetchingCropHealthInfo(false)
      return
    }
    setCropHealthInfo(null)
    setFetchingCropHealthInfo(false)
  };

  const { data: plantHealth } = useQuery([`plantHealth ${eventId} ${imageLink}`],
    () => fetchPlantHealthInfo(imageLink),
    {
      enabled: !!imageLink,
      staleTime: 100000000,
      onSuccess: () => {
        setIsLoading(false)
      }
    }
  );

  const fetchPlantHealthInfo = async (imageUrl: string): Promise<PlantHealthResponse> => {
    const apiUrl = getAPIPrefix() + `/plant-health`;
    try {
      const response = await axios.post(apiUrl, {
        img: imageUrl,
        eventId
      });
      return response.data;
    } catch (error) {
      console.log('🚀 ~ file: PlantHealth.tsx:44 ~ fetchPlantHealthInfo ~ error:', error);

      throw error;
    }
  };

  const fetchPlantHealth = () => {
    const filename = getFileName(imageData.link)
    const BASE_URL =
      process.env.NEXT_PUBLIC_TENANT_NAME !== 'reactml-dev'
        ? `https://${process.env.NEXT_PUBLIC_TENANT_NAME}.carbonmint.com`
        : 'https://dev.reactml.carbonmint.com';
    const url = `${BASE_URL}/api/file/public?id=/gridfs:${process.env.NEXT_PUBLIC_TENANT_NAME}/${filename}`;
    setImageLink(url)
  }

  useEffect(() => {
    if (imageData) {
      fetchCropHealthInfo()
    }
  }, [cropHealth, imageData])

  useEffect(() => {
    if (!fetchingCropHealthInfo && !cropHealthInfo && imageData) {

      fetchPlantHealth()
    }
  }, [cropHealthInfo, fetchingCropHealthInfo])

  const plantData = useMemo(() => {
    const data = cropHealthInfo || plantHealth

    if (data) {
      if ('message' in data && data?.message) {
        return [
          {
            label: '',
            value: data?.message,
          },
        ];
      }

      if ('name' in data && data?.name) {
        return [
          {
            label: 'Name:',
            value: data?.name,
          },
          {
            label: 'Scientific name:',
            value: data?.scientificName?.[0],
          },
          {
            label: 'Healthy:',
            value:
              data?.healthy ? 'Healthy' : 'Unhealthy',
          },
          ...(data?.healthy ? [] : [{
            label: 'Disease:',
            value: data?.disease,
          }])
        ];
      }
    }


    return undefined;
  }, [plantHealth, cropHealthInfo]);

  return (
    <Stack gap={2} width={"100%"}>
      <Typography>
        Crop Health Report
      </Typography>
      <CircularLoader value={isLoading}>
        {plantData && (
          <Stack gap={2} width={"100%"}>
            {plantData?.map((item, index: number) => item.label !== 'Disease:' ? (
              <Stack
                direction='row'
                key={index}
                gap={2}
                justifyContent='space-between'
                alignItems='center'
              >
                {item.label && (<Typography color='textSecondary' minWidth="130px">{item.label}</Typography>)}
                {item.value && !Array.isArray(item?.value) && (
                  <Typography fontWeight='bold'>
                    {item?.value}
                  </Typography>
                )}
              </Stack>
            ) :
              (
                <PlantDisease plantDiseaseData={item.value as PlantHealthInfoResponse['disease']} key={index} />
              )
            )}
          </Stack>
        )}
      </CircularLoader>

    </Stack>
  );
}

export default PlantHealth;


const PlantDisease = ({ plantDiseaseData }: { plantDiseaseData: PlantHealthInfoResponse['disease'] }) => {

  const rows = useMemo(() => plantDiseaseData?.map((item, index) => ({ ...item, id: index })), [plantDiseaseData])

  const columns = [
    {
      field: 'disease', headerName: 'Disease', minWidth: 150,
      flex: 1
    },
    {
      field: 'treatment',
      headerName: 'Treatments',
      minWidth: 150,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params?.row.treatment?.join(', ')}`,
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows || []}
        columns={columns}
      />
    </Box>
  );
}


