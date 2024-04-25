/* global google */
import React, { Component } from 'react';
import { GoogleMap, MarkerF, Polygon } from '@react-google-maps/api';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { createRoot } from 'react-dom/client';
import CircularLoader from '~/components/common/CircularLoader';
import { Grid } from '@mui/material';
import { Coordinate } from '~/utils/coordinatesFormatter';

export interface DrawPathProps {
  currentLocation?: Coordinate;
  onMapCoordinatesChange?: (coordinates: Coordinate[]) => void;
  onMapCurrentLocationChange?: (coordinates: Coordinate) => void;
  onSave?: (ob_coordinates: Coordinate[], ib_coordinates?: Coordinate[][]) => void;
  onCancel?: () => void;
  fullScreen?: boolean;
}

export interface DrawPathState {
  ob_coordinates?: Coordinate[];
  ib_coordinates?: Coordinate[][];
  currentLocation?: Coordinate;
  mapRef: any;
}

class DrawPath extends Component<DrawPathProps, DrawPathState> {
  ob_capture: number;
  ib_capture: number;
  ob_done: number;
  ib_done: number;
  ib_index: number;
  map: any;
  constructor(props: DrawPathProps) {
    super(props);
    this.state = {
      ob_coordinates: [
        {
          lat: 0,
          lng: 0,
        },
      ],
      ib_coordinates: [
        [
          {
            lat: 0,
            lng: 0,
          },
        ],
      ],
      currentLocation: {
        lat: 0,
        lng: 0,
      },
      mapRef: null,
    };
    this.ob_capture = 0;
    this.ib_capture = 0;
    this.ob_done = 0;
    this.ib_done = 0;
    this.ib_index = 0;
  }

  componentDidMount = async () => {
    // On Page Reload -> fetch current location
    const { lat, lng } = await this.getcurrentLocation();
    this.setState({
      currentLocation: {
        lat,
        lng,
      },
      ob_coordinates: [],
      ib_coordinates: [],
    });
    this.props.onMapCurrentLocationChange &&
      this.props.onMapCurrentLocationChange({
        lat,
        lng,
      });
  };

