import React from 'react';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/system';
import If from '../lib/If';
import CircularLoader from './CircularLoader';
import Modal, { ModalProps } from '@mui/material/Modal';

interface ModalCircularLoaderProps extends ModalProps {}

export default function ModalCircularLoader({ open, onClose, children }: ModalCircularLoaderProps) {
  const styles: SxProps = {
    position: 'fixed',
    top: '35%',
    left: '50%',
    p: 1,
  };

  return (
    <>
      <If value={open}>
        <Modal open={open} onClose={onClose}>
          <Box sx={styles}>
            <CircularLoader value={open}>
              <></>
            </CircularLoader>
          </Box>
        </Modal>
      </If>
      {children}
    </>
  );
}
