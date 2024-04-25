import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import styles from '~/styles/theme/brands/styles';

export default function TemporaryDrawer({ Content, parentRef }: any) {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(!open)} variant='contained'>
        Open
      </Button>
      <Grid ref={parentRef} item xs={8}>
        <Drawer
          //   sx={{ border: '1px solid black' }}
          sx={styles.rightDrawer(parentRef)}
          anchor={'right'}
          open={open}
          onClose={() => setOpen(false)}
        >
          <div style={{ padding: 20 }}>{Content}</div>
        </Drawer>
      </Grid>
    </div>
  );
}
