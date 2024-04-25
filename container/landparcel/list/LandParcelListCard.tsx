import React from 'react';
import { useRouter } from 'next/router';
import { LayersOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { Button, Grid, Paper, styled, Typography, useTheme, Theme } from '@mui/material';
import { Leaf } from '~/components/Icons';
import { useOperator } from '~/contexts/OperatorContext';

interface IProps {
  showMap: Boolean;
  data: any;
  selected?: Boolean;
  onClick?: () => void;
}
export const ColouredGrid = (props: any) => (
  <Grid
    container
    flexWrap='nowrap'
    alignItems='center'
    width='fit-content'
    height='fit-content'
    px='10px'
    py='8px'
    bgcolor='#FEF6ED'
    borderRadius='10px'
    columnGap='8px'
    {...props}
  ></Grid>
);

export default function LandParcelListCard(props: IProps) {
  const { showMap, data, selected = false, onClick = () => null } = props;
  const router = useRouter();
  const { changeRoute } = useOperator();
  const theme = useTheme();
  return (
    <Grid
      component={Paper}
      bgcolor={selected ? '#FFF7EF' : 'white'}
      onClick={onClick}
      borderLeft={selected ? `solid 3px ${theme.palette.primary.main}` : ''}
      container
      justifyContent='space-between'
      flexWrap='nowrap'
      height='fit-content'
      p='20px'
      item
    >
      <Grid container alignItems='center' flexWrap='nowrap' columnGap='16px'>
        <Grid
          container
          alignItems='center'
          justifyContent='center'
          width='fit-content'
          p='18px'
          sx={{
            bgcolor: (theme: Theme) => `${theme.palette.primary.main}30`,
          }}
        >
          <LayersOutlined fontSize='medium' htmlColor={theme.palette.primary.main} />
        </Grid>
        <Grid>
          <Typography variant='subtitle1' fontWeight='700'>
            {data?.name}
          </Typography>
          <Typography variant='subtitle2' fontWeight='600' color='#33333370'>
            {Object.values(data.address).join(', ')}
          </Typography>
          <Grid container columnGap='16px'>
            <Typography variant='subtitle2' fontWeight='600' color={'iconColor.primary'}>
              Climate score : {data.climateScore}
            </Typography>
            <Typography variant='subtitle2' fontWeight='600' color={'iconColor.secondary'}>
              Compliance score : {data.complianceScore}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container flexWrap='nowrap' alignItems='center' justifyContent={'flex-end'} item>
        {!showMap && (
          <>
            <Grid container flexWrap='nowrap' columnGap='8px' alignItems='center'>
              <Grid
                py='7px'
                px='10px'
                bgcolor={theme.palette.white.dark}
                borderRadius='9px'
                border={`solid 1px ${theme.palette.white.dark}`}
              >
                <Typography noWrap>{data.areaInAcres} Acres</Typography>
              </Grid>
              <Grid
                py='7px'
                px='10px'
                bgcolor={theme.palette.white.dark}
                borderRadius='9px'
                border={`solid 1px ${theme.palette.white.dark}`}
              >
                <Typography>{data.own == 'No' ? 'Leased' : 'Own'}</Typography>
              </Grid>
            </Grid>
            {data?.crops?.length > 0 && (
              <Grid container flexWrap='nowrap' columnGap='8px' alignItems='center'>
                <ColouredGrid>
                  <Leaf height='10px' width='10px' color={'iconColor.default'} />
                  <Typography variant='subtitle2' fontWeight='550' color={'primary'}>
                    {data?.crops?.[0]?.name}
                  </Typography>
                </ColouredGrid>
                {data?.crops?.[1]?.name && (
                  <ColouredGrid>
                    <Leaf height='10px' width='10px' color={'iconColor.default'} />
                    <Typography variant='subtitle2' fontWeight='550' color={'primary'}>
                      {data?.crops?.[1]?.name}
                    </Typography>
                  </ColouredGrid>
                )}
                {data?.crops?.length - 2 > 0 && (
                  <ColouredGrid>
                    <Typography variant='subtitle2' fontWeight='550' color={'primary'}>
                      +{data?.crops?.length - 2}
                    </Typography>
                  </ColouredGrid>
                )}
              </Grid>
            )}
            {/* <Grid container width='fit-content'>
              <ColouredGrid>
                <MoreHorizOutlined fontSize='small' htmlcolor={theme.palette.primary.main} />
              </ColouredGrid>
            </Grid> */}
          </>
        )}
        <Grid
          container
          alignItems='center'
          justifyContent={'flex-end'}
          sx={{
            ml: 2,
          }}
          item
        >
          <Button
            variant='contained'
            onClick={(event: any) => {
              event.stopPropagation();
              changeRoute(`/landparcel/` + data.id);
            }}
          >
            <Typography noWrap variant='subtitle2' fontWeight='550'>
              View Details
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
