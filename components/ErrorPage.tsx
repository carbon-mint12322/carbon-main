import Head from 'next/head';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

const ErrorPage = (props: any) => (
  <>
    <Head>
      <title>Error</title>
    </Head>
    <Typography variant='h2'>Error</Typography>
    <Box sx={{ margin: 5 }}>
      <Alert severity='error'>{props.error}</Alert>
    </Box>
  </>
);

export default ErrorPage;
