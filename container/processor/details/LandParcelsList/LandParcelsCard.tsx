import React, { MouseEvent } from 'react';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
// import Button from '@mui/material/Button';

import MoreHoriz from '@mui/icons-material/MoreHoriz';
import EnergySavingsLeafOutlinedIcon from '@mui/icons-material/EnergySavingsLeafOutlined';

import CropChip from '~/components/CropChip';
import { LandParcel } from '.';

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'common.white',
    width: '100%',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 24px',
    height: '64px',
  },
  subText: { color: 'text.disabled' },
  btns: { display: 'flex', gap: '8px' },
  imageContainer: {
    position: 'relative',
    padding: '12px 12px 0px 12px',
    width: '100%',
    cursor: 'pointer',
  },
  imageTextField: {
    display: 'flex',
    position: 'absolute',
    justifyContent: 'flex-start',
    gap: '8px',
    bottom: '0px',
    padding: '8px',
    width: '100%',
  },
  cardContent: {
    minWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
};

interface LandParcelsCardProps {
  image?: string;
  landParcelData: LandParcel;
  landParcelTypeColor: string;
  landParcelType: string;
  onCropChipClick?: (e: MouseEvent<HTMLElement>, id: string | number) => void;
  onCardClick?: () => void;
}

function LandParcelsCard({
  image,
  landParcelData,
  landParcelTypeColor,
  landParcelType,
  onCropChipClick = () => null,
  onCardClick = () => null,
}: LandParcelsCardProps) {
  return (
    <Card sx={styles.card}>
      <Box sx={styles.imageContainer} onClick={onCardClick}>
        <CardMedia component={'img'} height={154} image={image} alt={'landParcelImage'} />
        <Box sx={styles.imageTextField}>
          <Paper square={true}>
            <Typography variant={'body2'} p={0.7} px={1.4}>
              {`Sy. ${landParcelData.surveyNumber}`}
            </Typography>
          </Paper>
          <Paper square={true}>
            <Typography variant={'body2'} p={0.7} px={1.4}>
              {`${landParcelData.areaInAcres} Acres`}
            </Typography>
          </Paper>
          <Paper square={true}>
            <Typography
              variant={'body2'}
              p={0.7}
              px={1.4}
              sx={{
                color: landParcelTypeColor,
              }}
            >
              {landParcelType}
            </Typography>
          </Paper>
        </Box>
      </Box>
      <Box sx={styles.cardContent}>
        <Box>
          <Typography variant={'subtitle1'} m={2} mb={0} p={0}>
            {landParcelData.name}
          </Typography>
          <Typography variant={'subtitle2'} mb={2} mx={2} p={0} sx={styles.subText}>
            {`${landParcelData?.address.village}, ${landParcelData?.address.mandal}, ${landParcelData?.address.state} ${landParcelData?.address.pincode}`}
          </Typography>
        </Box>
        {landParcelData?.crops && (
          <Box>
            <Divider />
            <Box sx={styles.footer}>
              <Box sx={styles.btns}>
                <CropChip
                  params={landParcelData.crops || []}
                  Icon={EnergySavingsLeafOutlinedIcon}
                  handleChipClick={onCropChipClick}
                  sx={{
                    color: 'dark.light',
                    bgcolor: 'white.dark',
                  }}
                  iconSx={{
                    fill: 'dark.light',
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
}

export default LandParcelsCard;
