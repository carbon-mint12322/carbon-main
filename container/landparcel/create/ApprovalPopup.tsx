import { CancelOutlined, CheckCircle } from '@mui/icons-material';
import { Button, Dialog, Divider, Grid, IconButton, Modal, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { useOperator } from '~/contexts/OperatorContext';
interface IProps {
  open: boolean;
  handleClose: () => void;
}
export default function ApprovalPopup(props: IProps) {
  const router = useRouter();
  const { changeRoute } = useOperator();
  const { open, handleClose } = props;
  const handleSubmit = () => {
    changeRoute(`/landparcel/list`);
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Grid container direction='column' flexWrap='nowrap' p='40px' gap='24px'>
        <Grid container flexWrap='nowrap' alignItems='center' justifyContent='space-between'>
          <Typography>Complete the following steps to verify</Typography>
          <IconButton sx={{ left: '7px' }} onClick={handleClose}>
            <CancelOutlined />
          </IconButton>
        </Grid>
        <Grid container flexWrap='nowrap' alignItems='center' justifyContent='space-between'>
          <Grid container direction='column' flexWrap='nowrap' gap='4px'>
            <Typography fontSize='12px' fontWeight='550' color='textPrimary'>
              STEP 1
            </Typography>
            <Typography fontSize='15px' fontWeight='600'>
              Enter Basic Info
            </Typography>
          </Grid>
          <Grid>
            <CheckCircle color='success' />
          </Grid>
        </Grid>
        <Divider />
        <Grid container flexWrap='nowrap' alignItems='center' justifyContent='space-between'>
          <Grid container direction='column' flexWrap='nowrap' gap='4px'>
            <Typography fontSize='12px' fontWeight='550' color='textPrimary'>
              STEP 2
            </Typography>
            <Typography fontSize='15px' fontWeight='600'>
              Map Land Boundaries
            </Typography>
          </Grid>
          <Grid>
            <CheckCircle color='success' />
          </Grid>
        </Grid>
        <Divider />
        <Grid container flexWrap='nowrap' alignItems='center' justifyContent='space-between'>
          <Grid container direction='column' flexWrap='nowrap' gap='4px'>
            <Typography fontSize='12px' fontWeight='550' color='textPrimary'>
              STEP 3
            </Typography>
            <Typography fontSize='15px' fontWeight='600'>
              Upload land survey reports
            </Typography>
          </Grid>
          <Grid>
            <CheckCircle color='success' />
          </Grid>
        </Grid>
        <Divider />
        <Grid container justifyContent='flex-end'>
          <Button variant='contained' onClick={handleSubmit}>
            Submit for approval
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}
