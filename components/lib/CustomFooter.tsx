import { FormControlLabel, FormGroup, Grid, Pagination, Switch } from '@mui/material';
import { GridFooter } from '@mui/x-data-grid';
import React, { ReactNode } from 'react';

export default function CustomFooter({
  active,
  showActiveSwitch = false,
  taskFilter,
  showTaskSwitch = false,
  onSwitchClick,
  onTaskFilterSwitchClick,
  children,
}: {
  children: ReactNode;
  showActiveSwitch: boolean;
  active: boolean;
  showTaskSwitch: boolean;
  taskFilter: boolean;
  onSwitchClick: () => void;
  onTaskFilterSwitchClick: () => void;
}) {
  return (
    <Grid container justifyContent='flex-end' alignItems='center' mt='-2px'>
      {children}
      {showActiveSwitch && (
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={active} onClick={onSwitchClick} />}
            label={active ? 'Active' : 'Inactive'}
          />
        </FormGroup>
      )}
      {showTaskSwitch && (
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={taskFilter} onClick={onTaskFilterSwitchClick} />}
            label={taskFilter ? 'My Tasks' : 'Show All'}
          />
        </FormGroup>
      )}
      <GridFooter sx={{ border: 'none' }} />
      {/* <Pagination count={10} variant='outlined' size='small' /> */}
    </Grid>
  );
}
