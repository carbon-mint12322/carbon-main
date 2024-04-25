import { Box, IconButton, Modal, Typography } from '@mui/material';
import React from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import qrCodeImg from '../.././public/assets/images/qrCode.png';
import gmail from '../../public/assets/images/gmail.svg';
import Image from 'next/image';

const QrCodeModel = ({ reportDetails, open, handleClose }: any) => {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '400px',
    maxHeight: '600px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
  };
  const ImageTextGroup = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: '0.5rem',
  };
  const iconStyle = {
    width: '48px',
    height: '48px',
  };
  const qrSrc = '/api/qr?lockId=' + reportDetails?.id;
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h6' component='h2'>
          QR for Sample #{reportDetails?.id}
        </Typography>

        <Image src={qrSrc} width='240' height='240' alt='qrImage' />
        <Typography sx={{ padding: '16px 0px' }}>Share via</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: '1.5rem',
          }}
        >
          <Box sx={ImageTextGroup}>
            <IconButton
              sx={{
                ...iconStyle,
                background: 'linear-gradient(226.97deg, #5BD066 9.27%, #27B43E 100%)',
              }}
            >
              <WhatsAppIcon sx={{ color: 'common.white', fontSize: '28px' }} />
            </IconButton>
            <Typography variant='subtitle2'>Whatsapp</Typography>
          </Box>
          <Box sx={ImageTextGroup}>
            <IconButton
              sx={{
                ...iconStyle,
                background: 'linear-gradient(180deg, #37BBFE 0%, #007DBB 100%)',
              }}
            >
              <TelegramIcon sx={{ color: 'common.white', fontSize: '30px' }} />
            </IconButton>
            <Typography variant='subtitle2'>Telegram</Typography>
          </Box>
          <Box sx={ImageTextGroup}>
            <IconButton
              sx={{
                ...iconStyle,
                bgcolor: 'common.white',
                border: '2px solid #D9D9D9',
              }}
            >
              <Image src={gmail.src} width='25' height='19' alt='gmail' />
            </IconButton>
            <Typography variant='subtitle2'>Gmail</Typography>
          </Box>
          <Box sx={ImageTextGroup}>
            <Box sx={ImageTextGroup}>
              <IconButton
                sx={{
                  ...iconStyle,
                  bgcolor: 'common.white',
                  border: '2px solid #D9D9D9',
                }}
              >
                <InsertLinkIcon fontSize='medium' sx={{ color: 'editColor.contrastText' }} />
              </IconButton>
              <Typography variant='subtitle2'>Copy link</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default QrCodeModel;
