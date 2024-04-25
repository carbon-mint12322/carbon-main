import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import { Coordinate, getCurrentLocation } from '~/utils/coordinatesFormatter';
import { DrawPathProps } from '.';

interface CaptureOnMapEvent {
  outerBoundary: boolean;
  innerBoundary: boolean;
  outerBoundaryCompleted: boolean;
  innerBoundaryCompleted: boolean;
}

type BoundaryType = 'outerBoundary' | 'innerBoundary';

interface DrawPathContextProps {
  outerBoundaryCoordinates?: Coordinate[];
  setOuterBoundaryCoordinates: (coordinates: Coordinate[]) => void;
  innerBoundaryCoordinates?: Coordinate[];
  setInnerBoundaryCoordinates: (coordinates: Coordinate[]) => void;
  currentLocation?: Coordinate;
  setCurrentLocation: (coordinates: Coordinate) => void;
  captureOn: CaptureOnMapEvent;
  setCaptureOn: (captureOnMapEvent: CaptureOnMapEvent) => void;
  resetState: () => void;
  handleButtonClick: (boundaryType: BoundaryType) => void;
  handleMapClick: (event: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const DrawPathDefaultValues: DrawPathContextProps = {
  outerBoundaryCoordinates: undefined,
  setOuterBoundaryCoordinates: (coordinates: Coordinate[]) => null,
  innerBoundaryCoordinates: undefined,
  setInnerBoundaryCoordinates: (coordinates: Coordinate[]) => null,
  currentLocation: undefined,
  setCurrentLocation: (coordinates: Coordinate) => null,
  captureOn: {
    outerBoundary: false,
    innerBoundary: false,
    outerBoundaryCompleted: false,
    innerBoundaryCompleted: false,
  },
  setCaptureOn: (captureOnMapEvent: CaptureOnMapEvent) => null,
  resetState: () => null,
  handleButtonClick: (boundaryType: BoundaryType) => null,
  handleMapClick: (event: any) => null,
  onSave: () => null,
  onCancel: () => null,
};

const DrawPathContext = createContext<DrawPathContextProps>(DrawPathDefaultValues);

interface DrawPathContextProviderProps extends DrawPathProps {
  children: ReactNode;
}

const Provider = ({
  children,
  coordinates = undefined,
  onMapCoordinatesChange = (coordinates: Coordinate[]) => null,
  onMapCurrentLocationChange = (coordinates: Coordinate) => null,
  onSave = () => null,
  onCancel = () => null,
  ...props
}: DrawPathContextProviderProps) => {
  const [outerBoundaryCoordinates, setOuterBoundaryCoordinates] = useState<Coordinate[]>();
  const [innerBoundaryCoordinates, setInnerBoundaryCoordinates] = useState<Coordinate[]>();
  const [currentLocation, setCurrentLocation] = useState<Coordinate>();
  const [captureOn, setCaptureOn] = useState<CaptureOnMapEvent>({
    outerBoundary: false,
    innerBoundary: false,
    outerBoundaryCompleted: false,
    innerBoundaryCompleted: false,
  });
  console.log('🚀 ~ file: context.tsx:76 ~ captureOn', captureOn);

  const resetState = () => {
    setOuterBoundaryCoordinates(undefined);
    setInnerBoundaryCoordinates(undefined);
    setCaptureOn({
      outerBoundary: false,
      innerBoundary: false,
      outerBoundaryCompleted: false,
      innerBoundaryCompleted: false,
    });
  };

  const handleButtonClick = (boundaryType: BoundaryType) => {
    console.log(
      '🚀 ~ file: context.tsx:70 ~ handleButtonClick ~ boundaryType',
      boundaryType,
      captureOn?.[boundaryType],
    );
    if (boundaryType === 'outerBoundary') {
      setCaptureOn({
        ...captureOn,
        outerBoundary: !captureOn?.[boundaryType],
        outerBoundaryCompleted: captureOn?.[boundaryType] ? true : false,
      });
    }
    if (boundaryType === 'innerBoundary') {
      setCaptureOn({
        ...captureOn,
        innerBoundary: !captureOn?.[boundaryType],
        innerBoundaryCompleted: captureOn?.[boundaryType] ? true : false,
      });
    }
    if (boundaryType === 'outerBoundary' && !captureOn?.[boundaryType]) {
      setOuterBoundaryCoordinates(undefined);
      setInnerBoundaryCoordinates(undefined);
    }
  };

  useEffect(() => {
    if (!props?.currentLocation) {
      getData();
    } else {
      setCurrentLocation(props?.currentLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (coordinates && coordinates?.length > 0 && !outerBoundaryCoordinates) {
      setOuterBoundaryCoordinates(coordinates);
    }
  }, [coordinates]);

  const getData = async () => {
    // On Page Reload -> fetch current location
    const { lat, lng } = await getCurrentLocation();
    const _coordinate = {
      lat,
      lng,
    };
    setCurrentLocation(_coordinate);
    setOuterBoundaryCoordinates([_coordinate]);
    onMapCurrentLocationChange(_coordinate);
  };

  const handleMapClick = (event: any) => {
    // event is of type google.maps.MapMouseEvent
    const lat = event?.latLng?.lat();
    const lng = event?.latLng?.lng();
    if (captureOn && lat && lng) {
      if (captureOn?.outerBoundary) {
        const _coordinates = [
          ...(outerBoundaryCoordinates || []),
          {
            lat,
            lng,
          },
        ];
        setOuterBoundaryCoordinates(_coordinates);

        onMapCoordinatesChange(_coordinates);
      }
      if (captureOn?.innerBoundary) {
        const _coordinates = [
          ...(innerBoundaryCoordinates || []),
          {
            lat,
            lng,
          },
        ];
        setInnerBoundaryCoordinates(_coordinates);
      }
    }
  };

  const exposed: DrawPathContextProps = {
    outerBoundaryCoordinates,
    setOuterBoundaryCoordinates,
    innerBoundaryCoordinates,
    setInnerBoundaryCoordinates,
    currentLocation,
    setCurrentLocation,
    captureOn,
    setCaptureOn,
    resetState,
    handleButtonClick,
    handleMapClick,
    onSave,
    onCancel,
  };

  return <DrawPathContext.Provider value={exposed}>{children}</DrawPathContext.Provider>;
};

export const useDrawPathContext = () => useContext(DrawPathContext);

export default Provider;
