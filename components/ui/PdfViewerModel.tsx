import * as React from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const PDFViewer = dynamic(async () => (await import('~/components/pdf-viewer')).default);
// import PDFViewer from '~/components/pdf-viewer';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: '85%',
  maxWidth: { xs: '100vw', sm: '100%' },
  bgcolor: 'background.paper',
  border: '1px solid #E5E5E5',
  boxShadow: 24,
  p: 4,
  overflow: 'scroll',
};

export default function PdfViewerModel({ open, handleClose, pdfLink }: any) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Report
          </Typography>
          <PDFViewer url={pdfLink} />
        </Box>
      </Modal>
    </div>
  );
}
