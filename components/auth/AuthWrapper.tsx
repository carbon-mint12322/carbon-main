// material-ui
import { styled } from '@mui/material/styles';
import Image from 'next/image';

const AuthWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  minHeight: '100vh',
}));

export default AuthWrapper;
