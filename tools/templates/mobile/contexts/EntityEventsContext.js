import { createContext, useContext, useEffect, useState } from 'react';
import call from '../utils/api';
import { getAllItemsDataByType } from '../utils/commonQueue';
import { getAllItems, removeItem } from "../utils/eventQueue";
import networkContext from './NetworkContext';
import Toast from 'react-native-toast-message';
import { writeLog } from '../utils/sentryLogsQueue';
import AsyncStorage from '../utils/AsyncStorage';


const farmerEventContextDefaultValues = {
    allFarmerEventsComputed: [],
    setNewFarmerEventAdded: () => { },
    getFarmerEventsByLandParcelId: ({ landParcelId, limit }) => { },
    getFarmerEventsByCropId: ({ cropId, limit }) => { },
    getEventsGroupedByLandParcel: ({ landParcelId, limit }) => { },
    getEventByproductionSystemId: (productionSystemId) => { },
    getEventByprocessingSystemId: (processingSystemId) => { }
};

const FarmerEventContext = createContext(farmerEventContextDefaultValues);

export const FarmerEventProvider = ({ children }) => {

    const { eventInfo } = useContext(networkContext)

    const [cachedEvents, setCachedEvents] = useState([])
    const [eventData, setEventData] = useState([])
    const [eventsLoading, setEventsLoading] = useState([])
    const [cacheEventsLoading, setCacheEventsLoading] = useState(false)
    const [allCrops, setAllCrops] = useState([])
    const [allPs, setAllPs] = useState([]);
    const [allProcessingSystems, setAllProcessingSystems] = useState([]);
    const [farmer, setFarmer] = useState(null)
    const [agentData, setAgentData] = useState({})
    const [from, setFrom] = useState('')
    const [hasMorePages, setHasMorePages] = useState(true);
    const [isProcessor, setIsProcessor] = useState(false)

    const getEventCacheData = async () => {
        return await setCachedEvents(await getAllItemsDataByType('event'))
    }

    useEffect(() => {
        // setCacheEventsLoading(true)
        getEventCacheData()
            .finally(() => {
                // setCacheEventsLoading(false)
            })
    }, [eventInfo, eventData])

    useEffect(() => {
        // getEventsFromAPI()
        getEventsFromHome()
        if (farmer) {
            let crops = [];
            let productionSystems = []
            let processingSystems = []
            farmer.landParcels.map((land) => {
                land.crops.map((crop) => {
                    crops.push(crop);
                });
                productionSystems = [...productionSystems, ...(land.productionSystems || [])]
                processingSystems = [...processingSystems, ...(land.processingSystems || [])]
            });
            setAllPs(productionSystems)
            setAllProcessingSystems(processingSystems)
            setAllCrops(crops);
        }
    }, [farmer])

    const homeApi = async (from, forceRefresh, page = 1, pageLimit = 1) => {
        if (pageLimit == 0) {
            pageLimit = 1
        }
        try {
            var user = await AsyncStorage.getItem('user')
            if (user) {
                try {
                    user = JSON.parse(user)
                } catch (error) {
                    console.log(error)
                }
                if (user.role) {
                    from = user.role
                }
            }
            let res = await call(`/fb-mobile/home?skip=0&items=${pageLimit}&search=`, "get", {}, {}, {}, forceRefresh)
            if (res?.data) {
                if (from.toLowerCase() == 'farmer' || from.toLowerCase() == 'processor') {
                    setFarmer(res?.data?.['0'])
                    setFrom('farmer')
                    if (from.toLowerCase() == 'processor') {
                        setIsProcessor(true)
                    }
                    return Promise.resolve([res?.data?.['0']])
                } else {
                    if (res?.data && res?.data?.personalDetails) {
                        let items = await getAllItems()
                        let roles = ['farmers', 'processors']
                        for (let role of roles) {
                            let result = res?.data?.[role].map((farmer) => {
                                farmer?.landParcels.map((land) => {

                                    land.landParcelEvents.map((event) => {
                                        if (items.length > 0) {
                                            for (let [index, item] of items.entries()) {
                                                if (!item.status || item.status == 1 || item.status == 4) {
                                                    if (event.eventId == item.data.eventId) {
                                                        removeItem(index)
                                                    }
                                                }
                                            }
                                        }
                                    })

                                    land.crops.map((crop) => {
                                        crop.cropEvents.map((event) => {
                                            for (let [index, item] of items.entries()) {
                                                if (!item.status || item.status == 1 || item.status == 4) {
                                                    if (event.eventId == item.data.eventId) {
                                                        removeItem(index)
                                                    }
                                                }
                                            }
                                        })
                                    });
                                })
                            })
                        }
                        console.log((res.data.processors), ' <==== this is res data from api response dirtectly...')
                        setAgentData(res.data)
                        setFrom('agent')
                        return Promise.resolve(res.data)
                    }
                }
            } else {
                return Promise.reject(null)
            }

        } catch (e) {
            console.log(e)
            writeLog(e?.message, 'debug')
            Toast.show({
                type: 'error',
                text2: e?.message
            })
            return Promise.reject(e)
        }
    }

    const getEventsFromAPI = async () => {
        if (farmer?.id) {
            setEventsLoading(true);
            try {
                const res = await call(`/fb-mobile/event?farmerId=${farmer.id}`, "get", {}, {})
                res?.data && setEventData([...(res?.data?.cropEvents || []), ...(res?.data?.landParcelEvents || [])]);
            } catch (error) {
                console.log(error, "<--------Response---------");
                writeLog(error?.response?.data?.message || error.message, 'debug')
                Toast.show({
                    type: 'error',
                    text2: error?.response?.data?.message || error.message
                })
            } finally {
                setEventsLoading(false);
            }
        }
    }

    const getEventsFromHome = async () => {
        try {
            setEventsLoading(true)
            var events = []
            farmer?.landParcels?.map((land) => {

                land?.landParcelEvents?.map((event) => {
                    events.push(event)
                })

                land?.productionSystems?.map(ps => {
                    ps?.productionSystemEvents?.map(event => {
                        if (event.productionSystemId)
                            events.push({ ...event, ts: event.createdAt, image: event.photoRecords, id: event._id })
                    })
                })

                land?.processingSystems?.map(ps => {
                    ps?.processingSystemEvents?.map(event => {
                        if (event.processingSystemId)
                            events.push({ ...event, ts: event.createdAt, image: event.photoRecords, id: event._id })
                    })
                })

                land?.crops?.map((crop) => {
                    crop?.cropEvents?.map((event) => {
                        events.push(event)
                    })
                });
            })
            setEventData(events)
        } catch (e) {
            console.log(e?.message)
        } finally {
            setEventsLoading(false)
        }
    }

    const getFinalEvents = async () => {
        let cachedEvents = await getAllItemsDataByType('event')
        let finalEvents = []
        cachedEvents.map(event => {
            if (allCrops?.find(crop => crop._id === event.cropId)) {
                finalEvents.push({ ...event, isCached: true })
            }

            if (allPs?.find(ps => ps._id === event.productionSystemId)) {
                finalEvents.push({ ...event, isCached: true })
            }

            if (allProcessingSystems?.find(ps => ps._id === event.processingSystemId)) {
                finalEvents.push({ ...event, isCached: true })
            }

            if (farmer?.landParcels?.find(lp => lp._id === event.landParcelId)) {
                finalEvents.push({ ...event, isCached: true })
            }
        })

        finalEvents = [...finalEvents, ...eventData].sort((a, b) => (new Date(a.ts) > new Date(b.ts)) ? -1 : 1)
        cachedEvents = finalEvents.filter(event => event.isCached).map(event => event.id || event._id)
        let uploadedEvents = finalEvents.filter(event => !event.isCached).map(event => event.id || event._id)
        finalEvents = finalEvents.filter(event => {
            if (cachedEvents.includes(event.id || event._id) && uploadedEvents.includes(event.id || event._id)) {
                if (!event.isCached) {
                    return true
                }
                return false
            }
            return true
        })
        return finalEvents
    }

    const getAggregatedEventsByLandparcelId = async (landparcelId) => {
        let finalEvents = await getFinalEvents()
        let allowedIds = []

        if (landparcelId) {
            let landParcel = farmer.landParcels?.find(lp => lp._id === landparcelId)
            if (landParcel) {
                landParcel.crops.map(crop => allowedIds.push(crop._id))
                landParcel?.productionSystems?.map(ps => allowedIds.push(ps._id))
                landParcel?.processingSystems?.map(ps => allowedIds.push(ps._id))
            }
        }

        return finalEvents.filter(event => event.landParcelId === landparcelId || allowedIds.includes(event.cropId) || allowedIds.includes(event.productionSystemId) || allowedIds.includes(event.processingSystemId))
    }

    const getEventsByCropId = async (cropId) => {
        let finalEvents = await getFinalEvents()
        return finalEvents.filter(event => event.cropId === cropId)
    }

    const getEventByLandparcelId = (async landParcelId => {
        let finalEvents = await getFinalEvents()
        return finalEvents.filter(event => event.landParcelId === landParcelId)
    })

    const getEventByproductionSystemId = (async productionSystemId => {
        let finalEvents = await getFinalEvents()
        return finalEvents.filter(event => event.productionSystemId === productionSystemId)
    })

    const getEventByprocessingSystemId = (async processingSystemId => {
        let finalEvents = await getFinalEvents()
        return finalEvents.filter(event => event.processingSystemId === processingSystemId)
    })

    const getProductionSystemByLandparcelId = async (landParcelId) => {
        if (landParcelId) {
            let landParcel = farmer.landParcels?.find((lp) => lp._id === landParcelId);
            if (landParcel) {
                return landParcel.productionSystems;
            }
        }
        return [];
    };

    const getProcessingSystemByLandparcelId = async (landParcelId) => {
        if (landParcelId) {
            let landParcel = farmer.landParcels?.find((lp) => lp._id === landParcelId);
            if (landParcel) {
                return landParcel.processingSystems;
            }
        }
        return [];
    };


    return (
        <FarmerEventContext.Provider
            value={{
                eventLoading: cacheEventsLoading || eventsLoading,
                eventData,
                cachedEvents,
                setFarmer,
                getEventsByCropId,
                getEventByLandparcelId,
                eventInfo,
                getEventByproductionSystemId,
                getEventByprocessingSystemId,
                getAggregatedEventsByLandparcelId,
                getProductionSystemByLandparcelId,
                getProcessingSystemByLandparcelId,
                homeApi,
                setAgentData,
                agentData,
                farmer,
                from,
                hasMorePages,
                isProcessor
            }}
        >
            {children}
        </FarmerEventContext.Provider>
    );
};

export const useFarmerEventContext = () => useContext(FarmerEventContext);