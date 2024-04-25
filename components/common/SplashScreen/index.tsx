import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';

const styles = {
  container: {
    margin: 0,
    padding: 0,
    height: '100vh',
    bgcolor: 'common.white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1500,
    position: 'relative',
  },
  wrapper: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function SplashScreen() {
  return (
    <Box component='div' sx={styles.container}>
      <Box component='div' sx={styles.wrapper}>
        <Image
          src='/assets/images/Logo-CarbonMint.svg'
          height={300}
          width={300}
          alt={'CarbonMint'}
        />
      </Box>
    </Box>
  );
}
