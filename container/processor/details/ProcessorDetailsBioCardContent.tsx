import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import Badge from '@mui/material/Badge';
import EditIcon from '@mui/icons-material/Edit';

import Avatar from '~/components/lib/DataDisplay/Avatar';
import ProcessorDetailsBioCard from './ProcessorDetailsBioCard';
import PdfViewerModel from '~/components/ui/PdfViewerModel';
import { isImgUrl } from '~/frontendlib/util';
import Dialog from '../../../components/lib/Feedback/Dialog';
import { toCamelCase } from '~/components/lib/toCamelCase';

const BioChip = (props: BioItem) => {
  return (
    <Box sx={{ paddingTop: '28px' }}>
      <Typography variant='subtitle2' sx={{ color: '#757575', paddingBottom: '4px' }}>
        {props?.title}
      </Typography>
      <Typography id={toCamelCase(props?.title, 'Value')}>{props?.subText}</Typography>
    </Box>
  );
};

const AdditionalDocumentChip = (props: BioItem) => {
  const [showPdf, setShowPdf] = useState(false);
  const [showImage, setShowImage] = useState(false);
  return (
    props?.url && (
      <Box sx={{ paddingTop: '28px' }}>
        <Typography variant='subtitle2' sx={{ color: '#757575', paddingBottom: '4px' }}>
          {props?.title}
        </Typography>
        <Typography
          id={toCamelCase(props?.title, 'Value')}
          sx={{ cursor: 'pointer', gap: '1', textDecoration: 'underline' }}
          onClick={() => (isImgUrl(props.url) ? setShowImage(true) : setShowPdf(true))}
        >
          {props?.subText}
        </Typography>
        {props.url && (
          <PdfViewerModel
            open={showPdf}
            handleClose={() => setShowPdf(false)}
            pdfLink={props?.url}
          />
        )}
        {props.url && (
          <Dialog
            onClose={() => setShowImage(false)}
            open={showImage}
            dialogContentProps={{ sx: { overflow: 'hidden', padding: '0' } }}
          >
            <img
              src={props?.url}
              style={{
                overflow: 'hidden',
                objectFit: 'contain',
                maxHeight: '100%',
                maxWidth: '100%',
              }}
              alt='document'
            />
          </Dialog>
        )}
      </Box>
    )
  );
};

const IDAndVerificationChip = (props: BioItem) => {
  const [showPdf, setShowPdf] = useState(false);
  const [showImage, setShowImage] = useState(false);
  if (props?.url) {
    return (
      <Box sx={{ paddingTop: '28px' }}>
        <Typography variant='subtitle2' sx={{ color: '#757575', paddingBottom: '4px' }}>
          {props?.title}
        </Typography>
        <Typography
          sx={{ cursor: 'pointer', gap: '1', textDecoration: 'underline' }}
          onClick={() => (isImgUrl(props.url) ? setShowImage(true) : setShowPdf(true))}
        >
          {props?.subText}
        </Typography>
        {props.url && (
          <PdfViewerModel
            open={showPdf}
            handleClose={() => setShowPdf(false)}
            pdfLink={props?.url}
          />
        )}
        {props.url && (
          <Dialog
            onClose={() => setShowImage(false)}
            open={showImage}
            dialogContentProps={{ sx: { overflow: 'hidden', padding: '0' } }}
          >
            <img
              src={props?.url}
              style={{
                overflow: 'hidden',
                objectFit: 'contain',
                maxHeight: '100%',
                maxWidth: '100%',
              }}
              alt='document'
            />
          </Dialog>
        )}
      </Box>
    );
  } else {
    return (
      <Box sx={{ paddingTop: '28px' }}>
        <Typography variant='subtitle2' sx={{ color: '#757575', paddingBottom: '4px' }}>
          {props?.title}
        </Typography>
        <Typography id={toCamelCase(props?.title, 'Value')}>{props?.subText}</Typography>
      </Box>
    );
  }
};

const AvatarWithBadge = (props: BioItem) => {
  if (props.title === 'Full Name') {
    return (
      <>
        <Avatar
          name={props.subText}
          sx={{
            width: '12rem',
            height: '12rem',
            bgcolor: 'primary',
            fontSize: '1.25rem',
            lineHeight: 1.5,
          }}
          src={props.url}
        />
      </>
    );
  }
  return null;
};

export interface BioItem {
  url?: any;
  title?: string;
  subText?: string;
}

export interface ProcessorDetailsBioCardContentProps {
  data?: BioItem[];
  title?: string;
  url?: string;
  onButtonClick?: () => void;
}

const ProcessorDetailsBioCardContent = ({
  data,
  title,
  onButtonClick = () => null,
}: ProcessorDetailsBioCardContentProps) => {
  return (
    <ProcessorDetailsBioCard
      title={title}
      BioChipComponent={
        title == 'Additional Documents'
          ? AdditionalDocumentChip
          : title == 'ID & Verification' || title == 'Operator Details' || title == 'Bank Details'
            ? IDAndVerificationChip
            : BioChip
      }
      bioItems={data}
      AvatarWithBadge={AvatarWithBadge}
      handleMainBtnClick={onButtonClick}
    />
  );
};
export default ProcessorDetailsBioCardContent;