  // Watch position function options for a precised location capture.
  options_current_location = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
  };

  getcurrentLocation(): Promise<Coordinate> {
    if (navigator && navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = position.coords;
            resolve({
              lat: coords.latitude,
              lng: coords.longitude,
            });
          },
          (error) => {},
          this.options_current_location,
        );
      });
    }
    return new Promise((resolve, reject) => {
      resolve({
        lat: 0,
        lng: 0,
      });
    });
  }

  reset_state() {
    this.setState({
      currentLocation: this.state.currentLocation,
      ob_coordinates: [],
      ib_coordinates: [],
    });
  }

  reset() {
    this.reset_state();
    this.componentDidMount();
    this.ob_capture = 0;
    this.ib_capture = 0;
    this.ob_done = 0;
    this.ib_done = 0;
  }

  HandleIBButtonClick = (flag = 0) => {
    if (flag === 0) {
      this.ib_capture = 1;
    } else {
      this.ib_capture = 0;
      if (this?.state?.ib_coordinates?.length) {
        this.ib_done = 1;
        this.ib_index = this.ib_index + 1;
      }
    }
    this.UpdateMapControls(this.state.mapRef);
  };

  HandleOBButtonClick = (flag = 0) => {
    if (flag === 0) {
      this.ob_capture = 1;
      // Clear co-ordinates list to start
      this.setState({
        ob_coordinates: [],
      });
    } else if (flag === 2) {
      this.reset();
    } else {
      this.ob_capture = 0;
      if (this.state?.ob_coordinates?.length) {
        this.ob_done = 1;
      }
    }
    this.UpdateMapControls(this.state.mapRef);
  };

  HandleSaveButtonClick = () => {
    this.props.onSave &&
      this.props.onSave(this.state.ob_coordinates || [], this.state.ib_coordinates);
  };

  UpdateMapControls(map: any) {
    const iconStyle = {
      width: '60px',
      height: '60px',
      color: '#F79023',
    };
    const disabledIconStyle = {
      width: '60px',
      height: '60px',
      color: '#808080',
    };

    const buttonStyle = {
      padding: '0px',
    };

    var controlButtonsDiv = document.getElementById('ButtonsDiv');
    if (controlButtonsDiv != null) {
      map.controls[google.maps.ControlPosition.BOTTOM_CENTER].clear();
    }
    controlButtonsDiv = document.createElement('div');
    controlButtonsDiv.setAttribute('id', 'ButtonsDiv');

    const root = createRoot(controlButtonsDiv);
    root.render(
      <Stack
        direction='row'
        spacing={1}
        sx={{
          marginBottom: '30px',
          background: '#fff',
          borderRadius: '40px',
        }}
      >
        <Tooltip title='Outer boundary' placement='top'>
          <span>
            <IconButton
              onClick={() =>
                this.ob_capture ? this.HandleOBButtonClick(1) : this.HandleOBButtonClick(0)
              }
              style={buttonStyle}
              disabled={this.ob_done ? true : false}
            >
              {this.ob_capture ? (
                <StopCircleOutlinedIcon color='primary' style={iconStyle} />
              ) : (
                <PlayCircleOutlineIcon
                  color='primary'
                  style={this.ob_done ? disabledIconStyle : iconStyle}
                />
              )}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Inner boundary' placement='top'>
          <span>
            <IconButton
              onClick={() =>
                this.ib_capture ? this.HandleIBButtonClick(1) : this.HandleIBButtonClick(0)
              }
              style={buttonStyle}
              disabled={this.ob_done ? false : true}
            >
              {this.ib_capture ? (
                <StopCircleOutlinedIcon color='primary' style={iconStyle} />
              ) : (
                <PlayCircleOutlineIcon
                  color='primary'
                  style={this.ob_done ? iconStyle : disabledIconStyle}
                />
              )}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Reset' placement='top'>
          <span>
            <IconButton
              onClick={() => this.HandleOBButtonClick(2)}
              style={buttonStyle}
              disabled={this.ob_capture ? true : false}
            >
              <RestartAltIcon
                color='primary'
                style={this.ob_capture ? disabledIconStyle : iconStyle}
              />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Save' placement='top'>
          <span>
            <IconButton
              onClick={() => this.HandleSaveButtonClick()}
              style={buttonStyle}
              disabled={this.ob_capture || !this.ob_done || this.ib_capture ? true : false}
            >
              <SaveIcon
                color='primary'
                style={
                  this.ob_capture || !this.ob_done || this.ib_capture
                    ? disabledIconStyle
                    : iconStyle
                }
              />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Close' placement='top'>
          <IconButton
            onClick={() => this.props.onCancel && this.props.onCancel()}
            style={buttonStyle}
          >
            <CancelOutlinedIcon color='primary' style={iconStyle} />
          </IconButton>
        </Tooltip>
      </Stack>,
    );
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controlButtonsDiv);
  }

  render() {
    const {
      state: { currentLocation, ib_coordinates, ob_coordinates },
      props: { fullScreen },
    } = this;
    return (
      <>
        <CircularLoader value={Boolean(!currentLocation)}>
          <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <GoogleMap
              center={currentLocation}
              onLoad={(map) => {
                map.setMapTypeId('satellite');
                this.setState({ mapRef: map });
                this.UpdateMapControls(map);
              }}
              onClick={(ev: any) => {
                const lat = ev?.latLng?.lat();
                const lng = ev?.latLng?.lng();
                if (this.ob_capture === 1) {
                  this.setState({
                    ob_coordinates: [
                      ...(ob_coordinates || []),
                      {
                        lat,
                        lng,
                      },
                    ],
                  });
                  this.props.onMapCoordinatesChange &&
                    this.props.onMapCoordinatesChange([
                      ...(ob_coordinates || []),
                      {
                        lat,
                        lng,
                      },
                    ]);
                } else if (this.ib_capture === 1) {
                  const _ib_coordinates = [...(ib_coordinates || [])];
                  _ib_coordinates[this.ib_index] = [
                    ...(_ib_coordinates[this.ib_index] || []),
                    {
                      lat,
                      lng,
                    },
                  ];

                  this.setState({
                    ib_coordinates: [..._ib_coordinates],
                  });
                }
              }}
              zoom={20}
              ref={this.map}
              mapContainerStyle={{
                width: '100%',
                height: fullScreen ? '100vh' : '83vh',
                position: fullScreen ? 'unset' : 'relative',
                zIndex: 1202,
              }}
            >
              {(this.ob_capture === 1 || this.ob_done === 1) &&
                ob_coordinates?.map((mark, index) => (
                  <MarkerF
                    icon={{
                      path: 'm -3, 0 a 3,3 0 1,0 6,0 a 3,3 0 1,0 -6,0',
                      scale: 2,
                      fillColor: 'red',
                      fillOpacity: 1.0,
                      strokeColor: 'gold',
                      strokeWeight: 3,
                    }}
                    key={index}
                    position={mark}
                  />
                ))}

              {(this.ib_capture === 1 || this.ib_index > 0) &&
                ib_coordinates?.map((m) =>
                  m.map((mark, index) => (
                    <MarkerF
                      icon={{
                        path: 'm -3, 0 a 3,3 0 1,0 6,0 a 3,3 0 1,0 -6,0',
                        scale: 2,
                        fillColor: 'red',
                        fillOpacity: 1.0,
                        strokeColor: 'gold',
                        strokeWeight: 3,
                      }}
                      key={index}
                      position={mark}
                    />
                  )),
                )}

              {(this.ob_capture === 1 || this.ob_done === 1) && (
                <Polygon
                  paths={[ob_coordinates || [], ...(ib_coordinates ? ib_coordinates : [])]}
                  options={{
                    strokeColor: '#7fff00',
                    fillColor: 'purple',
                    fillOpacity: 0.5,
                    strokeOpacity: 1,
                    strokeWeight: 4,
                    clickable: false,
                  }}
                />
              )}
            </GoogleMap>
          </Grid>
        </CircularLoader>
      </>
    );
  }
}

export default DrawPath;
