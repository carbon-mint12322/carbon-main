import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import { SxProps } from '@mui/material';
import Loop from '~/components/lib/Loop';
import PdfViewerModel from '~/components/ui/PdfViewerModel';
import Dialog from '~/components/lib/Feedback/Dialog';
import { isImgUrl, getFileUrl } from '~/frontendlib/util';
const Chip = (props: Item) => {
  const [showPdf, setShowPdf] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const domain = window.location.hostname ? window.location.hostname : 'localhost:3000';
  const url = getFileUrl(props.url, domain);
  return (
    <Box sx={{ paddingTop: '28px' }}>
      <Typography variant='subtitle2' sx={{ color: '#757575', paddingBottom: '4px' }}>
        {props?.title}
      </Typography>
      {props.url ? (
        <Typography
          sx={{ cursor: 'pointer', gap: '1', textDecoration: 'underline' }}
          onClick={() => (isImgUrl(props.url) ? setShowImage(true) : setShowPdf(true))}
        >
          {props?.subText}
        </Typography>
      ) : typeof props.subText === 'number' ? (
        <Typography sx={{ display: 'block', marginBottom: 1 }}>{Number(props.subText)}</Typography>
      ) : (
        props?.subText &&
        props.subText.split('\n').map((line, index) => (
          <Typography key={index} sx={{ display: 'block', marginBottom: 1 }}>
            {line}
          </Typography>
        ))
      )}
      {url && <PdfViewerModel open={showPdf} handleClose={() => setShowPdf(false)} pdfLink={url} />}
      {props.url && (
        <Dialog
          onClose={() => setShowImage(false)}
          open={showImage}
          dialogContentProps={{
            sx: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              aspectRatio: '1/1',
              maxHeight: '80vh',
              minHeight: '70vh',
              overflow: 'hidden',
              padding: '0 !important',
            },
          }}
        >
          <img
            src={url}
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'contain',
            }}
            alt='document'
          />
        </Dialog>
      )}
    </Box>
  );
};
interface DetailsCardProps {
  title?: string;
  items?: any[];
  cardStyle?: SxProps;
  cardTitleBarStyle?: SxProps;
  showEditButton?: Boolean;
  handleMainBtnClick: () => void;
}
export interface Item {
  url?: any;
  title?: string;
  subText?: string;
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
function DetailsCard({
  cardStyle = {},
  cardTitleBarStyle = {},
  title,
  handleMainBtnClick,
  items,
  showEditButton = true,
}: DetailsCardProps) {
  return (
    <Paper sx={{ ...styles.cardStyle, ...cardStyle }} elevation={0} square={true}>
      <Box sx={{ ...styles.cardTitleBarStyle, ...cardTitleBarStyle }}>
        <Typography>{title}</Typography>
        {showEditButton && (
          <Button
            variant={'contained'}
            color={'primary'}
            onClick={handleMainBtnClick}
            size={'small'}
          >
            Edit
          </Button>
        )}
      </Box>
      <List>
        <Loop mappable={items} Component={Chip} />
      </List>
    </Paper>
  );
}
export default DetailsCard;