import React from 'react';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import { SxProps } from '@mui/material';

import Loop from '~/components/lib/Loop';
import { BioItem } from './ProcessorDetailsBioCardContent';

interface ProcessorDetailsBioCardProps {
  title?: string;
  BioChipComponent: React.ElementType;
  bioItems?: BioItem[];
  cardStyle?: SxProps;
  cardTitleBarStyle?: SxProps;
  AvatarWithBadge?: React.ElementType;
  handleMainBtnClick: () => void;
}

const styles = {
  cardTitleBarStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardStyle: {
    padding: '32px 48px',
  },
};

function ProcessorDetailsBioCard({
  cardStyle = {},
  cardTitleBarStyle = {},
  title,
  handleMainBtnClick,
  bioItems,
  AvatarWithBadge,
  BioChipComponent,
}: ProcessorDetailsBioCardProps) {
  return (
    <Paper sx={{ ...styles.cardStyle, ...cardTitleBarStyle }} elevation={0} square={true}>
      <Box sx={{ ...styles.cardTitleBarStyle, ...cardTitleBarStyle }}>
        <Typography>{title}</Typography>
        <Button
          id='processorDetailsEditButton'
          variant={'contained'}
          color={'primary'}
          onClick={handleMainBtnClick}
          size={'small'}
        >
          {'Edit'}
        </Button>
      </Box>
      <Box display={['flex', 'flex']} flexDirection={['column', 'row']}>
        <Box display='flex' justifyContent='left' width={['100%', '40%']}>
          <List>
            <Loop mappable={bioItems} Component={BioChipComponent} />
          </List>
        </Box>
        {AvatarWithBadge && (
          <Box
            display='flex'
            justifyContent='left'
            alignItems='center'
            width={['100%', '60%']}
            mt={[2, 0]}
          >
            <Loop mappable={bioItems} Component={AvatarWithBadge} />
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default ProcessorDetailsBioCard;
