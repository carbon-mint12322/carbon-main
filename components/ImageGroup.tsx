import React, { useState } from 'react';
import { Box } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
// import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '~/components/lib/Feedback/Dialog';
import { AlignHorizontalRight } from '@mui/icons-material';
import CustomImage from './CustomImage';

export default function ImageGroup({ maxImagesCount, ImagesList, eventType, onclick }: any) {
  const [show, setShow] = useState(false);
  const [imge, setImage] = useState('dd');
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: eventType === 'Submissions' ? '200px' : 'unset',
      }}
    >
      {ImagesList?.slice(0, maxImagesCount - 1).map((item: any, index: number) => (
        <CustomImage
          source={item}
          key={index}
          onClick={() => {
            setImage(item);
            return setShow(!show);
          }}
        />
      ))}
      {show && (
        <Dialog
          onClose={() => setShow(!show)}
          open={true}
          dialogContentProps={{ sx: { overflow: 'hidden', padding: '0' } }}
        >
          <img
            src={imge}
            style={{
              overflow: 'hidden',
              objectFit: 'contain',
              maxHeight: '100%',
              maxWidth: '100%',
            }}
            alt='no image'
          />
        </Dialog>
      )}
      {ImagesList?.length > maxImagesCount - 1 && (
        <Box
          sx={{
            height: '60px',
            width: '60px',
            border: '1px solid #E5E5E5',
            padding: '4px',
          }}
          onClick={onclick}
        >
          <Box
            sx={{
              height: '50px',
              width: '50px',
              background: 'rgba(58, 123, 250, 0.17)',

              padding: '12px',
            }}
          >
            +{ImagesList?.length - maxImagesCount + 1}
          </Box>
        </Box>
      )}
    </Box>
  );
}
