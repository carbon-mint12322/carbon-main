import React, { useState, useContext, useEffect } from 'react';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import CardView from '~/components/ui/CardView';
import CircularLoader from '~/components/common/CircularLoader';
import { Box, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';
import { isoToLocal } from '~/utils/dateFormatter';
import { useEventCxt } from '~/contexts/EventContext';
import Map from '~/components/CommonMap';
import mapStyles from '~/styles/theme/map/styles';
import { Coordinate, coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import { PlantHealthResponse } from '~/frontendlib/dataModel/plantHealth';
import { useQuery } from '@tanstack/react-query';
import PlantHealth from '~/components/ui/PlantHealth';


export { default as getServerSideProps } from '~/utils/ggsp';

const SubmissionDetails = () => {
  const router = useRouter();
  const { changeRoute, getAPIPrefix } = useOperator();
  const {
    images,
    documents,
    audio,
    notes,
    setImages,
    setDocuments,
    setAudio,
    setNotes,
    clearState,
  } = useEventCxt();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const [clearEventData, setClearEventData] = useState<boolean>(true);
  const [selectedImageData, setSelectedImageData] = useState<any | null>(null);

  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    subBtnColor: 'secondary',
    isViewDeleteBtnsPresent: false,
    isMoreIconPresent: false,
    isTitlePresent: true,
    isSubTitlePresent: true,
  });

  const query = router.query;
  let mediaLength = 0;

  const getApiData = async (): Promise<{ data: any }> => {
    try {
      setLoading(true);
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/event/${query?.id}`);
      setData(res.data);
      return { data: res?.data || {} };
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    return { data: {} };
  };
  const getName = (data: any) => {
    let name = '';
    if (data?.cropId) {
      name =
        data?.crop?.name + ' (' + data?.crop?.fbId + ') ' + ' • ' + data?.crop?.landParcel?.name + ' • ' + data?.crop?.farmer?.name;
    } else if (data?.productionSystemId) {
      name = data?.productionSystem?.[0]?.name + ' • ' + data?.productionSystem?.[0]?.category;
    } else if (data?.processingSystemId) {
      name = data?.processingSystem?.[0]?.name + ' • ' + data?.processingSystem?.[0]?.category;
    } else {
      name = data?.landparcel?.name + ' • ' + data?.landparcel?.surveyNumber;
    }
    return name;
  };
  const typeOfRedirection = (data: any) => {
    let url = '';
    if (data?.cropId) {
      url = `/crop/${data?.cropId}`;
    } else if (data?.productionSystemId) {
      if (
        data?.productionSystem?.[0]?.category === 'Poultry' &&
        data?.productionSystem?.[0]?.poultrybatches?.length
      )
        url = `/poultrybatch/${data?.productionSystem?.[0]?.poultrybatches?.[0]?._id}`;
      if (data?.productionSystem?.[0]?.category === 'Aquaculture')
        url = `/aquacrop/${data?.productionSystem?.[0]?.aquacrops?.[0]?._id}`;
      if (data?.productionSystem?.[0]?.category === 'Diary')
        url = `/cow/${data?.productionSystem?.[0]?.cows?.[0]?._id}`;
      if (data?.productionSystem?.[0]?.category === 'Goats')
        url = `/goat/${data?.productionSystem?.[0]?.goats?.[0]?._id}`;
      if (data?.productionSystem?.[0]?.category === 'Sheep')
        url = `/sheep/${data?.productionSystem?.[0]?.sheep?.[0]?._id}`;
    } else if (data?.processingSystemId) {
      url = `/processingsystem/${data?.processingSystemId}`;
    } else {
      url = `/landparcel/${data?.landParcelId}`;
    }
    return url;
  };
  const getButtonTitle = (data: any) => {
    if (data?.cropId) {
      return 'Create Crop Event';
    } else if (data?.processingSystemId) {
      return 'Create Processing System Event';
    } else if (data?.productionSystemId) {
      if (
        data?.productionSystem?.[0]?.active &&
        data?.productionSystem?.[0]?.category === 'Poultry' &&
        data?.productionSystem?.[0]?.poultrybatches?.length
      ) {
        return 'Create Poultry Event';
        // } else if (
        //   data?.productionSystem?.[0]?.active &&
        //   data?.productionSystem?.[0]?.category === 'Dairy' &&
        //   data?.productionSystem?.[0]?.cows?.length
        // ) {
        //   return 'Create Diary Event';
        // } else if (
        //   data?.productionSystem?.[0]?.active &&
        //   data?.productionSystem?.[0]?.category === 'Sheep' &&
        //   data?.productionSystem?.[0]?.sheep?.length
        // ) {
        //   return 'Create Sheep Event';
        // } else if (
        //   data?.productionSystem?.[0]?.active &&
        //   data?.productionSystem?.[0]?.category === 'Goats' &&
        //   data?.productionSystem?.[0]?.goats?.length
        // ) {
        //   return 'Create Goat Event';
      } else if (
        data?.productionSystem?.[0]?.active &&
        data?.productionSystem?.[0]?.category === 'Aquaculture' &&
        data?.productionSystem?.[0]?.aquacrops?.length
      ) {
        return 'Create Aquaculture Crop Event';
      }
    } else if (data?.landParcelId) {
      return 'Create Land Parcel Event';
    } else {
      return 'Create Event';
    }
  };
  const getSubButtonTitle = (data: any) => {
    if (data?.productionSystemId) {
      return 'Create Production System Event';
    }
    return 'Create Cropping System Event';
  };
  const handleSubButtonRedirection = (data: any) => {
    if (data?.cropId) {
      return handleRedirection(`/croppingsystem/${data?.croppingsystem?.id}/create-event`);
    } else if (data?.processingSystemId) {
      return handleRedirection(`/processingsystem/${data?.processingSystemId}/create-event`);
    } else if (data?.productionSystemId) {
      // TODO fix for cow, goat, sheep
      if (data?.productionSystem?.[0]?.category === 'Poultry')
        return handleRedirection(
          `/productionsystem/${data?.productionSystemId}/poultry/create-event`,
        );
      if (data?.productionSystem?.[0]?.category === 'Aquaculture')
        return handleRedirection(
          `/productionsystem/${data?.productionSystemId}/aquaculture/create-event`,
        );
      if (data?.productionSystem?.[0]?.category === 'Dairy')
        return handleRedirection(
          `/productionsystem/${data?.productionSystemId}/dairy/create-event`,
        );
      if (data?.productionSystem?.[0]?.category === 'Goats')
        return handleRedirection(
          `/productionsystem/${data?.productionSystemId}/goats/create-event`,
        );
      if (data?.productionSystem?.[0]?.category === 'Sheep')
        return handleRedirection(
          `/productionsystem/${data?.productionSystemId}/sheep/create-event`,
        );
    }
  };

  const fetchEventData = async () => {
    const { data } = await getApiData();
    const itemsLength =
      (data?.photoRecords?.length || 0) +
      (data?.audioRecords?.length || 0) +
      (data?.document?.length || 0);
    data?.photoRecords && setImages(data?.photoRecords || []);
    data?.document && setDocuments(data?.document || []);
    data?.audioRecords && setAudio(data?.audioRecords || []);
    data?.notes && setNotes([data?.notes]);
    setTitleBarData({
      ...titleBarData,
      title: data?.category,
      subTitle: `${isoToLocal(data?.createdAt)} • ${itemsLength} Media Shared | ${getName(data)}`,
      mainBtnTitle: `${getButtonTitle(data)}`,
      subBtnTitle: `${getSubButtonTitle(data)}`,
      isMainBtnPresent: getButtonTitle(data) ? true : false,
      isSubBtnPresent: data?.cropId || data?.productionSystemId ? true : false,
    });

    return mediaLength;
  };

  useEffect(() => {
    if (query && query.id) {
      fetchEventData();
    }
  }, [query?.id]);

  let mediaRecords =
    (data?.photoRecords?.length || 0) +
    (data?.audioRecords?.length || 0) +
    (data?.document?.length || 0);
  mediaLength = mediaRecords > 10 ? mediaRecords : `0${mediaRecords}`;

  const toggleSelectedImages = (record: any) => {
    images.includes(record)
      ? setImages(images.filter((item: any) => item !== record))
      : setImages(images.concat(record));
  };

  const toggleSelectedAudio = (record: any) => {
    audio.includes(record)
      ? setAudio(audio.filter((item: any) => item !== record))
      : setAudio(audio.concat(record));
  };

  const toggleSelectedDocument = (record: any) => {
    documents.includes(record)
      ? setDocuments(documents.filter((item: any) => item !== record))
      : setDocuments(documents.concat(record));
  };

  const toggleSelectedNotes = (record: any) => {
    notes.includes(record)
      ? setNotes(notes.filter((item: any) => item !== record))
      : setNotes(notes.concat(record));
  };
  const getMapDetails = (data: any) => {
    if (data?.productionSystemId) {
      return coordinateStringToCoordinateObject(
        data?.productionSystem?.[0]?.landParcelDetails?.[0]?.map,
      );
    }
    if (data?.processingSystemId) {
      return coordinateStringToCoordinateObject(
        data?.processingSystem?.[0]?.landParcelDetails?.[0]?.map,
      );
    }

    return data && data.landparcel
      ? data?.landparcel?.map
        ? coordinateStringToCoordinateObject(data.landparcel.map)
        : undefined
      : data?.cropLandparcel?.map
        ? coordinateStringToCoordinateObject(data.cropLandparcel.map)
        : undefined;
  };
  const handleRedirection = (url: string) => () => {
    changeRoute(url);
  };

  const polygons = [
    {
      options: {
        ...mapStyles.landParcelMap,
      },
      paths: getMapDetails(data),
    },
    data?.productionSystemId && {
      options: {
        ...mapStyles.fieldMap,
      },
      paths: coordinateStringToCoordinateObject(
        data?.productionSystem?.[0]?.fieldDetails?.[0]?.map,
      ),
    },
    data?.processingSystemId && {
      options: {
        ...mapStyles.fieldMap,
      },
      paths: coordinateStringToCoordinateObject(
        data?.processingSystem?.[0]?.fieldDetails?.[0]?.map,
      ),
    },
  ];

  if (data && data.fieldDetails) {
    polygons.push({
      options: {
        ...mapStyles.fieldMap,
      },
      paths: data.fieldDetails.map
        ? coordinateStringToCoordinateObject(data.fieldDetails.map)
        : undefined,
    });
  }
  return (
    <Grid>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleMainBtnClick={handleRedirection(`${typeOfRedirection(data)}/create-event`)}
        handleSubBtnClick={handleSubButtonRedirection(data)}
      />
      <CircularLoader value={loading}>
        <>
          <React.Fragment>
            <Typography mt={2} mb='24px'>{`Media (${mediaLength})`}</Typography>

            <Grid container spacing={2}>
              <Grid container spacing={2} item xs={8}>
                <Grid container spacing={2} item xs={12}>
                  {data?.audioRecords?.map((record: any, index: number) => (
                    <Grid item key={index}>
                      <CardView
                        type='audio'
                        link={record?.link}
                        lat={data?.location?.lat}
                        lng={data?.location?.lng}
                        timeStamp={data?.createdAt}
                        notes={record?.notes}
                        createdBy={data?.createdBy.name}
                        selectCheck={true}
                        onSelect={() => {
                          toggleSelectedAudio(record);
                        }}
                        selected={audio.includes(record)}
                      />
                    </Grid>
                  ))}

                  {data?.photoRecords?.map((record: any, index: number) => (
                    <Grid item xs={4} key={index}>
                      <CardView
                        type='image'
                        link={record?.link}
                        lat={record?.metadata?.location?.lat}
                        lng={record?.metadata?.location?.lng}
                        timeStamp={record?.metadata?.timestamp}
                        notes={record?.notes}
                        createdBy={data?.createdBy.name}
                        selectCheck={true}
                        onSelect={() => {
                          toggleSelectedImages(record);
                        }}
                        selected={images.includes(record)}
                        onPlantHealthClick={() => setSelectedImageData(record)}
                        showHealthCheckBtn={true}
                      />
                    </Grid>
                  ))}

                  {data?.documentRecords?.map((record: any, index: number) => (
                    <Grid item xs={4} key={index}>
                      <CardView
                        type='document'
                        link={record?.link}
                        lat={record?.metadata?.location?.lat}
                        lng={record?.metadata?.location?.lng}
                        timeStamp={record?.metadata?.timestamp}
                        notes={data?.notes}
                        createdBy={data?.createdBy.name}
                        selectCheck={true}
                        onSelect={() => {
                          toggleSelectedDocument(record);
                        }}
                        selected={documents.includes(record)}
                      />
                    </Grid>
                  ))}

                  {data?.notes && (
                    <Grid item xs={4}>
                      <CardView
                        type='text'
                        lat={data?.location?.lat}
                        lng={data?.location?.lng}
                        timeStamp={data?.createdAt}
                        notes={data?.notes}
                        createdBy={data?.createdBy.name}
                        selectCheck={true}
                        onSelect={() => {
                          toggleSelectedNotes(data?.notes);
                        }}
                        selected={notes.length > 0}
                      />
                    </Grid>
                  )}

                </Grid>

                {selectedImageData && (
                  <Grid container item mt={4} xs={12}>
                    <PlantHealth imageData={selectedImageData} eventId={query?.id as string} cropHealth={data.cropHealth} />
                  </Grid>
                )}
              </Grid>

              <Grid container height='70vh' item xs={4}>
                <Map markers={data?.markers} polygons={polygons} enableZoom={false} />
              </Grid>
            </Grid>
          </React.Fragment>
        </>
      </CircularLoader>
    </Grid>
  );
};

export default SubmissionDetails;